import { useEffect, useRef, useState } from 'react'; 
import { batch, connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Box, 
    Button,
    Divider,
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { COLORS, ID_STATUS } from '../../../utils/constants';
import { approveIdCard, approveResidencePermit, getIdCardValidationResponse, getResidencePermitValidationResponse } from '../../../actions/customer';
import { GET_ERRORS, SET_ID_CHECK_DATA, CLEAR_CUSTOMER_STATUS_MSG, SET_PROFILE_CHECK_DATA } from '../../../actions/types';
import isEmpty from '../../../utils/isEmpty';

import Spinner from '../../../components/common/Spinner';
import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';

import { IdCard } from 'mdi-material-ui';

const useStyles = makeStyles(theme =>({
    root: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        marginTop: theme.spacing(3),
        padding: [[theme.spacing(2), theme.spacing(5)]],
        height: '100%',

        [theme.breakpoints.down('md')]: {
            paddingBottom: theme.spacing(4)
        }
    },

    content: {
        display: 'grid',
        gridTemplateColumns: '1fr 0.2fr 1fr'
    },

    detail: {
        marginBottom: theme.spacing(2),

        '& h6:first-child': {
            margin: theme.spacing(2, 0)
        }
    },

    details: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        marginTop: theme.spacing(2),

        '& p:first-child': {
            color: COLORS.offBlack,
            fontWeight: 300
        },

        '& p:last-child': {
            color: theme.palette.primary.main
        }
    },

    button: {
        marginBottom: theme.spacing(2)
    },

    infoButton: {
        cursor: 'auto',
        marginBottom: theme.spacing(2),

        '&:hover': {
            backgroundColor: 'transparent'
        }
    },

    errorButton: {
        color: theme.palette.error.main
    },

    label: {
        fontWeight: 300
    },

    divider: {
        backgroundColor: theme.palette.primary.main,
        width: theme.spacing(0.5)
    },

    noDocument: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },

    noDocumentIcon: {
        color: theme.palette.primary.main,
        fontSize: theme.spacing(10)
    }
}));

const IdentityDetails = ({ approveIdCard, approveResidencePermit, getIdCardValidationResponse, getResidencePermitValidationResponse }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { customer, idCheckData, msg, profileCheckData } = useSelector(state => state.customers);
    const errorsState = useSelector(state => state.errors);
    
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line
    const [errors, setErrors] = useState({});

    const toast = useRef();
    const successModal = useRef();

    const { APPROVED } = ID_STATUS;

    useEffect(() => {
        if (!idCheckData) {
            getIdCardValidationResponse(customer.id);
        }

        if (!profileCheckData) {
            getResidencePermitValidationResponse(customer.id);
        }

        return () => {
            batch(() => {
                dispatch({
                    type: GET_ERRORS,
                    payload: {}
                });
                dispatch({
                    type: SET_ID_CHECK_DATA,
                    payload: null
                });
                dispatch({
                    type: SET_PROFILE_CHECK_DATA,
                    payload: null
                });
            });
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (errorsState?.msg) {
            setLoading(false);
            toast.current.handleClick();
        }
    }, [errorsState, errors]);

    useEffect(() => {
        if (msg) {
            setLoading(false);
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [dispatch, msg]);

    const dismissSuccessModal = () => {
        dispatch({
            type: CLEAR_CUSTOMER_STATUS_MSG,
            payload: null
        });
    };

    // const handleCloseModal = () => {
    //     setModalImage('');
    //     setAlt('');
    //     setOpen(false);
    // };

    // const handleModalOpen = (img, alt) => {
    //     setModalImage(img);
    //     setAlt(alt);
    //     setOpen(true);
    // };

    const handleApproveId = () => {
        setLoading(true);
        approveIdCard(customer.id);
    };

    const handleApproveResidencePermit = () => {
        setLoading(true);
        approveResidencePermit(customer.id);
    };

    // const onSubmit = (e) => {
    //     e.preventDefault();
    // };

    return (
        <>
            {!isEmpty(errorsState) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errorsState.msg || ''}
                    type="error"
                />
            }
            {loading && <Spinner />}
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
            <Box component="section" className={classes.root}>
                <Typography variant="h6" color="primary">ID Details</Typography>
                <Box component="section" className={classes.content}>
                    <Box component="div" className={classes.detail}>
                        <Typography variant="h6">SELL and BUY</Typography>
                        {profileCheckData ?
                            <>
                                <Typography variant="subtitle2" component="p">Status</Typography>
                                <Box component="div" className={classes.details}>
                                    <Box component="div">
                                        {profileCheckData?.status && profileCheckData?.status.toUpperCase() === APPROVED ? 
                                            <Button variant="outlined" disableFocusRipple disableTouchRipple disableRipple className={clsx(classes.infoButton, classes.errorButton)}>{profileCheckData?.status}</Button>
                                            :
                                            <Button variant="outlined" disableFocusRipple disableTouchRipple disableRipple className={clsx(classes.infoButton, { [classes.errorButton]: profileCheckData?.status.toUpperCase() !== APPROVED })}>{profileCheckData?.status}</Button>
                                        }
                                        <Box component="div" className={classes.detail}>
                                            <Typography variant="subtitle2" component="p" className={classes.label}>Document Type</Typography>
                                            <Typography variant="subtitle2" component="p" className={classes.content}>{profileCheckData?.documentType}</Typography>
                                        </Box>
                                        <Box component="div" className={classes.detail}>
                                            <Typography variant="subtitle2" component="p" className={classes.label}>Issue Country</Typography>
                                            <Typography variant="subtitle2" component="p" className={classes.content}>{profileCheckData?.issueCountry}</Typography>
                                        </Box>
                                        <Box component="div" className={classes.detail}>
                                            <Typography variant="subtitle2" component="p" className={classes.label}>Date of Expiry</Typography>
                                            <Typography variant="subtitle2" component="p" className={classes.content}>20-12-2023</Typography>
                                        </Box>
                                    </Box>
                                    <Box component="div">
                                        {profileCheckData?.status && profileCheckData?.status.toUpperCase() !== APPROVED &&
                                            <Button 
                                                variant="outlined" 
                                                disableFocusRipple 
                                                disableTouchRipple 
                                                disableRipple 
                                                color="primary" 
                                                className={classes.button}
                                                onClick={handleApproveResidencePermit}
                                            >
                                                Approve ID
                                            </Button>
                                        }
                                        <Box component="div" className={classes.detail}>
                                            <Typography variant="subtitle2" component="p" className={classes.label}>Document Number</Typography>
                                            <Typography variant="subtitle2" component="p" className={classes.content}>Residence Permit</Typography>
                                        </Box>
                                        <Box component="div" className={classes.detail}>
                                            <Typography variant="subtitle2" component="p" className={classes.label}>Date of Issue</Typography>
                                            <Typography variant="subtitle2" component="p" className={classes.content}>NGA</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </>
                            :
                            <Box component="div" className={classes.noDocument}>
                                <IdCard className={classes.noDocumentIcon} />
                                <Typography variant="h6" color="primary">No Document Submited</Typography>
                            </Box>
                        }
                    </Box>
                    <Divider orientation="vertical" flexItem classes={{ root: classes.divider }} />       
                    <Box component="div" className={classes.detail}>
                        <Typography variant="h6">BUY Only</Typography>
                        {idCheckData ? 
                            <>
                                <Typography variant="subtitle2" component="p">Status</Typography>
                                <Box component="div" className={classes.details}>
                                    <Box component="div">
                                        {idCheckData?.status && idCheckData?.status.toUpperCase() === APPROVED ? 
                                            <Button variant="outlined" disableFocusRipple disableTouchRipple disableRipple color="primary" className={clsx(classes.infoButton, classes.erroButton)}>{idCheckData?.status}</Button>
                                            :
                                            <Button variant="outlined" disableFocusRipple disableTouchRipple disableRipple className={clsx(classes.infoButton, { [classes.errorButton]: idCheckData?.status.toUpperCase() !== APPROVED })}>{idCheckData?.status}</Button>
                                        }
                                        <Box component="div" className={classes.detail}>
                                            <Typography variant="subtitle2" component="p" className={classes.label}>Document Type</Typography>
                                            <Typography variant="subtitle2" component="p" className={classes.content}>{idCheckData?.documentType}</Typography>
                                        </Box>
                                        <Box component="div" className={classes.detail}>
                                            <Typography variant="subtitle2" component="p" className={classes.label}>Issue Country</Typography>
                                            <Typography variant="subtitle2" component="p" className={classes.content}>{idCheckData?.issueCountry}</Typography>
                                        </Box>
                                        <Box component="div" className={classes.detail}>
                                            <Typography variant="subtitle2" component="p" className={classes.label}>Date of Expiry</Typography>
                                            <Typography variant="subtitle2" component="p" className={classes.content}>20-12-2023</Typography>
                                        </Box>
                                    </Box>
                                    <Box component="div">
                                        {idCheckData?.status && idCheckData?.status.toUpperCase() !== APPROVED &&
                                            <Button 
                                                variant="outlined" 
                                                disableFocusRipple 
                                                disableTouchRipple 
                                                disableRipple 
                                                color="primary" 
                                                className={classes.button}
                                                onClick={handleApproveId}
                                            >
                                                Approve ID
                                            </Button>
                                        }
                                        <Box component="div" className={classes.detail}>
                                            <Typography variant="subtitle2" component="p" className={classes.label}>Document Number</Typography>
                                            <Typography variant="subtitle2" component="p" className={classes.content}>{idCheckData?.documentType}</Typography>
                                        </Box>
                                        <Box component="div" className={classes.detail}>
                                            <Typography variant="subtitle2" component="p" className={classes.label}>Date of Issue</Typography>
                                            <Typography variant="subtitle2" component="p" className={classes.content}>NGA</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </>
                            :
                            <Box component="div" className={classes.noDocument}>
                                <IdCard className={classes.noDocumentIcon} />
                                <Typography variant="h6" color="primary">No Document Submited</Typography>
                            </Box>
                        }
                        
                    </Box>     
                </Box>
            </Box>
        </>
    );
};

IdentityDetails.propTypes = {
    approveIdCard: PropTypes.func.isRequired,
    approveResidencePermit: PropTypes.func.isRequired,
    getIdCardValidationResponse: PropTypes.func.isRequired,
    getResidencePermitValidationResponse: PropTypes.func.isRequired
};

export default connect(undefined, { approveIdCard, approveResidencePermit, getIdCardValidationResponse, getResidencePermitValidationResponse })(IdentityDetails);