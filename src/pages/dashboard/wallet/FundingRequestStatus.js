import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { 
    Box,
    Button,
    Divider,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Refresh } from 'mdi-material-ui';
import PropTypes from 'prop-types';

import { getFundingDetails } from '../../../actions/wallets';
import { GET_ERRORS, SET_CUSTOMER_MSG } from '../../../actions/types';

import { COLORS, FUNDING_STATUS } from '../../../utils/constants';
import getTime from '../../../utils/getTime';
import formatNumber from '../../../utils/formatNumber';
import isEmpty from '../../../utils/isEmpty';

import Spinner from '../../../components/common/Spinner';
import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2, 0),
        width: '100%',

        [theme.breakpoints.down('sm')]: {
            // padding: theme.spacing(0, 1, 1, 1),
            width: '90%',
        },
    },

    content: {
        width: '80%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        }
    },

    fundingRequest: {
        border: `1px solid ${COLORS.borderColor}`,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(1),
        padding: theme.spacing(2),
        // margin: theme.spacing(2, ),
        margin: '10px  auto',
        // width: '100%',

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

    buttonContainer: {
        border: '1px solid red',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    }
}));

const loadingText = 'Refreshing Status . . . ';

const FundingRequestStatus = ({ handleSetTitle, getFundingDetails }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { msg } = useSelector(state => state.customer);
    const errorsState = useSelector(state => state.errors);
    const { fundingRequest } = useSelector(state => state.wallets);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const successModal = useRef();
    const toast = useRef();

    useEffect(() => {
        handleSetTitle('Funding Request Status');
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setLoading(false);
    }, [fundingRequest]);

    useEffect(() => {
        if (msg) {
            setLoading(false);
            successModal.current.setModalText(msg);
            successModal.current.openModal();
        }
    }, [msg]);

    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors({ ...errorsState });
            setLoading(false);
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        }
    }, [dispatch, errorsState, errors]);

    const handleRefreshStatus = () => {
        setLoading(true);
        getFundingDetails(fundingRequest.id);
    };

    const dismissSuccessModal = () => {
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: null
        });
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
            {loading && <Spinner text={loadingText} />}
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
            <Box component="section" className={classes.root}>
                <Typography variant="h4" color="primary" gutterBottom>Funding Request Status</Typography>
                <Box component="div" className={classes.content}>
                    <Box component="div" className={classes.fundingRequest}>
                        <Box component="section">
                            <Typography variant="body2" component="p">Transaction ID</Typography>
                            <Typography variant="body2" component="p">{fundingRequest.id}</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Institution</Typography>
                            <Typography variant="body2" component="p">Transaction ID</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Account Name</Typography>
                            <Typography variant="body2" component="p">Transaction ID</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Account Number</Typography>
                            <Typography variant="body2" component="p">Transaction ID</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Reference</Typography>
                            <Typography variant="body2" component="p">{fundingRequest.reference}</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Amount</Typography>
                            <Typography variant="body2" component="p">{formatNumber(fundingRequest.amountDetails.amount, 2)}</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Currency</Typography>
                            <Typography variant="body2" component="p">{fundingRequest.amountDetails.currency}</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Date</Typography>
                            <Typography variant="body2" component="p">{getTime(fundingRequest.createdAt)}</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Status</Typography>
                            <Typography
                                variant="body2"
                                component="p"
                                style={{
                                    color: fundingRequest.status === FUNDING_STATUS.PENDING ? COLORS.orange : COLORS.primary,
                                    fontWeight: 600
                                }}
                            >
                                {fundingRequest.status}
                            </Typography>
                        </Box>
                        {fundingRequest.status !== FUNDING_STATUS.COMPLETED && 
                            <>
                                <Divider />
                                <Box component="section" className={classes.buttonContainer}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<Refresh />}
                                        disableRipple
                                        disableFocusRipple
                                        disableTouchRipple
                                        onClick={handleRefreshStatus}
                                    >
                                        Refresh
                                    </Button>
                                </Box>
                            </>
                        }
                    </Box>
                </Box>
            </Box>
        </>
    );
};

FundingRequestStatus.propTypes = {
    getFundingDetails: PropTypes.func.isRequired
};

export default connect(undefined, { getFundingDetails })(FundingRequestStatus);