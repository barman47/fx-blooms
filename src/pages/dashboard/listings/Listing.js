import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Button, Tooltip, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ClockOutline } from 'mdi-material-ui';
import PropTypes from 'prop-types';
import moment from 'moment';

import { getCustomer, getSeller } from '../../../actions/customer';
import { deleteListing } from '../../../actions/listings';

import formatNumber from '../../../utils/formatNumber';
import getCurrencySymbol from '../../../utils/getCurrencySymbol';
import isEmpty from '../../../utils/isEmpty';
import { getAccount } from '../../../actions/bankAccounts';
import { GET_ERRORS, SET_ACCOUNT } from '../../../actions/types';
import { COLORS, LISTING_STATUS, SHADOW } from '../../../utils/constants';
import { DASHBOARD, PROFILE, USER_DETAILS } from '../../../routes';

import BuyEurDrawer from './BuyEurDrawer';

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

const Listing = ({ deleteListing, listing, getAccount, getSeller }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();
    const history = useHistory();

    const errorsState = useSelector(state => state.errors);
    const userId = useSelector(state => state.customer.customerId);

    const [openBuyEurDrawer, setOpenBuyEurDrawer] = useState(false);
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

    useEffect(() => {
        if (openBuyEurDrawer) {
            getAccount(listing.sellersAccountId);
        } else {
            dispatch({
                type: SET_ACCOUNT,
                payload: {}
            });
        }
    }, [dispatch, getAccount, listing.sellersAccountId, openBuyEurDrawer]);

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

    const openTooltip = () => {
        setTooltipOpen(true);
    };

    const closeTooltip = () => {
        setTooltipOpen(false);
    };

    const toggleBuyEurDrawer = () => setOpenBuyEurDrawer(!openBuyEurDrawer);

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
                    <section className={classes.timestamp}>
                        <Tooltip title={moment(new Date(dateCreated)).format('Do MMM, h:mm a')} aria-label="Date Posted" open={tooltipOpen} onOpen={openTooltip} onClose={closeTooltip} arrow>
                            <ClockOutline style={{ fontSize: theme.spacing(2), color: COLORS.darkGrey, cursor: 'pointer', }} />
                        </Tooltip>
                        &nbsp;&nbsp;
                        <Typography variant="subtitle2" component="span" onMouseEnter={openTooltip} onMouseLeave={closeTooltip}>{moment(new Date(dateCreated)).fromNow()}</Typography>
                    </section>
                    {/* <Typography variant="body2" component="p">167 Listings, 89% Completion</Typography> */}
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
                            variant="contained" 
                            size="large" 
                            color="primary"
                            disableElevation
                            classes={{ 
                                contained: classes.button,
                                root: classes.button
                            }}
                            // onClick={() => toggleBuyEurDrawer(listing.sellersAccountId)}
                            onClick={toggleBuyEurDrawer}
                        >
                            Buy EUR
                        </Button>
                    }
                </div>
            </section>
            <BuyEurDrawer drawerOpen={openBuyEurDrawer} toggleDrawer={toggleBuyEurDrawer} listing={listing} />
        </>
    );
};

Listing.propTypes = {
    getAccount: PropTypes.func.isRequired,
    getCustomer: PropTypes.func.isRequired,
    getSeller: PropTypes.func.isRequired,
    listing: PropTypes.object.isRequired,
    deleteListing: PropTypes.func.isRequired
};

export default connect(undefined, { deleteListing, getAccount, getCustomer, getSeller })(Listing);