import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@material-ui/styles';
import { ContentCopy } from 'mdi-material-ui';
import clsx from 'clsx';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';

import { SET_TRANSACTION } from '../../../actions/types';

import { COLORS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';
import returnLastSixDigits from '../../../utils/returnLastThreeCharacters';
import getTime, { convertToLocalTime } from '../../../utils/getTime';
import { TRANSACTION_STATUS } from '../../../routes';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.lightTeal,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(2),

        [theme.breakpoints.down('md')]: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
        },

        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr 1fr'
        }
    },

    label: {
        color: COLORS.grey,
        fontWeight: 300
    },

    text: {
        // color: COLORS.offBlack,
        fontWeight: 600,
        marginTop: theme.spacing(1)
    },

    inProgress: {
        color: `${COLORS.orange} !important`
    }
}));

const Transaction = ({ cancelTransaction, transaction }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { customerId } = useSelector(state => state.customer);

    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState('');
    const [timerMinutes, setTimerMinutes] = useState('00');
    const [timerSeconds, setTimerSeconds] = useState('00');
    const [expired, setExpired] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const THIRTY_MINUTES = 1800000; // 30 minutes in milliseconds

    const interval = useRef();

    useEffect(() => {
        setTransactionDetails();
        if (!transaction.buyer.hasMadePayment && !transaction.buyer.hasReceivedPayment && !transaction.seller.hasMadePayment && !transaction.seller.hasReceivedPayment) {
            startExpiryTimer();
            setIsPending(true);
        }

        return () => {
            clearInterval(interval.current);
        }
        // eslint-disable-next-line
    }, []);

    const getTransactionStatus = (isCompleted) => {
    // const getTransactionStatus = (status) => {
        if (isCompleted) {
            return 'Completed';
        }

        return 'Pending';
        // const { CANCELED, COMPLETED, IN_PROGRES } = BID_STATUS;

        // switch (status) {
        //     case IN_PROGRES:
        //         return 'In Progress';

        //     case CANCELED:
        //         return 'Canceled';
            
        //     case COMPLETED:
        //         return 'Completed';

        //     default:
        //         return 'Unknown';
        // }
    };

    const startExpiryTimer = () => {
        // const date = bid.dateLogged.endsWith('Z') ? new Date(bid.dateLogged).getTime() : new Date(bid.dateLogged + 'Z').getTime();
        // let countDownTime = new Date(bid.dateLogged); // Remove 22 Seconds from the timer. I don't know wjy but when it starts there's an additional 22 seconds
        // const countDownTime = date + THIRTY_MINUTES;
        const countDownTime = new Date((convertToLocalTime(transaction.dateCreated))).getTime() + THIRTY_MINUTES;
        interval.current = setInterval(() => {
            const distance = countDownTime - getTime();
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);


            if (minutes <= 0 && seconds <= 0) {
                clearInterval(interval.current);
                setExpired(true);
                setTimerMinutes('00');
                setTimerSeconds('00');
                // expireListing();
                // setTimerValue(0);
            } else {
                setTimerMinutes(minutes < 10 ? `0${minutes}` : minutes);
                setTimerSeconds(seconds < 10 ? `0${seconds}` : seconds);
                // setTimerValue(Math.floor(distance / THIRTY_MINUTES * 100));
            }
        }, 1000);
    };

    const setTransactionDetails = () => {
        const { amount, currency } = getTransactionDetails(transaction);
        setAmount(amount);
        setCurrency(currency);
    };

    const getTransactionDetails = () => {
        const { buyer, seller, isCompleted } = transaction;

        if (buyer.customerId === customerId) {
            return { 
                amount: buyer.amountTransfered, 
                currency: buyer.currency,
                reference: buyer.transferReference,
                status:  getTransactionStatus(isCompleted)
            };
        }

        if (seller.customerId === customerId) {
            return { 
                amount: seller.amountTransfered,  
                currency: seller.currency,
                reference: seller.transferReference,
                status:  getTransactionStatus(isCompleted) 
            };
        }
    };

    const gotoTransaction = () => {
        // Put transaction in state
        dispatch({
            type: SET_TRANSACTION,
            payload: transaction
        });
        return navigate(TRANSACTION_STATUS);
    };

    const copyListingId = () => {
        copy(transaction.listingId);
        toast.success('Listing ID copied');
    };

    const handleCancelTransaction = () => {
        if (window.confirm('Are you sure you want to cancel this transaction?')) {
            cancelTransaction(transaction.id, transaction.bidId)
        }
    };

    return (
        <Box component="section" className={classes.root}>
            <Box component="div">
                <Typography variant="body2" component="span" className={classes.label}>Time</Typography>
                <Typography variant="body1" component="p" className={classes.text}>{convertToLocalTime(transaction.dateCreated).fromNow()}</Typography>
            </Box>
            <Box component="div">
                {isPending ? 
                    <>
                        <Typography variant="body2" component="span" className={classes.label}>Transaction Countdown</Typography>
                        <Typography variant="body1" component="p" className={classes.text}>{`00: ${timerMinutes}:${timerSeconds}`}</Typography>
                    </>
                    :
                    <>
                        <Typography variant="body2" component="span" className={classes.label}>Transaction Type</Typography>
                        <Typography variant="body1" component="p" className={classes.text}>P2P Exchange</Typography>
                    </>
                }
                
            </Box>
            <Box component="div">
                <Typography variant="body2" component="span" className={classes.label}>Amount Tendered</Typography>
                <Typography variant="body1" component="p" className={classes.text}>{currency}{formatNumber(amount, 2)}</Typography>
            </Box>
            <Box component="div">
                <Typography variant="body2" component="span" className={classes.label}>Listing ID</Typography>
                <Typography variant="body1" component="p" className={classes.text}>
                    ... {returnLastSixDigits(transaction.listingId, 6)}
                    <Tooltip title="Copy Listing ID" arrow>
                        <IconButton onClick={copyListingId} size="small">
                            <ContentCopy />
                        </IconButton>
                    </Tooltip>
                </Typography>
            </Box>
            <Box component="div">
                <Typography variant="body2" component="span" className={classes.label}>Status</Typography>
                {isPending ? 
                    <Typography variant="body1" component="p" color="error" className={clsx(classes.text)}>Pending</Typography> 
                    : 
                    <Typography variant="body1" component="p" className={clsx(classes.text, {[classes.inProgress]: !transaction.isClosed})}>{transaction?.isClosed ? 'Completed' : 'In Progress'}</Typography>
                }
            </Box>
            {isPending ? 
                <Button 
                    variant="outlined" 
                    color="secondary" 
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    onClick={handleCancelTransaction}
                    disabled={!expired}
                >
                    Cancel
                </Button>
                :
                <Button 
                    variant="outlined" 
                    color="primary" 
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                    onClick={gotoTransaction}
                >
                    View More
                </Button>
            }
            
        </Box>
    );
};

Transaction.propTypes = {
    transaction: PropTypes.object.isRequired,
    cancelTransaction: PropTypes.func
};

export default Transaction;