import { useRef, useState, useCallback, useEffect } from 'react'; 
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Box, 
    // Button,
    // Divider,
    Typography,
    Menu,
    MenuItem, 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import clsx from 'clsx';

import { ID_STATUS_CATEGORY } from '../../../utils/constants';
import { approveIdCard, approveResidencePermit, getIdCardValidationResponse, getResidencePermitValidationResponse } from '../../../actions/customer';
// import { CLEAR_CUSTOMER_STATUS_MSG, GET_ERRORS } from '../../../actions/types';
import { CLEAR_CUSTOMER_STATUS_MSG } from '../../../actions/types';
// import isEmpty from '../../../utils/isEmpty';

// import Spinner from '../../../components/common/Spinner';
import SuccessModal from '../../../components/common/SuccessModal';
// import Toast from '../../../components/common/Toast';
import AmlBoard from '../../../components/admin-dashboard/AmlBoard'
import Status from '../../../components/admin-dashboard/Status'
import CircularProgressBar from '../../../components/admin-dashboard/CircularProgressBar'
import GenericButton from '../../../components/admin-dashboard/GenericButton'
// import { IdCard } from 'mdi-material-ui';
// import { CheckDecagram } from 'mdi-material-ui';


const useStyles = makeStyles(theme =>({
    root: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: [[theme.spacing(2), theme.spacing(5)]],
        boxShadow: '1px 1px 3px #dbdddd',

        [theme.breakpoints.down('md')]: {
            paddingBottom: theme.spacing(4)
        }
    },

    // content: {
    //     display: 'grid',
    //     gridTemplateColumns: '1fr 0.2fr 1fr'
    // },

    // details: {
    //     display: 'grid',
    //     gridTemplateColumns: '1fr 1fr',
    //     marginTop: theme.spacing(2),

    //     '& p:first-child': {
    //         color: COLORS.offBlack,
    //         fontWeight: 300
    //     },

    //     '& p:last-child': {
    //         color: theme.palette.primary.main
    //     }
    // },

    // detail: {
    //     marginBottom: theme.spacing(2),

    //     '& h6:first-child': {
    //         margin: theme.spacing(2, 0)
    //     }
    // },

    // button: {
    //     marginBottom: theme.spacing(2)
    // },

    // infoButton: {
    //     cursor: 'auto',
    //     marginBottom: theme.spacing(2),

    //     '&:hover': {
    //         backgroundColor: 'transparent'
    //     }
    // },

    // errorButton: {
    //     color: theme.palette.error.main
    // },

    // label: {
    //     fontWeight: 300
    // },

    // divider: {
    //     backgroundColor: theme.palette.primary.main,
    //     width: theme.spacing(0.5)
    // },

    // noDocument: {
    //     display: 'flex',
    //     flexDirection: 'column',
    //     justifyContent: 'space-evenly',
    //     alignItems: 'center'
    // },

    // noDocumentIcon: {
    //     color: theme.palette.primary.main,
    //     fontSize: theme.spacing(10)
    // }

    //NEW STYLE
    header: {
        display: 'grid',
        gridTemplateColumns: '1fr'
    },

    idHeader: {
        color: '#5D6060'
    },

    approveId: {
        justifySelf: 'center',
        fontSize: '1vw',
        marginTop: theme.spacing(2)
    },

    // idDetails: {
    //     display: 'grid',
    //     gridTemplateColumns: '1fr 1fr',
    // },

    amlTable: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        marginBottom: theme.spacing(.9),
        justifyContent: 'space-between'
    },

    amlTitle: {
        fontSize: '1vw',
        fontWeight: '350 !important',
    },

    amlNumber: {
        fontWeight: '500 !important',
        justifySelf: 'flex-end',
        fontSize: '1vw'
    },

    verified: {
        backgroundColor: '#DDF2E5',
        color: '#1E6262',
    },

    pending: {
        backgroundColor: '#FFF5CE',
        color: '#FBBC05',
    },

    rejected: {
        backgroundColor: '#FFCECE',
        color: '#FF0000',
    },

    suspended: {
        backgroundColor: '#f5f7be',
        color: '#d1c70c',
    },

    menu: {
        backgroundColor: 'white',
        border: `none`,
        borderRadius: theme.spacing(1.5),
        marginRight: '10px',
        cursor: 'pointer',
        // left: '675px !important',
        top: '212px !important',
        // width: '175px !important',

        '& ul': {
            padding: '8px'
        },

        '& li': {
            padding: '12px 12px 12px 17px',
        },
        
        '& li:hover': {
            borderRadius: theme.spacing(1.5),
            backgroundColor: '#E7EEEE',
            color: '#1E6262'
        }
    },
}));

const IdentityDetails = ({ approveIdCard, approveResidencePermit, getIdCardValidationResponse, getResidencePermitValidationResponse }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { customer, msg, idCheckData, profileCheckData } = useSelector(state => state.customers);
    // const errorsState = useSelector(state => state.errors);
    const { DECLINED, ACCEPTED } = ID_STATUS_CATEGORY
    const [loading, setLoading] = useState(false);
    const [ anchorEl, setAnchorEl ] = useState(null)

    const [ docType, setDocType ] = useState(idCheckData?.documentType)
    const [ docNumber, setDocNumber ] = useState(idCheckData?.documentNumber)
    const [ issueCountry, setIssueCountry ] = useState(idCheckData?.issueCountry)
    const [ docStatus, setDocStatus ] = useState(idCheckData?.status)
    const [ dateOfIssue, setDateOfIssue ] = useState(idCheckData?.dateOfIssue)
    const [ dateOfExpiry, setExpiryDate ] = useState(idCheckData?.expiryDate)

    // eslint-disable-next-line
    // const [errors, setErrors] = useState({});

    // const toast = useRef();
    const successModal = useRef();

    const handleStatus = useCallback((status) => {
        switch (status) {
          case ACCEPTED:
            return classes.verified
        //   case PENDING:
        //     return classes.pending
          case DECLINED:
            return classes.rejected
        //   case SUSPENDED:
        //     return classes.suspended
          default:
            return
        }
      }, [ACCEPTED, DECLINED, classes.verified, classes.rejected])

    // const { APPROVED } = ID_STATUS;

    useEffect(() => {
        if (!idCheckData) {
            getIdCardValidationResponse(customer.id);
        }

        if (!profileCheckData) {
            getResidencePermitValidationResponse(customer.id);
        }

        if (!docType) {
            setExpiryDate(idCheckData?.expiryDate)
            setDateOfIssue(idCheckData?.dateOfIssue)
            setDocStatus(idCheckData?.status)
            setIssueCountry(idCheckData?.issueCountry)
            setDocNumber(idCheckData?.documentNumber)
            setDocType(idCheckData?.documentType)
        }

        // dispatch({
        //     type: GET_ERRORS,
        //     payload: {}
        // });
        // eslint-disable-next-line
    }, []);

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleMenu = (e) => {
        setAnchorEl(e.currentTarget)
    }

    // useEffect(() => {
    //     if (errorsState?.msg) {
    //         setLoading(false);
    //         // toast.current.handleClick();
    //     }
    // }, [errorsState, errors]);

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

    console.log('id')

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
            {/* {!isEmpty(errorsState) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errorsState.msg || ''}
                    type="error"
                />
            } */}
            {/* {loading && <Spinner />} */}
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
            <Box component="section" className={classes.root}>
                <Box component="div" className={classes.header}>
                    <Typography variant="h6" className={classes.idHeader}>Identification details</Typography>

                    <Typography component="div" className={classes.approveId}>
                        <GenericButton className={classes.approveId} clickAction={handleMenu} fontsize="1vw" buttonName={loading ? <CircularProgressBar newWidth="20px" newHeight="20px" /> : "APPROVE ID"} fontColor="white" bgColor="#1E6262" textColor="white"/>
                    </Typography>

                    <Menu
                        id="customer-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        classes={{ paper: classes.menu }}
                        disableScrollLock={ true }
                    >
                        <MenuItem onClick={handleApproveResidencePermit}>Buy and Sell</MenuItem>
                        <MenuItem onClick={handleApproveId}>Buy only</MenuItem>
                    </Menu>
                </Box>

                <Box component="div" className={classes.idDetails}>
                    <AmlBoard  classes={classes} amlTitle={"Status"} amlNumber={<Status extraStyles={handleStatus(docStatus)} statusName={docStatus} />} />
                    <AmlBoard classes={classes} amlTitle={"Document Type"} amlNumber={docType} />
                    <AmlBoard classes={classes} amlTitle={"Document Number"} amlNumber={docNumber} />
                    <AmlBoard classes={classes} amlTitle={"Issue Country"} amlNumber={issueCountry} />
                    <AmlBoard classes={classes} amlTitle={"Date of Issue"} amlNumber={dateOfIssue} />
                    <AmlBoard classes={classes} amlTitle={"Date of Expiry"} amlNumber={dateOfExpiry} />
                </Box>
            </Box>
            {/* <Box component="section" className={classes.root}>
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
                                            <Button variant="outlined" disableFocusRipple disableTouchRipple disableRipple className={clsx(classes.infoButton, { [classes.errorButton]: profileCheckData?.status?.toUpperCase() !== APPROVED })}>{profileCheckData?.status}</Button>
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
                                            <Typography variant="subtitle2" component="p" className={classes.content}>{profileCheckData?.expiryDate}</Typography>
                                        </Box>
                                    </Box>
                                    <Box component="div">
                                        {profileCheckData?.status && profileCheckData?.status.toUpperCase() !== APPROVED ?
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
                                            :
                                            <>
                                                <br /><br />
                                            </>
                                        }
                                        <Box component="div" className={classes.detail}>
                                            <Typography variant="subtitle2" component="p" className={classes.label}>Document Number</Typography>
                                            <Typography variant="subtitle2" component="p" className={classes.content}>{profileCheckData?.documentNumber}</Typography>
                                        </Box>
                                        <Box component="div" className={classes.detail}>
                                            <Typography variant="subtitle2" component="p" className={classes.label}>Date of Issue</Typography>
                                            <Typography variant="subtitle2" component="p" className={classes.content}>{profileCheckData?.dateOfIssue}</Typography>
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
                                            <Button variant="outlined" disableFocusRipple disableTouchRipple disableRipple className={clsx(classes.infoButton, { [classes.errorButton]: idCheckData?.status?.toUpperCase() !== APPROVED })}>{idCheckData?.status}</Button>
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
                                        {idCheckData?.status && idCheckData?.status.toUpperCase() !== APPROVED ?
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
                                            :
                                            <>
                                                <br /><br />
                                            </>
                                        }
                                        <Box component="div" className={classes.detail}>
                                            <Typography variant="subtitle2" component="p" className={classes.label}>Document Number</Typography>
                                            <Typography variant="subtitle2" component="p" className={classes.content}>{idCheckData?.documentNumber}</Typography>
                                        </Box>
                                        <Box component="div" className={classes.detail}>
                                            <Typography variant="subtitle2" component="p" className={classes.label}>Date of Issue</Typography>
                                            <Typography variant="subtitle2" component="p" className={classes.content}>{idCheckData?.dateOfIssue}</Typography>
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
            </Box> */}
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