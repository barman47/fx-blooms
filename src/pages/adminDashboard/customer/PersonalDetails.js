import { useEffect, useRef, useState, useCallback } from 'react'; 
import { useLocation } from 'react-router-dom'; 
import { connect, useDispatch, useSelector } from 'react-redux'; 
import { 
    Avatar,
    Box, 
    // Button,
    // FormControl,
    // FormControlLabel,
    // FormHelperText,
    // MenuItem,
    // Select,
    // Switch,
    TextField,
    Typography, 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import PropTypes from 'prop-types';
// import moment from 'moment';
import clsx from 'clsx';
import { getIdCardValidationResponse, getResidencePermitValidationResponse, setCustomerStatus } from '../../../actions/customer';
import { CLEAR_CUSTOMER_STATUS_MSG } from '../../../actions/types';
import PropTypes from 'prop-types';
// import { CUSTOMER_CATEGORY } from '../../../utils/constants';
import updateCustomerProfile from '../../../utils/validation/customer/updateCustomerProfile';
import isEmpty from '../../../utils/isEmpty';
import avatar from '../../../assets/img/avatar.jpg';

import Spinner from '../../../components/common/Spinner';
import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';
import { SquareEditOutline, CheckDecagram } from 'mdi-material-ui';
import AmlBoard from '../../../components/admin-dashboard/AmlBoard'
import Status from '../../../components/admin-dashboard/Status'
import GenericButton from '../../../components/admin-dashboard/GenericButton'
import GenericTextField from '../../../components/admin-dashboard/GenericTextField'



const useStyles = makeStyles(theme =>({
    root: {
        backgroundColor: 'white',
        borderRadius: '12px',
        // marginTop: theme.spacing(3),
        padding: [[theme.spacing(2), theme.spacing(5)]],
        boxSizing: '200px 10px 20px white',

        [theme.breakpoints.down('md')]: {
            paddingBottom: theme.spacing(4)
        }
    },

    // form: {
    //     display: 'grid',
    //     gridTemplateColumns: 'repeat(3, 1fr)',
    //     gap: theme.spacing(2)
    // },


    // box: {
    //     display: 'grid',
    //     gridTemplateColumns: '1fr',
    //     rowGap: theme.spacing(2)
    // },

    // label: {
    //     color: COLORS.offBlack
    // },

    // info: {
    //     color: theme.palette.primary.main,
    //     fontWeight: 600
    // },

    // buttonContainer: {
    //     display: 'grid',
    //     gridTemplateColumns: 'repeat(3, 1fr)',
    //     alignItems: 'center',
    //     columnGap: theme.spacing(2)
        
    // },

    // statusButtonContainer: {
    //     display: 'flex',
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    // },

    // button: {
    //     fontWeight: 600,
    // },

    // remarkContainer: {
    //     display: 'flex',
    //     flexDirection: 'column',
    //     marginTop: theme.spacing(2)
    // },

    // saveRemarkButton: {
    //     alignSelf: 'flex-end',
    //     marginTop: theme.spacing(2)
    // },

    // avatar: {
    //     borderRadius: theme.shape.borderRadius,
    //     width: theme.spacing(25),
    //     height: theme.spacing(25),
    // },


    // NEW STYLE
    userDetails: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        marginTop: theme.spacing(2),
    },

    headerTitle: {
        color: '#5D6060',
        fontWeight: '600',
        fontSize: theme.spacing(2.7)
    },

    headerIcon: {
        justifySelf: 'flex-end',
        color: '#5D6060',
        fontSize: theme.spacing(4.5),

        cursor: 'pointer'
    },

    userPassport: {
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',

        marginTop: theme.spacing(2)
    },

    avatar: {
        borderRadius: '10px',
        width: theme.spacing(35),
        height: theme.spacing(35),
    },

    userStatus: {
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },

    userStatusTitle: {
        backgroundColor: '#DDF2E5',
        alignItems: 'center',
        color: '#1E6262',
        width: 'fit-content',
        padding: theme.spacing(.7, 4),
        borderRadius: '10px',
        fontSize: theme.spacing(4),
        marginBottom: theme.spacing(3),
        textAlign: 'center',
    },

    userStatusSub: {
        // alignItems: 'flex-start',
        padding: theme.spacing(1),
        // alignSelf: 'center',
    },

    userPersonalDetails: {
        marginTop: theme.spacing(1.5)
    },

    amlTable: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        padding: theme.spacing(1),

        '&:not(:last-child)': {
            borderBottom: '1px solid #E5E5E5',
        }
    },

    amlTitle: {
        fontWeight: '350 !important',
    },

    amlNumber: {
        fontWeight: '500 !important',
        justifySelf: 'flex-end'
    },

    saveBtn: {
        marginTop: theme.spacing(3),

        display: 'flex',
        justifyContent: 'flex-end'
    },

}));

const PersonalDetails = ({ getIdCardValidationResponse, getResidencePermitValidationResponse, setCustomerStatus, updateCustomerProfile }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const location = useLocation();

    const { customer, idCheckData, msg, profileCheckData } = useSelector(state => state.customers);
    const errorsState = useSelector(state => state.errors);

    const [firstName] = useState(customer.firstName);
    const [middleName] = useState(customer.otherName);
    const [lastName] = useState(customer.lastName);
    const [userName] = useState(customer.userName);
    const [occupation, setOccupation] = useState(customer.occupation);
    const [dateOfBirth] = useState(idCheckData?.dateOfBirth || profileCheckData?.dateOfBirth);
    const [address, setAddress] = useState(customer.address);
    const [postalCode] = useState(customer.postalCode);
    const [city] = useState(customer.city);
    const [country] = useState(customer.countryId);
    const [nationality] = useState(customer.nationality);
    const [phoneNumber, setPhoneNumber] = useState(customer.phoneNo);
    const [riskProfile, setRiskProfile] = useState(customer.riskProfile);
    const [remarks, setRemarks] = useState(customer.remarks);
    const [email] = useState(customer.email);
    const [status, setStatus] = useState(customer.customerStatus);

    const [loadingText, setLoadingText] = useState('');
    const [errors, setErrors] = useState({});
    const [editable, setEditable] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const successModal = useRef();
    const toast = useRef();

    // const { CONFIRMED, NO_PROFILE, SUSPENDED } = CUSTOMER_CATEGORY;
    // const RISK_PROFILES= ['Risk Profile 1', 'Risk Profile 2', 'Risk Profile 3'];

    useEffect(() => {
        if (!idCheckData) {
            getIdCardValidationResponse(customer.id);
        }

        if (!profileCheckData) {
            getResidencePermitValidationResponse(customer.id);
        }

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const { state } = location;
        
        if (state?.editProfile) {
            setEditable(true);
        }
    }, [location]);

    useEffect(() => {
        if (errorsState?.msg) {
            setLoading(false);
            toast.current.handleClick();
        }
    }, [errorsState, errors]);

    // useEffect(() => {
    //     setEditable(false);
    //     const { customerStatus } = customer;
    //     // const { address, occupation, riskProfile, remark, status } = customer;

    //     setAddress(address);
    //     setStatus(customerStatus);
    //     setRemarks('')
    //     setOccupation(occupation);
    //     setRiskProfile(riskProfile);
    //     setRemarks(remarks);
    
    // }, [customer, address, remarks, riskProfile, occupation]);

    useEffect(() => {
        if (msg) {
            setLoading(false);
            setEditable(false);
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [msg]);

    // const suspendCustomer = () => {
    //     setLoadingText('Suspending Customer...');
    //     setLoading(true);
    //     setCustomerStatus({
    //         customerID: customer.id,
    //         newStatus: SUSPENDED,
    //         currentStatus: status
    //     });
    // };

    // const confirmCustomer = () => {
    //     setLoadingText('Confirming Customer...');
    //     setLoading(true);
    //     setCustomerStatus({
    //         customerID: customer.id,
    //         newStatus: CONFIRMED,
    //         currentStatus: status
    //     });
    // };

    const dismissAction = () => {
        dispatch({
            type: CLEAR_CUSTOMER_STATUS_MSG
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setLoadingText('');

        const data = {
            customerId: customer.id,
            firstName: firstName,
            lastName: lastName,
            otherName: middleName,
            phoneNumber: phoneNumber,
            country: country,
            address: address,
            postalCode: postalCode,
            occupation: occupation,
            risk: riskProfile
        };

        const { errors, isValid } = updateCustomerProfile(data);
        if (!!isValid) {
            return setErrors({ msg: 'Invalid customer data', ...errors });
        }
        setLoadingText('Updating Customer . . .');
        setLoading(true);
        setEditable(false)
        setErrors({});
        updateCustomerProfile(data);
    };

    // const saveRemark = (e) => {
    //     e.preventDefault();
    //     setErrors({});
    //     setLoadingText('');

    //     const data = {
    //         customerId: customer.id,
    //         firstName: firstName,
    //         lastName: lastName,
    //         otherName: middleName,
    //         phoneNumber: '',
    //         country: '',
    //         address: '',
    //         postalCode: '',
    //         occupation: '',
    //         risk: '',
    //         remarks
    //     };

    //     setLoadingText('Saving Remark . . .');
    //     setLoading(true);
    //     setErrors({});
    //     updateCustomerProfile(data);
    // };

    return (
        <>
            {loading && <Spinner text={loadingText} />}
            {!isEmpty(errorsState) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errorsState.msg || ''}
                    type="error"
                />
            }
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            <Box component="section" className={classes.root}>
                <Box component="div" className={classes.userDetails}>
                    <Typography className={classes.headerTitle}>Personal details</Typography>
                    <SquareEditOutline onClick={() => setEditable(!editable)} className={classes.headerIcon} />
                </Box>
                <Box component="div" className={classes.userPassport}>
                    <Avatar variant="square" alt="Avatar" src={avatar} className={classes.avatar} />
                    <Typography component="div" className={classes.userStatus}>
                        <Typography variant="h6" className={classes.userStatusTitle}>
                            <CheckDecagram className={classes.userStatusIcon} />
                            {'Verified'}
                        </Typography>
                        <Typography component="span" variant="subtitle2" className={classes.userStatusSub}><Status wdth="fit-content" statusName="CHANGE STATUS" bgColor="#1E6262" textColor="white" /></Typography>
                    </Typography>
                </Box>
                <form onSubmit={onSubmit} noValidate className={classes.userPersonalDetails}>
                    <AmlBoard classes={classes} amlTitle={'Username'} amlNumber={userName} />
                    <AmlBoard classes={classes} amlTitle={"First Name"} amlNumber={firstName} />
                    <AmlBoard classes={classes} amlTitle={"Middle Name"} amlNumber={middleName} />
                    <AmlBoard classes={classes} amlTitle={"Last Name"} amlNumber={lastName} />
                    <AmlBoard classes={classes} amlTitle={"Date of Birth"} amlNumber={dateOfBirth} />
                    <AmlBoard editable={editable} classes={classes} amlTitle={"Phone Number"} amlNumber={phoneNumber} formField={<GenericTextField textTitle="phoneNumber" inputValue={phoneNumber} handleOnChange={setPhoneNumber} errors={errors} errorValue={phoneNumber} placeHolder={phoneNumber} />} />
                    <AmlBoard classes={classes} amlTitle={"Email"} amlNumber={email} />
                    <AmlBoard classes={classes} amlTitle={"Client since"} amlNumber={'20.04.2020'} />
                    <AmlBoard classes={classes} amlTitle={"Nationality"} amlNumber={nationality} />

                    <AmlBoard editable={editable} classes={classes} amlTitle={"Occupation"} amlNumber={occupation} formField={<GenericTextField textTitle="occupation" inputValue={occupation} handleOnChange={setOccupation} errors={errors} errorValue={occupation} placeHolder={occupation} />} />

                    <AmlBoard classes={classes} amlTitle={"Risk profile"} amlNumber={riskProfile} />
                    
                    <AmlBoard editable={editable} classes={classes} amlTitle={"Address"} amlNumber={address} formField={<GenericTextField textTitle="address" inputValue={address} handleOnChange={setAddress} errors={errors} errorValue={address} placeHolder={address} />} />

                    <AmlBoard classes={classes} amlTitle={"Postal code"} amlNumber={postalCode} />
                    <AmlBoard classes={classes} amlTitle={"City"} amlNumber={city} />
                    <AmlBoard classes={classes} amlTitle={"Country of Residence"} amlNumber={country} />
                </form>
            </Box>

            <Box component="div" className={classes.saveBtn}>
                <GenericButton clickAction={onSubmit} buttonName="save" />
            </Box>


            {/* <Box component="section" className={classes.root}>
                <form onSubmit={onSubmit} noValidate className={classes.form}>
                    <Box component="div" className={classes.box}>
                        <Box component="header">
                            <FormControlLabel
                                value="top"
                                control={<Switch color="primary" />}
                                label="Personal Details"
                                labelPlacement="start"
                            />
                        </Box>
                        <Box component="div">
                            <Typography variant="h6">User Status</Typography>
                            {status === CONFIRMED ? (
                                <Box component="div" className={classes.statusButtonContainer}>
                                    <Typography variant="h5" color="primary" style={{ fontWeight: 600 }}>{status}</Typography> 
                                    {(status === CONFIRMED || status === NO_PROFILE) &&
                                        <Button 
                                            variant="outlined" 
                                            color="secondary" 
                                            size="small" 
                                            disableRipple 
                                            disableFocusRipple 
                                            disableTouchRipple
                                            onClick={suspendCustomer}
                                        >
                                            Suspend Customer
                                        </Button>
                                    }
                                </Box>
                                )
                                :
                                <Box component="div" className={classes.statusButtonContainer}>
                                    <Typography variant="h5" color="error" style={{ fontWeight: 600 }}>{status}</Typography>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        size="small" 
                                        disableRipple 
                                        disableFocusRipple 
                                        disableTouchRipple
                                        onClick={confirmCustomer}
                                    >
                                        Unsuspend Customer
                                    </Button> 
                                </Box>
                            }
                        </Box>
                        <Box component="div">
                            <Typography variant="subtitle2" component="span" className={classes.label}>First Name</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{firstName}</Typography>    
                        </Box>
                        <Box component="div">
                            <Typography variant="subtitle2" component="span" className={classes.label}>Last Name</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{lastName}</Typography>    
                        </Box>
                        <Box component="div">
                            <Typography variant="subtitle2" component="span" className={classes.label}>Username</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{userName}</Typography>    
                        </Box>
                        <Box component="div">
                            <Typography variant="subtitle2" component="span" className={classes.label}>Occupation</Typography>
                            {editable ? 
                                <TextField 
                                    className={classes.input}
                                    value={occupation || ''}
                                    onChange={(e) => setOccupation(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Occupation"
                                    helperText={errors.occupation}
                                    fullWidth
                                    required
                                    error={errors.occupation ? true : false}
                                />
                                :
                                <Typography variant="subtitle2" className={classes.info}>{occupation}</Typography>    
                            }
                        </Box>
                        <Box component="div">
                            <Typography variant="subtitle2" component="span" className={classes.label}>Address</Typography>
                            {editable ? 
                                <TextField 
                                    className={classes.input}
                                    value={address || ''}
                                    onChange={(e) => setAddress(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Address"
                                    helperText={errors.address}
                                    fullWidth
                                    required
                                    error={errors.address ? true : false}
                                />
                                :
                                <Typography variant="subtitle2" className={classes.info}>{address}</Typography>    
                            }
                        </Box>
                        <Box component="div">
                            <Typography variant="subtitle2" component="span" className={classes.label}>Postal Code</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{postalCode}</Typography>    
                        </Box>
                    </Box>
                    <Box component="div" className={classes.box}>
                        <Box component="div" className={classes.buttonContainer}>
                            <Button 
                                variant="outlined" 
                                color="primary" 
                                size="small" 
                                className={classes.button}
                                disabled={loading}
                            >
                                CONTACT
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="primary" 
                                size="small" 
                                className={classes.button}
                                onClick={() =>setEditable(true)}
                                disabled={loading || editable ? true : false}
                            >
                                EDIT
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="primary" 
                                size="small" 
                                className={classes.button}
                                disabled={loading || !editable ? true : false}
                                onClick={onSubmit}
                                type="submit"
                            >
                                SAVE
                            </Button>
                        </Box>
                        <br />
                        <br />
                        <Box component="div">
                            <Typography variant="subtitle2" component="span" className={classes.label}>Middle Names</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{middleName}</Typography>    
                        </Box>
                        <Box component="div">
                            <Typography variant="subtitle2" component="span" className={classes.label}>Date of Birth</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{dateOfBirth}</Typography>    
                        </Box>
                        <Box component="div">
                            <Typography variant="subtitle2" component="span" className={classes.label}>Email</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{email}</Typography>    
                        </Box>
                        <Box component="div">
                            <Typography variant="subtitle2" component="span" className={classes.label}>Nationality</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{nationality}</Typography>    
                        </Box>
                        <Box component="div">
                            <Typography variant="subtitle2" component="span" className={classes.label}>City</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{city}</Typography>    
                        </Box>
                    </Box>
                    <Box component="div" className={classes.box}>
                        <Avatar variant="square" alt="Avatar" src={avatar} className={classes.avatar} />
                        <Box component="div">
                            <Typography variant="subtitle2" component="span" className={classes.label}>Phone Number</Typography>
                            {editable ? 
                                <TextField 
                                    className={classes.input}
                                    value={phoneNumber || ''}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Phone Number"
                                    helperText={errors.phoneNumber}
                                    fullWidth
                                    required
                                    error={errors.phoneNumber ? true : false}
                                />
                                :
                                <Typography variant="subtitle2" className={classes.info}>{phoneNumber}</Typography>    
                            }
                        </Box>
                        <Box component="div">
                            <Typography variant="subtitle2" component="span" className={classes.label}>Client Since</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{moment(customer?.createdOn).format('DD.MM.YYYY')}</Typography>    
                        </Box>
                        <Box component="div">
                            <Typography variant="subtitle2" component="span" className={classes.label}>Risk Profile</Typography>
                            {editable ? 
                                <FormControl 
                                    variant="outlined" 
                                    error={errors.riskProfile ? true : false } 
                                    fullWidth 
                                    required
                                    disabled={loading ? true : false}
                                >
                                    <Select
                                        labelId="riskProfile"
                                        value={riskProfile}
                                        onChange={(e) => setRiskProfile(e.target.value)}
                                    
                                    >
                                        <MenuItem value="" disabled selected>Select Risk Profile</MenuItem>
                                        {RISK_PROFILES.map((item, index) => (
                                            <MenuItem key={index} value={item}>{item}</MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{errors.riskProfile}</FormHelperText>
                                </FormControl>
                                :
                                <Typography variant="subtitle2" className={classes.info}>{riskProfile}</Typography>    
                            }
                        </Box>
                        <Box component="div">
                            <Typography variant="subtitle2" component="span" className={classes.label}>Country</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{country}</Typography>    
                        </Box>
                    </Box>
                </form>
                <form className={classes.remarkContainer} noValidate>
                    <Typography variant="subtitle2" className={classes.info}>Remark</Typography>
                    <br />
                    {customer.remarks}
                    <br /><br />
                    <TextField 
                        className={classes.input}
                        value={remarks || ''}
                        onChange={(e) => setRemarks(e.target.value)}
                        type="text"
                        multiline
                        minRows={3}
                        variant="outlined" 
                        placeholder="Add new remark"
                        helperText={errors.remarks}
                        fullWidth
                        required
                        error={errors.remarks ? true : false}
                    />
                    <Button 
                        variant="outlined" 
                        type="submit" 
                        color="primary" 
                        onClick={saveRemark} 
                        className={classes.saveRemarkButton}
                        disabled={loading || !editable ? true : false}
                    >
                        Save
                    </Button>
                </form>
            </Box> */}
        </>
    );
};

PersonalDetails.propTypes = {
    getIdCardValidationResponse: PropTypes.func.isRequired,
    getResidencePermitValidationResponse: PropTypes.func.isRequired,
    setCustomerStatus: PropTypes.func.isRequired,
    updateCustomerProfile: PropTypes.func.isRequired
};

export default connect(undefined, { getIdCardValidationResponse, getResidencePermitValidationResponse, setCustomerStatus, updateCustomerProfile })(PersonalDetails);