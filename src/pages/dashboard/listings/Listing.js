import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Box, Button, ButtonGroup, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { decode } from 'html-entities';

import { getSeller } from '../../../actions/customer';
import { deleteListing } from '../../../actions/listings';

import formatNumber from '../../../utils/formatNumber';
import { REMOVE_EXPIRED_LISTING } from '../../../actions/types';
import { COLORS, LISTING_STATUS, SHADOW } from '../../../utils/constants';
import { PROFILE, USER_DETAILS } from '../../../routes';

import eurLogo from '../../../assets/img/eur-logo.svg';
import ngnLogo from '../../../assets/img/ngn-logo.svg';
import { convertToLocalTime } from '../../../utils/getTime';

const useStyles = makeStyles(theme => ({
	root: {
        backgroundColor: COLORS.white,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        boxShadow: SHADOW,
        display: 'grid',
        marginBottom: theme.spacing(3),
        gridTemplateColumns: '1fr',
        overflow: 'hidden',

        '& header': {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: [[theme.spacing(1.5), theme.spacing(3)]],

            '& div:nth-child(2)': {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginLeft: theme.spacing(2),
                width: '100%',

                [theme.breakpoints.down('sm')]: {
                    flexDirection: 'column',
                    alignItems: 'flex-end'
                },
            },
            
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

    listingContent: {
        backgroundColor: COLORS.lightTeal,
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: theme.spacing(1),
        padding: [[theme.spacing(2), theme.spacing(4), theme.spacing(2), theme.spacing(8)]],
        // padding: [[theme.spacing(4), theme.spacing(3)]],

        [theme.breakpoints.down('lg')]: {
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: theme.spacing(1),
            // padding: [[theme.spacing(4), theme.spacing(4), theme.spacing(4), theme.spacing(8)]],
            // padding: [[theme.spacing(3), theme.spacing(3)]]
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
                fontSize: theme.spacing(1.5)
            }
        }
    },

    button: {
        alignSelf: 'center',
        color: COLORS.offWhite,

        [theme.breakpoints.down('sm')]: {
            gridColumn: '1 / span 2'
        }
    },

    buttons: {
        alignSelf: 'center'
    },

    buttonGroup: {
        [theme.breakpoints.down('sm')]: {
            gridColumn: '1 / span 2'
        }
    }
}));

const Listing = ({ handleAddBid, handleAcceptOffer, deleteListing, handleEditListing, listing, getSeller }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();
    const navigate = useNavigate();

    const userId = useSelector(state => state.customer.customerId);

    const [expired] = useState(false);
    const [timerHours, setTimerHours] = useState('0');
    const [timerMinutes, setTimerMinutes] = useState('00');
    const [timerSeconds, setTimerSeconds] = useState('00');

    const { id, amountAvailable, amountNeeded, bank, exchangeRate, listedBy, customerId, dateCreated } = listing;
    const { finalized, open } = LISTING_STATUS;

    const interval = useRef();

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

    const startExpiryTimer = () => {
        const countDownDate = new Date((convertToLocalTime(dateCreated))).getTime() + 259200000; // number of milliseconds in 3 days
        interval.current = setInterval(() => {
            const now = new Date().getTime();
            const distance = countDownDate - now;

            const hours = Math.floor((distance / (1000*60*60)));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (distance <= 0) {
                clearInterval(interval.current);
                // setExpired(true);
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
            return navigate(`${USER_DETAILS}/${sellerId}`, { state: { customerId: sellerId }});
        }
        return navigate(PROFILE);
    };

    const handleDeleteListing = () => {
        const confirm = window.confirm('Are you sure you want to delete this listing?');
        if (confirm) {
            deleteListing(id);
        }
    };

    const handleBuyButtonClick = (listing) => {
        if (listing.amountAvailable.currencyType === 'EUR') {
            return handleAddBid(listing);
        }
        return handleAcceptOffer(listing);
    };
    
    return (
        <>
            <section className={classes.root}>
                <header>
                    {listing.amountAvailable.currencyType === 'EUR' ? 
                        <img src={eurLogo} alt="EUR" />
                        : 
                        <img src={ngnLogo} alt="NGN" />
                    }
                    <Box component="div">
                        <Typography variant="body2" component="p">
                            Listed by:&nbsp;
                            <RouterLink 
                                to={USER_DETAILS} 
                                onClick={(e) =>handleSetCustomer(e, customerId)}
                                >
                                    <span style={{ color: theme.palette.primary.main, fontWeight: 600 }}>{userId === customerId ? 'Me' : listedBy?.toLowerCase()}</span>
                            </RouterLink>
                        </Typography>
                        <section className={classes.timestamp}>
                            <Typography variant="subtitle2" component="span">Expires in: &nbsp;&nbsp;&nbsp;<span style={{ color: theme.palette.primary.main, fontWeight: 600 }}>{timerHours}:{timerMinutes}:{timerSeconds}</span></Typography>
                        </section>
                    </Box>
                    {/* <Typography variant="body2" component="p">167 Listings, 89% Completion</Typography> */}
                </header>
                <Box component="div" className={classes.listingContent}>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I will receive</span>
                        {userId === customerId ? 
                            `${amountNeeded?.currencyType}${formatNumber(amountNeeded?.amount)}`
                            : 
                            `${amountAvailable?.currencyType}${formatNumber(amountAvailable?.amount)}`
                        }
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I will send</span>
                        {userId === customerId ? 
                            `${amountAvailable?.currencyType}${formatNumber(amountAvailable?.amount)}`
                            : 
                            `${amountNeeded?.currencyType}${formatNumber(amountNeeded?.amount)}`
                        }
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Exchange rate</span>
                        {`NGN${formatNumber(exchangeRate, 2)} to ${decode('&#8364;')}1`}
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        {amountAvailable?.currencyType === 'EUR' && 
                            <>
                                <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Paying From</span>
                                {bank?.toUpperCase()}
                            </>
                        }
                    </Typography>
                    {listing.status === finalized ?
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
                            Accepted
                        </Button>
                        :
                        listing.customerId === userId ? 
                        <ButtonGroup 
                            className={classes.buttonGroup}
                            variant="contained" 
                            aria-label="contained primary button group" 
                            disableElevation 
                            disableFocusRipple
                            fullWidth
                        >
                            <Button 
                                className={classes.buttons}
                                color="primary"
                                size="large"
                                disableElevation
                                disableFocusRipple
                                disableRipple
                                onClick={() => handleEditListing(listing)}
                                disabled={listing.status !== open}
                            >
                                Edit
                            </Button>
                            <Button 
                                className={classes.buttons}
                                color="secondary"
                                size="large"
                                disableElevation
                                disableFocusRipple
                                disableRipple
                                onClick={handleDeleteListing}
                                disabled={listing.status !== open}
                            >
                                Delete
                            </Button>
                        </ButtonGroup>
                        :
                        <Button
                            variant="contained" 
                            size="large" 
                            color="primary"
                            disableElevation
                            disableFocusRipple
                            disableRipple
                            classes={{ 
                                contained: classes.button,
                                root: classes.button
                            }}
                            onClick={() => handleBuyButtonClick(listing)}
                        >
                            {`Buy ${amountAvailable?.currencyType}`}
                        </Button>
                    }
                </Box>
            </section>
        </>
    );
};

Listing.propTypes = {
    handleAcceptOffer: PropTypes.func.isRequired,
    handleAddBid: PropTypes.func.isRequired,
    getSeller: PropTypes.func.isRequired,
    handleEditListing: PropTypes.func.isRequired,
    listing: PropTypes.object.isRequired,
    deleteListing: PropTypes.func.isRequired
};

export default connect(undefined, { deleteListing, getSeller })(Listing);