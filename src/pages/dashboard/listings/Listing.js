import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Button, IconButton, Tooltip, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ClockOutline, DeleteForeverOutline } from 'mdi-material-ui';
import PropTypes from 'prop-types';
import moment from 'moment';

import { SET_LISTING } from '../../../actions/types';
import { getCustomer, getSeller } from '../../../actions/customer';
import { deleteListing } from '../../../actions/listings';

import formatNumber from '../../../utils/formatNumber';
import getCurrencySymbol from '../../../utils/getCurrencySymbol';
import isEmpty from '../../../utils/isEmpty';
import { GET_ERRORS } from '../../../actions/types';
import { COLORS, LISTING_STATUS, SHADOW } from '../../../utils/constants';
import { DASHBOARD, EDIT_LISTING, MESSAGES, PROFILE, USER_DETAILS } from '../../../routes';

import Toast from '../../../components/common/Toast';

const useStyles = makeStyles(theme => ({
	root: {
        backgroundColor: COLORS.white,
        borderRadius: theme.shape.borderRadius,
        boxShadow: SHADOW,
        display: 'grid',
        gridTemplateColumns: '1fr',
        marginBottom: theme.spacing(3),
        overflow: 'hidden',

        '& header': {
            backgroundColor: COLORS.lightTeal,
            display: 'grid',
            gridTemplateColumns: '1fr',
            padding: [[theme.spacing(1), theme.spacing(3)]],
    
            [theme.breakpoints.down('sm')]: {
                padding: theme.spacing(1, 2)
            }
        }    
	},

    
    listingHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        

        '& p': {
            fontWeight: 300,
            '& a': {
                textDecoration: 'none'
            }
        }
    },

    timestamp: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

        '& span': {
            color: COLORS.darkGrey,
            cursor: 'pointer',
            fontSize: theme.spacing(1.3),
            fontWeight: 300
        }
    },

    listingBody: {
        display: 'grid',
        gridTemplateColumns: '0.5fr 0.5fr 0.6fr 0.8fr 0.8fr 0.5fr',
        alignItems: 'center',
        gap: theme.spacing(2),
        padding: [[theme.spacing(4), theme.spacing(3)]],

        [theme.breakpoints.down('lg')]: {
            gridTemplateColumns: '0.5fr 0.5fr 0.6fr 0.8fr 0.8fr 0.5fr',
            gap: theme.spacing(1),
            padding: theme.spacing(1),
        },

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1),
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            rowGap: theme.spacing(2)
        },

        '& span': {
            fontSize: theme.spacing(1.4),

            [theme.breakpoints.down('lg')]: {
                fontSize: theme.spacing(1.2)
            },
        }
    },

    button: {
        color: `${COLORS.offWhite} !important`,
        padding: [[theme.spacing(0.5), theme.spacing(1)]],

        [theme.breakpoints.down('sm')]: {
            gridColumn: '1 / span 2'
        }
    },

    deleteButton: {
        alignSelf: 'flex-end !important',
        padding: theme.spacing(0.8),
        color: COLORS.red
    }
}));

const Listing = ({ deleteListing, handleAddBid, listing, getSeller }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();
    const history = useHistory();

    const errorsState = useSelector(state => state.errors);
    const userId = useSelector(state => state.customer.customerId);

    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [errors, setErrors] = useState({});

    const { id, amountAvailable, amountNeeded, minExchangeAmount, exchangeRate, listedBy, customerId, dateCreated } = listing;
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

    const openTooltip = () => {
        setTooltipOpen(true);
    };
    const closeTooltip = () => {
        setTooltipOpen(false);
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
                    <div className={classes.listingHeader}>
                        <Typography variant="body2" component="p">
                            Listed by:&nbsp;
                            <RouterLink 
                                to={`${DASHBOARD}${USER_DETAILS}`} 
                                onClick={(e) =>handleSetCustomer(e, customerId)}
                                >
                                    <span style={{ color: theme.palette.primary.main }}>{userId === customerId ? 'Me' : listedBy}</span>
                            </RouterLink>
                        </Typography>
                        {listing.customerId === userId && 
                            <IconButton classes={{ root: classes.deleteButton }} onClick={handleDeleteListing}>
                                <Tooltip title="Edit Listing" aria-label="Delete Listing" arrow>
                                    <DeleteForeverOutline />
                                </Tooltip>
                            </IconButton>
                        }
                    </div>
                    {/* <Typography variant="body2" component="p">100% Listings, 89% Completion</Typography> */}
                    <section className={classes.timestamp}>
                        <Tooltip title={moment(new Date(dateCreated)).format('Do MMM YYYY, h:mm a')} aria-label="Date Posted" open={tooltipOpen} onOpen={openTooltip} onClose={closeTooltip} arrow>
                            <ClockOutline style={{ fontSize: theme.spacing(2), color: COLORS.darkGrey, cursor: 'pointer', }} />
                        </Tooltip>
                        &nbsp;&nbsp;
                        <Typography variant="subtitle2" component="span" onMouseEnter={openTooltip} onMouseLeave={closeTooltip}>{moment(new Date(dateCreated)).fromNow()}</Typography>
                    </section>
                </header>
                <div className={classes.listingBody}>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I Have</span>
                        {`${getCurrencySymbol(amountAvailable?.currencyType)}${formatNumber(amountAvailable?.amount)}`}
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I Want</span>
                        {`${getCurrencySymbol(amountNeeded?.currencyType)}${formatNumber(amountNeeded?.amount)}`}
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Min. Amount</span>
                        {`${getCurrencySymbol(minExchangeAmount?.currencyType)}${formatNumber(minExchangeAmount?.amount)}`}
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Exchange rate</span>
                        {`${getCurrencySymbol(amountNeeded?.currencyType)}${formatNumber(exchangeRate, 2)} to ${getCurrencySymbol(amountAvailable?.currencyType)}1`}
                    </Typography>
                    {listing.bank && 
                        <Typography variant="subtitle2" component="span">
                            <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Paying from</span>
                            {listing.bank}
                        </Typography>
                    }
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
                            onClick={(e) => handleAddBid(e, listing)}
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
    getCustomer: PropTypes.func.isRequired,
    getSeller: PropTypes.func.isRequired,
    handleAddBid: PropTypes.func.isRequired,
    listing: PropTypes.object.isRequired,
    deleteListing: PropTypes.func.isRequired
};

export default connect(undefined, { deleteListing, getCustomer, getSeller })(Listing);