import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import moment from 'moment';

import { COLORS, SHADOW } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';
import returnLastThreeCharacters from '../../../utils/returnLastThreeCharacters';

import { USER_DETAILS } from '../../../routes';

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

const TransactionStatus = ({ handleSetTitle }) => {
	const classes = useStyles();
    const navigate = useNavigate();

    const { customerId } = useSelector(state => state.customer);
    const { transaction } = useSelector(state => state.transactions);

    const [trackerText, setTrackerText] = useState('');
    const [customer, setCustomer] = useState({});
    const [recepient, setRecepient] = useState({});
    const [isBuyer, setIsBuyer] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [transactionSteps, setTransactionSteps] = useState([]);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        handleSetTitle('Transaction Status');
        initializeTransaction(transaction);
        // eslint-disable-next-line
    }, []);

    // Set the current step to the 5th one - Exception
    // useEffect(() => {
    //     if (activeStep === 3 && transactionSteps.length === 5) {
    //         setActiveStep(4);
    //     }
    // }, [activeStep, transactionSteps.length]);

    const getActiveStep = (buyer, seller) => {
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

    const initializeTransaction = (transaction) => {
        const { buyer, seller } = transaction;
        getActiveStep(buyer, seller);

        if (customerId === buyer.customerId) { // Customer is buyer
            setIsBuyer(true);
            setRecepient(seller);
            setCustomer(buyer);
            setTransactionSteps([
                `You transfer NGN${formatNumber(buyer.amountTransfered, 2)} to ${seller.userName}`, 
                `${seller.userName} to confirm the NGN payment`, 
                `${seller.userName} to transfer EUR to you`,
                `You to confirm - Transaction Completed`
            ]);
        }

        if (customerId === seller.customerId) { // Customer is seller
            setRecepient(buyer);
            setCustomer(seller);
            setTransactionSteps([
                `${buyer.userName} to transfer NGN${formatNumber(buyer.amountTransfered, 2)} to you`, 
                `You confirm NGN payment`, 
                `You transfer the equivalent EUR to ${buyer.userName}`,
                `${buyer.userName} confirmed the EUR - Transaction Completed`
            ]);
        }
    };

    const getStepContent = (step, transaction) => {
        const { buyer, seller } = transaction;

        switch (step) {
            case 0:
                return `${moment(buyer.datePaymentMade).format('MMMM Do YYYY, h:mm:ss a')}`;
            
            case 1:
                return `${moment(seller.datePaymentReceived).format('MMMM Do YYYY, h:mm:ss a')}`;

            case 2:
                return `${moment(seller.datePaymentMade).format('MMMM Do YYYY, h:mm:ss a')}`;
            
            case 3:
                return `${moment(buyer.datePaymentReceived).format('MMMM Do YYYY, h:mm:ss a')}`;

          default:
            return '';
        }
    }

    const handleCopyTransactionId = () => {
        copy(transaction.id);
        toast.success('Transaction ID Copied!');
    };

    const handleViewCustomerDetails = () => {
        debugger
        return navigate(`${USER_DETAILS}/${recepient.customerId}`, { state: { customerId } });
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
                                <Typography variant="body2" component="p">{`. . . ${returnLastThreeCharacters(transaction?.id)}-${customer?.currency?.charAt(0)}`}</Typography>
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
                            <Typography variant="body2" component="p">{`${customer.currency}${formatNumber(customer.amountTransfered, 2)}`}</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Amount to Receive</Typography>
                            <Typography variant="body2" component="p">{`${recepient.currency}${formatNumber(recepient.amountTransfered, 2)}`}</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Transfer Status</Typography>
                            <Typography variant="body2" component="p" className={clsx({[classes.inProgress]: !completed})}>{completed ? 'Completed' : 'In Progress'}</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Date</Typography>
                            <Typography variant="body2" component="p" >{moment(transaction.dateCreated).format('MMMM Do, YYYY')} at {moment(transaction.dateCreated).format('hh:mm a')}</Typography>
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
    handleSetTitle: PropTypes.func.isRequired
};

export default TransactionStatus;