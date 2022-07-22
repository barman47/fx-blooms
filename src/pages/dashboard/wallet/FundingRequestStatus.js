import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { 
    Box,
    Button,
    Divider,
    Typography
} from '@mui/material';
import { makeStyles } from '@material-ui/styles';
import { Refresh } from 'mdi-material-ui';
import moment from 'moment';
import PropTypes from 'prop-types';

import { getFundingDetails } from '../../../actions/wallets';
import { GET_ERRORS } from '../../../actions/types';
// import { GET_ERRORS, SET_CUSTOMER_MSG } from '../../../actions/types';

import { COLORS, FUNDING_STATUS } from '../../../utils/constants';
import { convertToLocalTime } from '../../../utils/getTime';
import formatNumber from '../../../utils/formatNumber';
import isEmpty from '../../../utils/isEmpty';

import Spinner from '../../../components/common/Spinner';
// import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';
import FundingDisclaimerModal from './FundingDisclaimerModal';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        [theme.breakpoints.down('sm')]: {
            width: '90%',
        },

        '& h4:first-child': {
            textAlign: 'center',
            width: '100%',

            [theme.breakpoints.down('sm')]: {
                fontSize: theme.spacing(2.5)
            }
        }
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
        margin: '10px  auto',
        width: '100%',

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
        justifySelf: 'flex-end'
    }
}));

const loadingText = 'Refreshing Status . . . ';

const FundingRequestStatus = ({ handleSetTitle, getFundingDetails }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const location = useLocation();

    const { msg } = useSelector(state => state.customer);
    const errorsState = useSelector(state => state.errors);
    const { fundingRequest } = useSelector(state => state.wallets);

    const [paymentRequestId, setPaymentRequestId] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const disclaimerModal = useRef();
    // const successModal = useRef();
    const toast = useRef();

    useEffect(() => {
        handleSetTitle('Funding Request Status');
        if (location?.state?.paymentRequestId) {
            setPaymentRequestId(location.state.paymentRequestId);   
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setLoading(false);
    }, [fundingRequest]);

    useEffect(() => {
        if (msg) {
            setLoading(false);
            disclaimerModal.current.openModal();
            // successModal.current.setModalText(msg);
            // successModal.current.openModal();
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
        getFundingDetails(fundingRequest.id, paymentRequestId);
    };

    // const dismissSuccessModal = () => {
    //     dispatch({
    //         type: SET_CUSTOMER_MSG,
    //         payload: null
    //     });
    // };

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
            <FundingDisclaimerModal ref={disclaimerModal} />
            {/* <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} /> */}
            <Box component="section" className={classes.root}>
                <Typography variant="h4" color="primary" gutterBottom>Funding Request Status</Typography>
                <Box component="div" className={classes.content}>
                    <Box component="div" className={classes.fundingRequest}>
                        <Box component="section">
                            <Typography variant="body2" component="p">Reference</Typography>
                            <Typography variant="body2" component="p">{fundingRequest.reference}</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Amount</Typography>
                            <Typography variant="body2" component="p">{formatNumber(fundingRequest.amount, 2)}</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Currency</Typography>
                            <Typography variant="body2" component="p">{fundingRequest.currency}</Typography>
                        </Box>
                        <Divider />
                        <Box component="section">
                            <Typography variant="body2" component="p">Date</Typography>
                            <Typography variant="body2" component="p">{moment(convertToLocalTime(fundingRequest.date)).fromNow()}</Typography>
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
                                {fundingRequest.status.toUpperCase()}
                            </Typography>
                        </Box>
                        {fundingRequest.status.toUpperCase() !== FUNDING_STATUS.COMPLETED && 
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