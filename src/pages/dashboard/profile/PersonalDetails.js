import { useEffect, useRef, useState } from 'react'; 
import { connect, useDispatch, useSelector } from 'react-redux'; 
import { 
    Box,
    Button,
    Chip,
    FormControl,
    FormHelperText,
    Grid,
    MenuItem,
    Select,
    TextField, 
    Typography 
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { ChevronRight } from 'mdi-material-ui';
import PropTypes from 'prop-types';
import Validator from 'validator';

import { setHidePhoneNumber, setShowPhoneNumber, updateProfile } from '../../../actions/customer'; 
import { generateOtp } from '../../../actions/notifications';
import { GET_ERRORS, SET_CUSTOMER_MSG } from '../../../actions/types';

import isEmpty from '../../../utils/isEmpty'; 
import { COLORS, ID_STATUS } from '../../../utils/constants'; 
import countryToFlag from '../../../utils/countryToFlag'; 
import { countries } from '../../../utils/countries'; 
import extractCountryCode from '../../../utils/extractCountryCode'; 
import validateUpdateProfile from '../../../utils/validation/customer/updateProfile';

import VerifyPhoneNumberModal from './VerifyPhoneNumberModal';
import Spinner from '../../../components/common/Spinner';
import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';

const useStyles = makeStyles(theme =>({
    noProfile: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing(-3),
        padding: theme.spacing(5),

        '& h5': {
            fontWeight: 600,
            marginBottom: theme.spacing(2)
        },

        '& p': {
            color: COLORS.offBlack,
            marginBottom: theme.spacing(2)
        },
    },

    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(-3),

        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginBottom: theme.spacing(4),
        },
        
        '& div:first-child': {
            marginBottom: theme.spacing(2),

            '& h4': {
                [theme.breakpoints.down('sm')]: {
                    fontSize: theme.spacing(3)
                }
            }
        },

        '& hr': {
            margin: 0,
            marginTop: theme.spacing(1),
            width: '30%'
        },

        '& p': {
            fontWeight: 300
        }
    },

    container: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,

        [theme.breakpoints.down('md')]: {
            paddingBottom: theme.spacing(4)
        }
    },

    button: {
        fontWeight: 500
    },

    label: {
        fontWeight: 300
    },

    info: {
        fontWeight: 600
    },

    verificationButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'space-between'
        }
    },

    verifyButton: {
        marginLeft: theme.spacing(3),
        [theme.breakpoints.down('sm')]: {
            marginLeft: 0
        }
    }
}));

const PersonalDetails = ({ generateOtp, setHidePhoneNumber, setShowPhoneNumber, updateProfile, verifyIdentity }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { isPhoneNumberVerified, msg, profile, stats } = useSelector(state => state.customer); 
    const errorsState = useSelector(state => state.errors); 

    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [Email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [address, setAddress] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [country, setCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [spinnerText, setSpinnerText] = useState('');
    // eslint-disable-next-line
    const [Listings, setListings] = useState(0);
    // eslint-disable-next-line
    const [Transactions, setTransactions] = useState(0);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [editable, setEditable] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');

    const toast = useRef();
    const successModal = useRef();

    const { NOT_SUBMITTED } = ID_STATUS;

    useEffect(() => {
        if (profile) {
            const { address, firstName, lastName, email, userName, phoneNo, countryId, postalCode, numberOfListings, numberOfSuccessfulTransactions } = profile;
            setFirstName(firstName);
            setLastName(lastName);
            setEmail(email);
            setUsername(userName);
            setPhoneNo(phoneNo);
            setAddress(address);
            setCountry(countryId);
            setPostalCode(postalCode);
            setListings(numberOfListings);
            setTransactions(numberOfSuccessfulTransactions);
        }
    }, [profile]);

    useEffect(() => {
        if (msg) {
            setSpinnerText('');
            successModal.current.setModalText(msg);
            successModal.current.openModal();
            setLoading(false);
            setEditable(false);
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

    // Set country code and phone number when edit button is clicked
    useEffect(() => {
        if (editable && !isEmpty(profile.phoneNo)) {
            countries.forEach(country => {
                if (profile.phoneNo.startsWith(country.phone)) {
                    setCountryCode(`+${country.phone}`);
                    setPhoneNo(profile.phoneNo.slice(country.phone.length));
                }
            });
        }
    }, [editable, profile.phoneNo]);

    // Setting states when a country is selected
    // useEffect(() => {
    //     if (!isEmpty(country)) {
    //         const country = countries.find(country => country.name === country);
    //         const CountryId = country?.id;
    //         setCountryId(CountryId);

    //         // eslint-disable-next-line array-callback-return
    //         const states = [];

    //         countries.forEach(item => {
    //             if (item.id === CountryId) {
    //                 states.push(item.states[0]);
    //             }
    //         });
    //         setStates(states);
    //     }
    // }, [country, countries]);

    // useEffect(() => {
    //     if (countryId && stateId) {
    //         const country = countries.find(country => country.id.toLowerCase() === countryId.toLowerCase());
    //         const state = country?.states.find(state => state.id.toLowerCase() === stateId.toLowerCase());
    //         setCity(state?.name);
    //         setCountry(country?.name);
    //     }
    // }, [countryId, stateId]);
    
    const onSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const { code, number } = extractCountryCode(profile.phoneNo ? profile.phoneNo:  `${countryCode}${phoneNo}`);

        const data = {
            address,
            country,
            countryCode: editable ? countryCode : code,
            phoneNo: editable ? phoneNo : number,
            postalCode
        };

        const { errors, isValid } = validateUpdateProfile(data);
        if (!isValid) {
            return setErrors({ msg: 'Invalid Profile Information', ...errors });
        }

        setSpinnerText('Updating Profile...');
        setLoading(true);
        updateProfile({
            address,
            country,
            postalCode,
            phoneNumber: {
                countryCode: editable ? countryCode : code,
                telephoneNumber: editable ? phoneNo : number
            }
        });
    };

    const handleGenerateOtp = () => {
        // const { code, number } = extractCountryCode(phoneNo);
        const { code, number } = extractCountryCode(countryCode && phoneNo ? `${countryCode}${phoneNo}` : phoneNo);

        if (Validator.isEmpty(number)) {
            return setErrors({ msg: 'Invalid Phone Number!', phoneNo: 'Phone Number is required!' });
        }
        
        setOpen(!open);
        setPhoneNumber(number);
        setCode(code);
        generateOtp({
            countryCode: code,
            telephoneNumber: number.charAt(0) === '0' ? number.substring(1, number.length) : number
        });
    };

    const dismissAction = () => {
        setPhoneNumber('');
        setCode('');
        setEditable(false);
        setOpen(false);
        dispatch({
            type: SET_CUSTOMER_MSG,
            payload: null
        });
    };

    if (stats.residencePermitStatus === NOT_SUBMITTED && stats.idStatus === NOT_SUBMITTED) {
        return (
            <div className={classes.noProfile}>
                <Typography variant="h5" color="primary">No Profile</Typography>
                <Typography variant="body2" component="p">Kindly verify your identity to create a profile and buy and sell.</Typography>
                <Button className={classes.button} color="primary" variant="contained" onClick={() => verifyIdentity()}>Verify Identity</Button>
            </div>
        );
    } 

    const togglePhoneNumber = () => {
        profile.showPhoneNumber ? setHidePhoneNumber() : setShowPhoneNumber();
        setLoading(true);
        setSpinnerText('One Moment . . .');
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
            {loading && <Spinner text={spinnerText} />}
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            {open && 
                <VerifyPhoneNumberModal 
                    isOpen={open} 
                    dismissAction={dismissAction} 
                    phoneNumber={phoneNumber} 
                    countryCode={code}
                />
            }
            <div className={classes.header}>
                <div>
                    <Typography variant="h4" color="primary">Account Setup (Profile)</Typography>
                    <Typography variant="body1" component="p">Kindly provide your profile details</Typography>
                    <hr className={classes.hr} />
                </div>
                {!isEmpty(profile) && 
                    <Button variant="outlined" color="primary" disabled={editable} onClick={() => {
                        setEditable(true);
                        setPhoneNo('');
                    }}>Edit Details</Button>
                }
            </div>
            <Grid className={classes.root} container direction="column">
                <Grid item xs={12}>
                    <form onSubmit={onSubmit} noValidate>
                        <Grid container direction="row" spacing={3} className={classes.container}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>First Name</Typography>
                                {profile.firstName ?
                                    <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{profile.firstName}</Typography>
                                    :
                                    <TextField 
                                        className={classes.info}
                                        value={FirstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter First Name"
                                        helperText={errors.FirstName}
                                        fullWidth
                                        required
                                        error={errors.FirstName ? true : false}
                                    />
                                }
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>Last Name</Typography>
                                {profile.lastName ?
                                    <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{profile.lastName}</Typography>
                                    :
                                    <TextField 
                                        className={classes.info}
                                        value={LastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Last Name"
                                        helperText={errors.LastName}
                                        fullWidth
                                        required
                                        error={errors.LastName ? true : false}
                                    />
                                }
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>Email Address</Typography>
                                <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{Email}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>Username</Typography>
                                <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{username}</Typography>
                            </Grid>
                            {editable &&
                                <Grid item xs={5} md={2}>
                                    <Typography variant="subtitle2" component="span" className={classes.label}>Country Code</Typography>
                                    <Autocomplete
                                        id="country-select"
                                        options={countries}
                                        autoHighlight
                                        disableClearable
                                        getOptionLabel={(option) => {
                                            setCountryCode(`+${option.phone}`);
                                            return `+${option.phone}`;
                                        }}
                                        renderOption={(option) => (
                                            <>
                                                <span>{countryToFlag(option.code)}</span>
                                                {`+${option.phone}`}
                                            </>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                                }}
                                                // onChange={(e) => setCountryCode(e.target.value)}
                                            />
                                        )}
                                    />
                                    <FormHelperText id="my-helper-text">e.g. +234</FormHelperText>
                                    {errors.countryCode && <FormHelperText error>{errors.countryCode}</FormHelperText>}
                                </Grid>
                            }
                            <Grid item xs={12} md={editable ? 3 : 4} lg={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>Phone Number &nbsp; &nbsp;
                                    {!editable && 
                                        <>
                                            <strong>{profile.showPhoneNumber ? 'Showing' : 'Hidden'}</strong>&nbsp; &nbsp;
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                disabled={loading}
                                                onClick={togglePhoneNumber}
                                            >
                                                {profile.showPhoneNumber ? 'Hide' : 'Show'}
                                            </Button>
                                        </>
                                    }
                                </Typography>
                                {profile.phoneNo && !editable ?
                                    <>
                                        <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{profile.phoneNo}</Typography>
                                        <FormHelperText style={{ color: COLORS.red }}>{errors.phoneNo}</FormHelperText>
                                    </>
                                    :
                                    <TextField 
                                        className={classes.info}
                                        value={phoneNo}
                                        onChange={(e) => setPhoneNo(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="e.g. 08080808080"
                                        helperText={errors.phoneNo || 'e.g. 08080808080'}
                                        fullWidth
                                        required
                                        error={errors.phoneNo ? true : false}
                                    />
                                }
                            </Grid>
                            {!editable && 
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" component="span" className={classes.label}>Verification Status</Typography>
                                    <Box component="div" className={classes.verificationButtonContainer}>
                                        <Chip  
                                            label={isPhoneNumberVerified ? 'Verified' : 'Unverified'}
                                            color={isPhoneNumberVerified ? 'primary' : 'secondary'}
                                        />
                                        {!isPhoneNumberVerified &&
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                size="small" 
                                                endIcon={<ChevronRight />} 
                                                className={classes.verifyButton}
                                                onClick={handleGenerateOtp}
                                            >
                                                Verify Now
                                            </Button>
                                        }
                                    </Box>
                                </Grid>
                            }
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>Address</Typography>
                                {profile.address && !editable ?
                                    <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{profile.address}</Typography>
                                    :
                                    <TextField 
                                        className={classes.info}
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Address"
                                        helperText={errors.address}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        required
                                        error={errors.address ? true : false}
                                    />
                                }
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>Country</Typography>
                                    {profile.countryId && !editable ? 
                                    <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{profile.countryId}</Typography>
                                    :
                                        <FormControl 
                                            variant="outlined" 
                                            helperText={errors.country}
                                            error={errors.country ? true : false}
                                            fullWidth 
                                            required
                                        >
                                            <Select
                                                labelId="CountryCode"
                                                className={classes.input}
                                                // value={profile.countryId || country}
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                            
                                            >
                                                <MenuItem value="">Select Country</MenuItem>
                                                {countries.map((country, index) => (
                                                    <MenuItem key={index} value={country.label}>{country.label}</MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>{errors.country}</FormHelperText>
                                        </FormControl>
                                    }
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>Postal Code</Typography>
                                {profile.postalCode && !editable ? 
                                    <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{profile.postalCode}</Typography>
                                    :
                                    (country?.toLowerCase() !== 'nigeria' ?
                                        <TextField 
                                            className={classes.info}
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value)}
                                            type="text"
                                            variant="outlined" 
                                            placeholder="Postal Code"
                                            helperText={errors.postalCode}
                                            fullWidth
                                            required
                                            error={errors.postalCode ? true : false}
                                        />
                                        :
                                        null
                                    )
                                }
                            </Grid>
                            {editable && 
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading ? true : false}>Save and Continue</Button>
                                </Grid>
                            }
                            {/* <Grid item xs={4}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>Listings</Typography>
                                <Typography variant="subtitle2" className={classes.info}>{Listings}</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>Successful Transactions</Typography>
                                <Typography variant="subtitle2" className={classes.info}>{Transactions}</Typography>
                            </Grid> */}
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </>
    );
};

PersonalDetails.propTypes = {
    generateOtp: PropTypes.func.isRequired,
    setHidePhoneNumber: PropTypes.func.isRequired,
    setShowPhoneNumber: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    verifyIdentity: PropTypes.func.isRequired
};

export default connect( undefined, { generateOtp, setHidePhoneNumber, setShowPhoneNumber, updateProfile } )(PersonalDetails);