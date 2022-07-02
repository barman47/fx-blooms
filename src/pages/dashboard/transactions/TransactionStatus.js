import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { 
    Box,
    Button,
    Divider,
    Step,
    Stepper,
    StepContent,
    StepLabel,
    Tooltip,
	Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowLeft, ContentCopy } from 'mdi-material-ui';
import copy from 'copy-to-clipboard';
import toast, { Toaster } from 'react-hot-toast';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { getBid } from '../../../actions/listings';

import { COLORS, SHADOW } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';
import returnLastThreeCharacters from '../../../utils/returnLastThreeCharacters';

import { USER_DETAILS } from '../../../routes';
import { convertToLocalTime } from '../../../utils/getTime';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.white,
        borderRadius: theme.shape.borderRadius,
        boxShadow: SHADOW,
        padding: theme.spacing(0, 5, 5, 5),
        
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1)
        },

        '& header': {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',

            [theme.breakpoints.down('sm')]: {
                alignItems: 'flex-start',
                flexDirection: 'column',
            }
        }
    },

    title: {
        margin: theme.spacing(2, 0),

        '&:first-child': {
            marginTop: theme.spacing(5)
        }
    },

    transactionDetails: {
        border: `1px solid ${COLORS.borderColor}`,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(1),
        padding: theme.spacing(2),
        margin: theme.spacing(0, 5),

        [theme.breakpoints.down('sm')]: {
            margin: 0,
        },

        '& section': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    },

    recipientDetails: {
        color: theme.palette.primary.main,
        cursor: 'pointer',
        textDecoration: 'underline'
    },

    transactionIdContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    transactionStatus: {
        border: `1px solid ${COLORS.borderColor}`,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(1),
        margin: theme.spacing(0, 5),

        [theme.breakpoints.down('sm')]: {
            margin: 0,
        },
    },

    inProgress: {
        color: COLORS.orange
    },

    contact: {
        marginRight: theme.spacing(5),
        marginTop: theme.spacing(2),
        textAlign: 'right',
        textDecoration: 'underline',

        [theme.breakpoints.down('sm')]: {
            marginRight: theme.spacing(1),
        },

        '& a': {
            color: 'inherit',
            fontWeight: 600
        }
    }
}));

const TransactionStatus = ({ getBid, handleSetTitle }) => {
	const classes = useStyles();
    const navigate = useNavigate();

    const { customerId } = useSelector(state => state.customer);
    const { bid } = useSelector(state => state.listings);
    const { transaction } = useSelector(state => state.transactions);

    const [trackerText, setTrackerText] = useState('');
    const [customer, setCustomer] = useState({});
    const [recepient, setRecepient] = useState({});
    const [isBuyer, setIsBuyer] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [transactionSteps, setTransactionSteps] = useState([]);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        if (transaction.seller.currency === 'NGN') {
            getBid(transaction.bidId);
        }
        handleSetTitle('Transaction Status');
        initializeTransaction(transaction);
        // eslint-disable-next-line
    }, []);

    const getActiveNgnStep = (buyer, seller) => {
        if (seller.hasMadePayment) {
            setActiveStep(1);
            if (seller.customerId === customerId) {
                setTrackerText(`Awaiting ${buyer.userName}'s Confirmation`);
            } else {
                setTrackerText(`Awaiting your Confirmation`);
            }
        }

        if (seller.hasMadePayment && buyer.hasReceivedPayment) {
            setActiveStep(2);
            if (!isBuyer) {
                setTrackerText(`Awaiting ${buyer.userName}'s Payment`);
            } else {
                setTrackerText(`Awaiting your Payment`);
            }
        }

        if (buyer.hasMadePayment) {
            setActiveStep(3);
            if (buyer.customerId === customerId) {
                setTrackerText(`Awaiting ${seller.userName}'s confirmation`);
            } else {
                setTrackerText(`Awaiting your confirmation`);
            }
        }

        if (buyer.hasMadePayment && seller.hasReceivedPayment) {
            setActiveStep(4);
            setTrackerText(`Transaction Completed`);
            setCompleted(true);
        }
    };

    const getActiveEurStep = (buyer, seller) => {
        if (buyer.hasMadePayment) {
            setActiveStep(0);
            if (buyer.customerId === customerId) {
                setTrackerText(`Awaiting ${seller.userName}'s Confirmation`);
            } else {
                setTrackerText(`Awaiting your Confirmation`);
            }
        }

        if (buyer.hasMadePayment && seller.hasReceivedPayment) {
            setActiveStep(1);
            if (isBuyer) {
                setTrackerText(`Awaiting ${seller.userName}'s Payment`);
            } else {
                setTrackerText(`Awaiting your Payment`);
            }
        }

        if (seller.hasMadePayment) {
            setActiveStep(2);
            if (seller.customerId === customerId) {
                setTrackerText(`${buyer.userName}'s is awaiting your Payment`);
            } else {
                setTrackerText(`Awaiting ${seller.userName}'s payment`);
            }
        }

        if (seller.hasMadePayment && buyer.hasReceivedPayment) {
            setActiveStep(3);
            setTrackerText(`Transaction Completed`);
            setCompleted(true);
        }
    };

    const getBuyerTransactionSteps = (buyer, seller) => {
        if (seller.currency === 'EUR') {
            setTransactionSteps([
                `You transfered ${buyer.currency ?? ''}${formatNumber(buyer.amountTransfered, 2)} to ${seller.userName}`, 
                'EUR equivalent is moved to your EUR wallet (escrowed)',
                'Your NGN payment confirmed, EUR now available'
            ]);
        } else {
            setTransactionSteps([
                `You accepted offer`, 
                `${seller.userName} to transferred ${seller.currency ?? ''}${formatNumber(seller.amountTransfered, 2)}`,
                'The EUR equivalent debited from your wallet', 
                `Transaction Completed - EUR now made available for ${seller.userName}`,
            ]);
        }
    };

    const getSellerTransactionSteps = (buyer, seller) => {
        if (seller.currency === 'EUR') {
            setTransactionSteps([
                `${buyer.userName} transferred NGN${formatNumber(buyer.amountTransfered, 2)} to you`, 
                `EUR moved to ${buyer.userName}'s wallet (escrowed)`,
                `Transaction Completed - EUR now made available for ${buyer.userName}`
            ]);
        } else {
            setTransactionSteps([
                `${buyer.userName} accepted offer`, 
                `You transfer ${seller.currency ?? ''}${formatNumber(seller.amountTransfered, 2)}`,
                'The EUR equivalent credited to your wallet (Escrowed)',
                'Transaction Completed - EUR now made available for use' 
            ]);
        }
    };

    const initializeTransaction = (transaction) => {
        const { buyer, seller } = transaction;

        if (seller.currency === 'EUR') {
            getActiveEurStep(buyer, seller)
        } else {
            getActiveNgnStep(buyer, seller);
        }

        if (customerId === buyer.customerId) { // Customer is buyer
            setIsBuyer(true);
            setRecepient(seller);
            setCustomer(buyer);
            getBuyerTransactionSteps(buyer, seller);
        }

        if (customerId === seller.customerId) { // Customer is seller
            setRecepient(buyer);
            setCustomer(seller);
            getSellerTransactionSteps(buyer, seller);
        }
    };

    const getEurStepContent = (step, transaction) => {
        const { buyer, seller } = transaction;
        switch (step) {
            case 0:
                return buyer.datePaymentMade ? `${convertToLocalTime(buyer.datePaymentMade).format('MMMM Do YYYY, h:mm:ss a')}` : '';
            
            case 1:
                return seller.datePaymentReceived ? `${convertToLocalTime(seller.datePaymentReceived).format('MMMM Do YYYY, h:mm:ss a')}` : '';

            case 2:
                return seller.datePaymentMade ? `${convertToLocalTime(seller.datePaymentMade).format('MMMM Do YYYY, h:mm:ss a')}` : '';
            
            case 3:
                return buyer.datePaymentReceived ? `${convertToLocalTime(buyer.datePaymentReceived).format('MMMM Do YYYY, h:mm:ss a')}` : '';

          default:
            return '';
        }
    };

    const getNgnStepContent = (step, transaction) => {
        const { buyer, seller } = transaction;
        switch (step) {
            case 0:
                return `${convertToLocalTime(bid.datePlaced).format('MMMM Do YYYY, h:mm:ss a')}`;

            case 1:
                return seller.datePaymentMade ? `${convertToLocalTime(seller.datePaymentMade).format('MMMM Do YYYY, h:mm:ss a')}` : '';
            
            case 2:
                return buyer.datePaymentReceived ? `${convertToLocalTime(buyer.datePaymentReceived).format('MMMM Do YYYY, h:mm:ss a')}` : '';

            case 3:
                return buyer.datePaymentMade ? `${convertToLocalTime(buyer.datePaymentMade).format('MMMM Do YYYY, h:mm:ss a')}` : '';
            
            case 4:
                return seller.datePaymentReceived ? `${convertToLocalTime(seller.datePaymentReceived).format('MMMM Do YYYY, h:mm:ss a')}` : '';

            default:
                return '';
        }
    };

    const getStepContent = (step, transaction) => {
        if (transaction.seller.currency === 'EUR') {
            return getEurStepContent(step, transaction);
        }
        return getNgnStepContent(step, transaction);
    }

    const handleCopyTransactionId = () => {
        copy(transaction.id);
        toast.success('Transaction ID Copied!');
    };

    const handleViewCustomerDetails = () => {
        return navigate(`${USER_DETAILS}/${recepient.customerId}`, { state: { customerId: recepient.customerId } });
    };

	return (    
        <>
            <Toaster />
            <Box component="section" className={classes.root}>
                <Box component="header">
                    <Button 
                        color="primary"
                        variant="outlined" 
                        onClick={() => navigate(-1)}
                        startIcon={<ArrowLeft />}
                    >
                        Back
                    </Button>
                    <Typography variant="h6" className={classes.title} color="primary">Transaction Status - Buy EUR</Typography>
                </Box>
                <Box component="section">
                    <Typography variant="h6" className={classes.title} color="primary">Transaction Details</Typography>
                    <Box component="div" className={classes.transactionDetails}>
                        <Box component="section">
                            <Typography variant="body2" component="p">Transaction ID</Typography>
                            <Box className={classes.transactionIdContainer}>
                                <Typography variant="body2" component="p">{`. . . ${returnLastThreeCharacters(transaction?.id)}${customer.currency ? '-'+ customer.currency.charAt(0) : ''}`}</Typography>
                                &nbsp;&nbsp;
                                <Tooltip title="Copy Transaction ID" arrow>
                                    <ContentCopy onClick={handleCopyTransactionId} color="primary" style={{ cursor: 'pointer' }} />
                                </Tooltip>
                            </Box>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Recepient Username</Typography>
                            <Typography variant="body2" component="p">{recepient.userName}</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Recepient Contact</Typography>
                            <Typography variant="body2" component="p" className={classes.recipientDetails} onClick={handleViewCustomerDetails}>View Recipient Details</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Amount Sent</Typography>
                            <Typography variant="body2" component="p">{`${customer.currency ? customer.currency : ''}${formatNumber(customer.amountTransfered, 2)}`}</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Amount to Receive</Typography>
                            <Typography variant="body2" component="p">{`${recepient.currency ? recepient.currency : ''}${formatNumber(recepient.amountTransfered, 2)}`}</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Transfer Status</Typography>
                            <Typography variant="body2" component="p" className={clsx({[classes.inProgress]: !completed})}>{completed ? 'Completed' : 'In Progress'}</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Date</Typography>
                            <Typography variant="body2" component="p" >{convertToLocalTime(transaction.dateCreated).format('MMMM Do, YYYY')} at {convertToLocalTime(transaction.dateCreated).format('hh:mm a')}</Typography>
                        </Box>
                    </Box>
                    <Typography variant="h6" className={classes.title} color="primary">Tracker - {trackerText}</Typography>
                    <Box className={classes.transactionStatus}>
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {transactionSteps.map((step, index) => (
                                <Step key={index} expanded={true}>
                                    <StepLabel>{step}</StepLabel>
                                    <StepContent>
                                        <Typography>{getStepContent(index, transaction)}</Typography>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                </Box>
                <Typography variant="h6" color="primary" className={classes.contact}>Having issues?&nbsp; 
                    <a className={classes.link} href="mailto:support@fxblooms.com">Contact us</a>
                </Typography>
            </Box>
        </>
    );
};

TransactionStatus.propTypes = {
    getBid: PropTypes.func.isRequired,
    handleSetTitle: PropTypes.func.isRequired
};

export default connect(undefined, { getBid })(TransactionStatus);