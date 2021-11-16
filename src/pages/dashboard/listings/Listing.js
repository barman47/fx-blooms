import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Button, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { getCustomer, getSeller } from '../../../actions/customer';
import { deleteListing } from '../../../actions/listings';

import formatNumber from '../../../utils/formatNumber';
import getCurrencySymbol from '../../../utils/getCurrencySymbol';
import isEmpty from '../../../utils/isEmpty';
import { GET_ERRORS } from '../../../actions/types';
import { COLORS, LISTING_STATUS, SHADOW } from '../../../utils/constants';
import { DASHBOARD, MESSAGES, PROFILE, USER_DETAILS } from '../../../routes';

import Toast from '../../../components/common/Toast';

const useStyles = makeStyles(theme => ({
	root: {
        backgroundColor: COLORS.white,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        boxShadow: SHADOW,
        display: 'grid',
        gridTemplateColumns: '1fr',
        marginBottom: theme.spacing(3),
        overflow: 'hidden',

        '& header': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: [[theme.spacing(1.5), theme.spacing(3)]],
            
            [theme.breakpoints.down('sm')]: {
                rowGap: theme.spacing(2),
                padding: theme.spacing(1, 2)
            },
            
            '& p': {
                fontWeight: 300,
                margin: 0,
                
                '& a': {
                    textDecoration: 'none'
                }
            }
        },
        
        '& div': {
            backgroundColor: COLORS.lightTeal,
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            // gridTemplateColumns: '0.5fr 0.5fr 0.6fr 0.8fr 0.8fr 0.5fr',
            alignItems: 'center',
            gap: theme.spacing(1),
            padding: [[theme.spacing(4), theme.spacing(3)]],

            [theme.breakpoints.down('lg')]: {
                gridTemplateColumns: 'repeat(5, 1fr)',
                // gridTemplateColumns: '0.5fr 0.5fr 0.6fr 0.8fr 0.8fr 0.5fr',
                gap: theme.spacing(1),
                // padding: theme.spacing(1),
                padding: [[theme.spacing(3), theme.spacing(3)]]
            },

            [theme.breakpoints.down('sm')]: {
                padding: theme.spacing(1),
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                rowGap: theme.spacing(2)
            },

            '& span': {
                fontSize: theme.spacing(1.4),
                // fontSize: theme.spacing(1.4),

                [theme.breakpoints.down('lg')]: {
                    // fontSize: theme.spacing(1.2)
                    fontSize: theme.spacing(1.5)
                },
            }
        }
	},

    button: {
        color: `${COLORS.offWhite} !important`,
        height: '100%',

        [theme.breakpoints.down('sm')]: {
            gridColumn: '1 / span 2'
        }
    },

    deleteButton: {
        color: COLORS.offWhite,
        backgroundColor: COLORS.red,
        height: '100%',

        [theme.breakpoints.down('sm')]: {
            gridColumn: '1 / span 2'
        },
        
        '&:hover': {
            backgroundColor: `${COLORS.darkRed} !important`
        }
    }
}));

const Listing = ({ deleteListing, handleAddBid, listing, getSeller }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();
    const history = useHistory();

    const errorsState = useSelector(state => state.errors);
    const userId = useSelector(state => state.customer.customerId);

    const [errors, setErrors] = useState({});

    const { id, amountAvailable, amountNeeded, minExchangeAmount, exchangeRate, listedBy, customerId } = listing;
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
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        }
    }, [dispatch, errors]);

    // const setListing = (e, listing) => {
    //     e.preventDefault();
    //     dispatch({
    //         type: SET_LISTING,
    //         payload: listing
    //     });
    //     return history.push(`${DASHBOARD}${EDIT_LISTING}`);
    // };

    const handleSetCustomer = (e, sellerId) => {
        e.preventDefault();
        if (userId !== customerId) {
            getSeller(sellerId);
            return history.push(`${DASHBOARD}${USER_DETAILS}/${sellerId}`, { sellerId });
        }
        return history.push(`${DASHBOARD}${PROFILE}`);
    };

    const handleDeleteListing = () => {
        const confirm = window.confirm('Are you sure you want to delete this listing?');
        if (confirm) {
            deleteListing(id);
        }
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
                        Listed by:&nbsp;
                        <RouterLink 
                            to={`${DASHBOARD}${USER_DETAILS}`} 
                            onClick={(e) =>handleSetCustomer(e, customerId)}
                            >
                                <span style={{ color: theme.palette.primary.main }}>{userId === customerId ? 'Me' : listedBy}</span>
                        </RouterLink>
                    </Typography>
                    <Typography variant="body2" component="p">167 Listings, 89% Completion</Typography>
                </header>
                <div>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I want to sell</span>
                        {`${amountAvailable?.currencyType}${formatNumber(amountAvailable?.amount)}`}
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Exchange Currency</span>
                        {amountNeeded?.currencyType}
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Exchange rate</span>
                        {`${amountNeeded?.currencyType}${formatNumber(exchangeRate, 2)} to ${getCurrencySymbol(amountAvailable?.currencyType)}1`}
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Minimum Amount</span>
                        {`${minExchangeAmount?.currencyType}${formatNumber(minExchangeAmount?.amount)}`}
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
                            variant="contained" 
                            size="large"
                            disableElevation
                            classes={{ 
                                contained: classes.deleteButton,
                                root: classes.deleteButton
                            }}
                            onClick={handleDeleteListing}
                        >
                            Delete
                        </Button>
                        :
                        <Button
                            to={MESSAGES}
                            component={RouterLink} 
                            variant="contained" 
                            size="large" 
                            color="primary"
                            disableElevation
                            classes={{ 
                                contained: classes.button,
                                root: classes.button
                            }}
                            onClick={(e) => handleAddBid(e, listing)}
                        >
                            Buy EUR
                        </Button>
                    }
                </div>
            </section>
        </>
    );
};

Listing.propTypes = {
    getCustomer: PropTypes.func.isRequired,
    getSeller: PropTypes.func.isRequired,
    handleAddBid: PropTypes.func.isRequired,
    listing: PropTypes.object.isRequired,
    deleteListing: PropTypes.func.isRequired
};

export default connect(undefined, { deleteListing, getCustomer, getSeller })(Listing);