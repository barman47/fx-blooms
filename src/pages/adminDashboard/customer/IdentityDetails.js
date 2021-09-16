import { useEffect, useRef, useState } from 'react'; 
import { batch, connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Box, 
    Grid,
    Tab,
    Tabs,
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS } from '../../../utils/constants';
import { getIdCardValidationResponse, getResidencePermitValidationResponse } from '../../../actions/customer';
import { GET_ERRORS, SET_ID_CHECK_DATA, SET_PROFILE_CHECK_DATA } from '../../../actions/types';
import isEmpty from '../../../utils/isEmpty';

import Toast from '../../../components/common/Toast';

import ImagePreviewModal from '../../../components/common/ImagePreviewModal';

const useStyles = makeStyles(theme =>({
    root: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        padding: [[theme.spacing(2), theme.spacing(3)]],
        height: '100%',

        [theme.breakpoints.down('md')]: {
            paddingBottom: theme.spacing(4)
        }
    },

    header: {
        color: theme.palette.primary.main,
        display: 'flex',
        flexDirection: 'row',
        fontWeight: 500,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(1)
    },

    label: {
        fontWeight: 300
    },

    info: {
        fontWeight: 600
    },

    photograph: {
        borderRadius: theme.shape.borderRadius,
        width: '100%'
    },

    idCard: {
        borderRadius: theme.shape.borderRadius,
        width: '100%'
    }
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

const IdentityDetails = ({ getIdCardValidationResponse, getResidencePermitValidationResponse }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { customer, idCheckData, profileCheckData } = useSelector(state => state.customers);
    const errorsState = useSelector(state => state.errors);
    // const { customerId } = useSelector(state => state.customer);
    
    const [open, setOpen] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const [alt, setAlt] = useState('');
    const [value, setValue] = useState(0);
    // const [errors, setErrors] = useState({});

    const toast = useRef();

    // useEffect(() => {
    //     if (errorsState?.msg) {
    //         setErrors({ msg: errorsState.msg });
    //     }
    // }, [errorsState, errors]);

    useEffect(() => {
        getIdCardValidationResponse(customer.id);
        getResidencePermitValidationResponse(customer.id);

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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleCloseModal = () => {
        setModalImage('');
        setAlt('');
        setOpen(false);
    };

    const handleModalOpen = (img, alt) => {
        setModalImage(img);
        setAlt(alt);
        setOpen(true);
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
            <ImagePreviewModal handleCloseModal={handleCloseModal} open={open} alt={alt} img={modalImage} />
            <Grid className={classes.root} container direction="column">
                {/* <Grid item>
                    <Box className={classes.header}>
                        <Typography variant="subtitle2">Identity Details</Typography>
                    </Box>
                </Grid>
                <Divider />
                <br /> */}
                <Grid item>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" indicatorColor="primary" textColor="primary">
                                <Tab 
                                    disableRipple 
                                    disableFocusRipple 
                                    label="ID Check" 
                                    {...a11yProps(0)} 
                                    onClick={() => {
                                        getIdCardValidationResponse(customer.id);
                                    }} 
                                />
                                <Tab 
                                    disableRipple 
                                    disableFocusRipple 
                                    label="Profile Check" 
                                    {...a11yProps(1)} 
                                    onClick={() => {
                                        getResidencePermitValidationResponse(customer.id);
                                    }} 
                                />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            {idCheckData ? 
                                <Grid container direction="row" spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>ID Card Type</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{idCheckData?.documentType}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>Document Number</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{idCheckData?.documentNumber}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>First Name</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{idCheckData?.firstName}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>Last Name</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{idCheckData?.lastName}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>Gender</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{idCheckData?.gender}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>Date of Birth</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{idCheckData?.dateOfBirth}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>Issuing Country</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{idCheckData?.issueCountry}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>Date of Expiry</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{idCheckData?.dateOfBirth}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>Date of Issue</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{idCheckData?.dateOfIssue}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>Status</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{idCheckData?.status}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>ID Card Front</Typography>
                                        <br />
                                        <img src={idCheckData?.idFront} alt="ID Front" className={classes.idCard} onMouseEnter={() => handleModalOpen(idCheckData?.idFront, 'ID Card Front')} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>ID Card Back</Typography>
                                        <br />
                                        <img src={idCheckData?.idBack} alt="ID Back"  className={classes.idCard} onMouseEnter={() => handleModalOpen(idCheckData?.idBack, 'ID Card Back')} />
                                    </Grid>
                                </Grid>
                                :
                                <Typography variant="h6">{errorsState.msg || errorsState.message}</Typography>
                            }
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            {profileCheckData ? 
                                <Grid container direction="row" spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>ID Card Type</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{profileCheckData?.documentType}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>Document Number</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{profileCheckData?.documentNumber}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>First Name</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{profileCheckData?.firstName}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>Last Name</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{profileCheckData?.lastName}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>Gender</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{profileCheckData?.gender}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>Date of Birth</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{profileCheckData?.dateOfBirth}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>Issuing Country</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{profileCheckData?.issueCountry}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>Date of Expiry</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{profileCheckData?.expiryDate}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>Date of Issue</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{profileCheckData?.issueDate}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>Status</Typography>
                                        <Typography variant="subtitle2" className={classes.info}>{profileCheckData?.status}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>ID Card Front</Typography>
                                        <br />
                                        <img src={profileCheckData?.idFront} alt="ID Front" className={classes.idCard} onMouseEnter={() => handleModalOpen(profileCheckData?.idFront, 'ID Card Front')} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" component="span" className={classes.label}>ID Card Back</Typography>
                                        <br />
                                        <img src={profileCheckData?.idBack} alt="ID Back"  className={classes.idCard} onMouseEnter={() => handleModalOpen(profileCheckData?.idBack, 'ID Card Back')} />
                                    </Grid>
                                </Grid>
                                :
                                <Typography variant="h6">{errorsState.msg || errorsState.message}</Typography>
                            }
                        </TabPanel>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

IdentityDetails.propTypes = {
    getIdCardValidationResponse: PropTypes.func.isRequired,
    getResidencePermitValidationResponse: PropTypes.func.isRequired
};

export default connect(undefined, { getIdCardValidationResponse, getResidencePermitValidationResponse })(IdentityDetails);