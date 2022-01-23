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
import { getAccount } from '../../../actions/bankAccounts';
import { GET_ERRORS, REMOVE_EXPIRED_LISTING, SET_ACCOUNT } from '../../../actions/types';
import { COLORS, ID_STATUS, LISTING_STATUS, SHADOW } from '../../../utils/constants';
import { PROFILE, USER_DETAILS } from '../../../routes';

import PlaceBidDrawer from './PlaceBidDrawer';

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
            gridTemplateColumns: 'repeat(6, 1fr)',
            // gridTemplateColumns: '0.5fr 0.5fr 0.6fr 0.8fr 0.8fr 0.5fr',
            // alignItems: 'center',
            gap: theme.spacing(1),
            padding: [[theme.spacing(4), theme.spacing(3)]],

            [theme.breakpoints.down('lg')]: {
                gridTemplateColumns: 'repeat(6, 1fr)',
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
        alignSelf: 'center',
        color: COLORS.offWhite,

        [theme.breakpoints.down('sm')]: {
            gridColumn: '1 / span 2'
        }
    },

    deleteButton: {
        alignSelf: 'center',
        color: COLORS.offWhite,
        backgroundColor: COLORS.red,

        [theme.breakpoints.down('sm')]: {
            gridColumn: '1 / span 2'
        },
        
        '&:hover': {
            backgroundColor: `${COLORS.darkRed} !important`
        }
    }
}));

const Listing = ({ checkIdStatus, deleteListing, listing, getAccount, getSeller }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();
    const history = useHistory();

    const errorsState = useSelector(state => state.errors);
    const { stats } = useSelector(state => state.customer);
    const userId = useSelector(state => state.customer.customerId);

    const [openPlaceBidDrawer, setOpenPlaceBidDrawer] = useState(false);
    const [expired, setExpired] = useState(false);
    const [timerHours, setTimerHours] = useState('0');
    const [timerMinutes, setTimerMinutes] = useState('0');
    const [timerSeconds, setTimerSeconds] = useState('0');
    const [errors, setErrors] = useState({});

    const { id, amountAvailable, amountNeeded, bank, minExchangeAmount, exchangeRate, listedBy, customerId, dateCreated } = listing;

    const toast = useRef();
    const interval = useRef();

    const { NOT_SUBMITTED } = ID_STATUS;

    useEffect(() => {
        startExpiryTimer();
        return () => {
            clearInterval(interval.current);
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (expired) {
            dispatch({
                type: REMOVE_EXPIRED_LISTING,
                payload: listing.id
            });
        }
    }, [dispatch, expired, listing.id]);

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
        if (openPlaceBidDrawer) {
            // getAccount(listing.sellersAccountId);
        } else {
            dispatch({
                type: SET_ACCOUNT,
                payload: {}
            });
        }
    }, [dispatch, getAccount, listing.sellersAccountId, openPlaceBidDrawer]);

    const startExpiryTimer = () => {
        const countDownDate = new Date(dateCreated).getTime() + 345600000; // number of milliseconds in 4 days
        interval.current = setInterval(() => {
            const now = new Date().getTime();
            const distance = countDownDate - now;

            const hours = Math.floor((distance / (1000*60*60)));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (distance < 0) {
                clearInterval(interval.current);
                setExpired(true);
                setTimerHours('00');
                setTimerMinutes('00');
                setTimerSeconds('00');
            } else {
                setTimerHours(hours < 10 ? `0${hours}` : hours);
                setTimerMinutes(minutes < 10 ? `0${minutes}` : minutes);
                setTimerSeconds(seconds < 10 ? `0${seconds}` : seconds);
            }
        }, 1000);
    };

    const handleSetCustomer = (e, sellerId) => {
        e.preventDefault();
        if (userId !== customerId) {
            getSeller(sellerId);
            return history.push(`${USER_DETAILS}/${sellerId}`, { sellerId });
        }
        return history.push(PROFILE);
    };

    const handleDeleteListing = () => {
        const confirm = window.confirm('Are you sure you want to delete this listing?');
        if (confirm) {
            deleteListing(id);
        }
    };
    
    const togglePlaceBidDrawer = () => {
        if (stats.idStatus === NOT_SUBMITTED && stats.residencePermitStatus === NOT_SUBMITTED) {
            return checkIdStatus();
        }
        setOpenPlaceBidDrawer(!openPlaceBidDrawer);
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
            {openPlaceBidDrawer && <PlaceBidDrawer drawerOpen={openPlaceBidDrawer} toggleDrawer={togglePlaceBidDrawer} listing={listing} />}
            <section className={classes.root}>
                <header>
                    <Typography variant="body2" component="p">
                        Listed by:&nbsp;
                        <RouterLink 
                            to={USER_DETAILS} 
                            onClick={(e) =>handleSetCustomer(e, customerId)}
                            >
                                <span style={{ color: theme.palette.primary.main, fontWeight: 600 }}>{userId === customerId ? 'Me' : listedBy}</span>
                        </RouterLink>
                    </Typography>
                    <section className={classes.timestamp}>
                        <Typography variant="subtitle2" component="span">Expires in: &nbsp;&nbsp;&nbsp;<span style={{ color: theme.palette.primary.main, fontWeight: 600 }}>{timerHours}:{timerMinutes}:{timerSeconds}</span></Typography>
                    </section>
                    {/* <Typography variant="body2" component="p">167 Listings, 89% Completion</Typography> */}
                </header>
                <div>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>You receive</span>
                        {`${amountAvailable?.currencyType}${formatNumber(amountAvailable?.amount)}`}
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>You send</span>
                        {`${amountNeeded?.currencyType}${formatNumber(amountNeeded?.amount)}`}
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Exchange rate</span>
                        {`${amountNeeded?.currencyType}${formatNumber(exchangeRate, 2)} to ${getCurrencySymbol(amountAvailable?.currencyType)}1`}
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Minimum Amount</span>
                        {`${minExchangeAmount?.currencyType}${formatNumber(minExchangeAmount?.amount)}`}
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Paying From</span>
                        {bank.toUpperCase()}
                    </Typography>
                    {listing.status === LISTING_STATUS.negotiation ?
                        <Button 
                            disabled
                            to="#!"
                            component={RouterLink} 
                            variant="contained" 
                            size="large" 
                            color="primary"
                            disableElevation
                            classes={{ 
                                contained: classes.button,
                                root: classes.button
                            }}
                        >
                            Just Accepted
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
                            // onClick={() => togglePlaceBidDrawer(listing.sellersAccountId)}
                            onClick={togglePlaceBidDrawer}
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
    checkIdStatus: PropTypes.func.isRequired,
    getAccount: PropTypes.func.isRequired,
    getCustomer: PropTypes.func.isRequired,
    getSeller: PropTypes.func.isRequired,
    listing: PropTypes.object.isRequired,
    deleteListing: PropTypes.func.isRequired
};

export default connect(undefined, { deleteListing, getAccount, getCustomer, getSeller })(Listing);