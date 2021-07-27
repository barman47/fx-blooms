import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Button, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { SET_LISTING } from '../../../actions/types';
import { getCustomer, getSeller } from '../../../actions/customer';
import { addBid } from '../../../actions/listings';

import isEmpty from '../../../utils/isEmpty';
import { COLORS, LISTING_STATUS, SHADOW } from '../../../utils/constants';
import { DASHBOARD, EDIT_LISTING, MESSAGES, USER_DETAILS } from '../../../routes';

import Toast from '../../../components/common/Toast';

const useStyles = makeStyles(theme => ({
	root: {
        borderRadius: '5px',
        boxShadow: SHADOW,
        display: 'grid',
        gridTemplateColumns: '1fr',
        marginBottom: theme.spacing(3),

        '& header': {
            backgroundColor: COLORS.lightTeal,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: [[theme.spacing(2), theme.spacing(3)]],

            [theme.breakpoints.down('sm')]: {
                display: 'grid',
                gridTemplateColumns: '1fr',
                rowGap: theme.spacing(2),
                padding: theme.spacing(1, 2)
            },

            '& p': {
                fontWeight: 300,
                '& a': {
                    textDecoration: 'none'
                }
            }
        },

        '& div': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: [[theme.spacing(4), theme.spacing(3)]],

            [theme.breakpoints.down('sm')]: {
                padding: theme.spacing(1),
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                rowGap: theme.spacing(2)
            }
        },

        [theme.breakpoints.down('sm')]: {

        }
	},

    button: {
        padding: [[theme.spacing(0.5), theme.spacing(5)]],
        [theme.breakpoints.down('sm')]: {
            gridColumn: '1 / span 2'
        }
    }
}));

const Listing = ({ addBid, listing, getSeller }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();
    const history = useHistory();

    const errorsState = useSelector(state => state.errors);
    const userId = useSelector(state => state.customer.customerId);

    const [errors, setErrors] = useState({});

    const { amountAvailable, amountNeeded, minExchangeAmount, exchangeRate, listedBy, customerId, id } = listing;
    // const { bids, status, id } = listing;

    const toast = useRef();

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors({ msg: errorsState.msg });
        }
    }, [errorsState]);

    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    const setListing = (e, listing) => {
        e.preventDefault();
        dispatch({
            type: SET_LISTING,
            payload: listing
        });
        return history.push(`${DASHBOARD}${EDIT_LISTING}`);
    };

    const handleSetCustomer = (e, sellerId) => {
        e.preventDefault();
        getSeller(sellerId);
        return history.push(`${DASHBOARD}${USER_DETAILS}/${sellerId}`, { sellerId });
    };

    const handleAddBid = (e) => {
        e.preventDefault();
        addBid({
            listingId: id,
            amount: {
                currencyType: minExchangeAmount.currencyType,
                amount: minExchangeAmount.amount
            }
        }, history);
    };

    return (
        <>
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            <section className={classes.root}>
                <header>
                    <Typography variant="body2" component="p">
                        Listed by: <RouterLink to={`${DASHBOARD}${USER_DETAILS}`} onClick={(e) =>handleSetCustomer(e, customerId)}><span style={{ color: theme.palette.primary.main }}>{listedBy}</span></RouterLink>
                    </Typography>
                    <Typography variant="body2" component="p">100% Listings, 89% Completion</Typography>
                </header>
                <div>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I Have</span>
                        &#163;{amountAvailable?.amount}
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I Want</span>
                        &#8358;{amountNeeded?.amount}
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Minimum Amount</span>
                        &#163;{minExchangeAmount?.amount}
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Exchange rate</span>
                        &#8358;{exchangeRate} to &#163;1
                    </Typography>
                    {listing.status === LISTING_STATUS.negotiation ?
                        <Button 
                            disabled
                            to="#!"
                            component={RouterLink} 
                            variant="contained" 
                            size="small" 
                            color="primary"
                            disableElevation
                            classes={{ 
                                contained: classes.button,
                                root: classes.button
                            }}
                        >
                            In Negotiation
                        </Button>
                        :
                        listing.customerId === userId ? 
                        <Button 
                            to={`${DASHBOARD}${EDIT_LISTING}`}
                            component={RouterLink} 
                            variant="contained" 
                            size="small" 
                            color="primary"
                            disableElevation
                            classes={{ 
                                contained: classes.button,
                                root: classes.button
                            }}
                            onClick={(e) => setListing(e, listing)}
                        >
                            Edit
                        </Button>
                        :
                        <Button 
                            to={MESSAGES}
                            component={RouterLink} 
                            variant="contained" 
                            size="small" 
                            color="primary"
                            disableElevation
                            classes={{ 
                                contained: classes.button,
                                root: classes.button
                            }}
                            onClick={handleAddBid}
                        >
                            Contact
                        </Button>
                    }
                </div>
            </section>
        </>
    );
};

Listing.propTypes = {
    addBid: PropTypes.func.isRequired,
    getCustomer: PropTypes.func.isRequired,
    getSeller: PropTypes.func.isRequired,
    listing: PropTypes.object.isRequired
};

export default connect(undefined, { addBid, getCustomer, getSeller })(Listing);