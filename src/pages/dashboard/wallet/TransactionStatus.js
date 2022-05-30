import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { 
    Box,
    Button,
    Divider,
    Tooltip,
	Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowLeft, ContentCopy, Refresh } from 'mdi-material-ui';
import copy from 'copy-to-clipboard';
import toast, { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';

import { getBid } from '../../../actions/listings';

import { COLORS, SHADOW } from '../../../utils/constants';
import returnLastThreeCharacters from '../../../utils/returnLastThreeCharacters';

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

    transactionIdContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
}));

const TransactionStatus = ({ getBid, handleSetTitle }) => {
	const classes = useStyles();
    const navigate = useNavigate();

    const { transaction } = useSelector(state => state.wallets);

    const [customer] = useState({});

    useEffect(() => {
        handleSetTitle('Transaction Status');
        // eslint-disable-next-line
    }, []);

    const handleCopyTransactionId = () => {
        copy(transaction.id);
        toast.success('Transaction ID Copied!');
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
                    <Typography variant="h6" className={classes.title} color="primary">Transaction Status</Typography>
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
                            <Typography variant="body2" component="p">Transaction ID</Typography>
                            <Typography variant="body2" component="p">XXXXXXXXXXXXX</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Institution</Typography>
                            <Typography variant="body2" component="p">XXXXXXXXXXXXXXX</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Account Name</Typography>
                            <Typography variant="body2" component="p">XXXXXXXXXXXXXXXX</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Account Number</Typography>
                            <Typography variant="body2" component="p">XXXXXXXXXXXXXXX</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Reference</Typography>
                            <Typography variant="body2" component="p">XXXXXXXXXXXXXXXXXXX</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Amount</Typography>
                            <Typography variant="body2" component="p">XXXXXXXXXXXXXXXX</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Currency</Typography>
                            <Typography variant="body2" component="p">XXXX</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Status</Typography>
                            <Typography variant="body2" component="p">XXXX</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Date</Typography>
                            <Typography variant="body2" component="p" >{convertToLocalTime(transaction.dateCreated).format('MMMM Do, YYYY')} at {convertToLocalTime(transaction.dateCreated).format('hh:mm a')}</Typography>
                        </Box>
                        <Box component="section">
                            <Button
                                startIcon={<Refresh />}
                                color="primary"
                                variant="outlined"
                                size="medium"
                            >
                                Refresh
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

TransactionStatus.propTypes = {
    getBid: PropTypes.func.isRequired,
    handleSetTitle: PropTypes.func.isRequired
};

export default connect(undefined, { getBid })(TransactionStatus);