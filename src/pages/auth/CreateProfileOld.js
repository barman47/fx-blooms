import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { 
    Button, 
    FormControl, 
    FormHelperText, 
    Grid, 
    MenuItem, 
    Select, 
    TextField, 
    Tooltip, 
    Typography,
    Zoom 
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { CloudUpload, Information } from 'mdi-material-ui';
import { makeStyles } from '@material-ui/core/styles';

import SignUpSuccessModal from './SignUpSuccessModal';
import Spinner from '../../components/common/Spinner';
import Toast from '../../components/common/Toast';

import { getCountries } from '../../actions/countries';
import { getDocuments } from '../../actions/documents';
import { createCustomer } from '../../actions/customer';
import { SET_CURRENT_CUSTOMER } from '../../actions/types';

import isEmpty from '../../utils/isEmpty';
import { HOME, LOGIN } from '../../routes';
import { COLORS, NETWORK_ERROR, UPLOAD_LIMIT } from '../../utils/constants';
import validateCreateProfile from '../../utils/validation/customer/createProfile';

import logo from '../../assets/img/logo.svg';

const useStyles = makeStyles(theme => ({
    root: {
        paddingBottom: theme.spacing(5)
    },

    aside: {
        backgroundColor: COLORS.lightTeal,
        display: 'flex',
        flexDirection: 'column',
        padding: [[theme.spacing(4), theme.spacing(8)]],

        '& div:first-child': {
            display: 'flex',
            flexDirection: 'column',
            height: 'auto',
            alignItems: 'center',
            fontWeight: 300,

            '& img': {
                marginBottom: theme.spacing(5),
            }
        },
        
        [theme.breakpoints.down('md')]: {
            height: '50vh'
        },
        
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },

    logo: {
        marginLeft: theme.spacing(-15)
    },
    
    text: {
        display: 'inline-block',
        fontWeight: 300,
        marginBottom: theme.spacing(2),
        width: '70%'
    },

    info: {
        border: '1px solid #eb5757',
        borderRadius: '10px',
        margin: '0 auto',
        padding: theme.spacing(2),
        width: '65%',
        
        '& span': {
            display: 'inline-block',
            fontWeight: 300,
            width: '100%'
        }
    },

    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        paddingLeft: theme.spacing(5),
        paddingTop: theme.spacing(5),

        [theme.breakpoints.down('md')]: {
            height: '100%',
            justifyContent: 'flex-start',
            padding: theme.spacing(3)
        }
    },

    header: {
        [theme.breakpoints.down('md')]: {
            alignSelf: 'center',
            marginBottom: theme.spacing(2),
            textAlign: 'center'
        }
    },

    fileUpload: {
        border: `1px solid ${COLORS.grey}`,
        borderRadius: theme.shape.borderRadius,
        color: COLORS.grey,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        fontWeight: 300,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: [[theme.spacing(8), 0]]

    },

    uploadIcon: {
        color: theme.palette.primary.main
    },

    photo: {
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(40),
        width: theme.spacing(40)
    },

    idPhoto: {
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(40),
        width: '100%'
    },

    '& span': {
        color: 'red',
        marginBottom: theme.spacing(5)
    },

    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'none'
        }
    },

    error: {
        color: 'red',
        fontSize: theme.spacing(1.5),
        fontWeight: 300
    },

    uploadSuccess: {
        color: theme.palette.primary.main,
        fontSize: theme.spacing(1.5)
    }
}));

const CreateProfile = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const history = useHistory();
    const location = useLocation();

    const { isAuthenticated, twoFactorEnabled } = useSelector(state => state.customer);
    const { countries, documents } = useSelector(state => state);
    const { successMessage } = useSelector(state => state.customer);
    const errorsState = useSelector(state => state.errors);
    
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [CountryCode, setCountryCode] = useState('');
    const [PhoneNo, setPhoneNo] = useState('');
    const [Address, setAddress] = useState('');
    const [Country, setCountry] = useState('');
    const [CountryId, setCountryId] = useState('');
    const [City, setCity] = useState('');
    const [StateId, setStateId] = useState('');
    const [states, setStates] = useState([]);
    const [PostalCode, setPostalCode] = useState('');

    const [Photo, setPhoto] = useState('');
    const [PhotoFile, setPhotoFile] = useState(null);
    // eslint-disable-next-line
    const [PhotoUrl, setPhotoUrl] = useState('');
    const [uploadedPhoto, setUploadedPhoto] = useState(false);

    const [DocumentType, setDocumentType] = useState('');
    const [Document, setDocument] = useState('');
    const [IdNumber, setIdNumber] = useState('');

    const [IdFront, setIdFront] = useState('');
    const [IdFrontUrl, setIdFrontUrl] = useState('');
    const [IdFrontPhoto, setIdFrontPhoto] = useState(null);
    const [uploadedIdFront, setUploadedIdFront] = useState(false);
    
    const [IdBackPhoto, setIdBackPhoto] = useState(null);
    const [IdBack, setIdBack] = useState('');
    const [IdBackUrl, setIdBackUrl] = useState('');
    const [uploadedIdBack, setUploadedIdBack] = useState(false);
    
    const [Profile, setProfile] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [loadingText, setLoadingText] = useState('');

    const [verifiedEmail, setVerifiedEmail] = useState(false);

    const toast = useRef();

    useEffect(() => {
        // if (location.state.verifiedEmail) {
        //     setVerifiedEmail(true);
        // } else {
        //     return history.push('/');
        // }
        if (isAuthenticated && twoFactorEnabled) {
            return window.location.href = HOME;
        }
        if (countries.length === 0) {
            props.getCountries();
        }
        if (documents.length === 0) {
            props.getDocuments();
        }

        return () => {
            dispatch({
                type: SET_CURRENT_CUSTOMER,
                payload: { }
            });
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (successMessage) {
            setLoading(false);
            setOpen(true);
        }
    }, [successMessage]);

    // useEffect(() => {
    //     console.log(emojiFlags.data);
    // }, []);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors({ ...errors, msg: errorsState.msg });
            setLoading(false);
            setLoadingText('');
        }
    }, [errorsState, errors]);

    useEffect(() => {
        if (location.state) {
            setProfile({ ...location.state });
        }
    }, [location.state]);

    // Setting states when a country is selected
    useEffect(() => {
        if (!isEmpty(Country)) {
            const country = countries.find(country => country.name === Country);
            const CountryId = country.id;
            setCountryId(CountryId);

            // eslint-disable-next-line array-callback-return
            const states = [];

            countries.forEach(item => {
                if (item.id === CountryId) {
                    states.push(item.states[0]);
                }
            });
            setStates(states);
        }

        if (isEmpty(Country)) {
            setCountryId('');
            setStates([]);
        }
    }, [Country, countries]);

    // Setting StateId when user selects a state
    useEffect(() => {
        if (!isEmpty(City)) {
            const state = states.find(state => state?.name === City);
            setStateId(state?.id);
        }
        if (isEmpty(City)) {
            setStateId('');
        }
    }, [City, states]);

    // Setting documentId when user selects a document type
    useEffect(() => {
        if (!isEmpty(DocumentType)) {
            const document = documents.find(document => document.text === DocumentType);
            setDocument(document.value);
        }
    }, [DocumentType, documents]);

    useEffect(() => {
        setErrors(errors);
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    const handleSetPhoto = (e) => {
        setPhotoFile(e.target.files[0]);
        const reader = new FileReader();

        reader.onload = (() => {
            const image = reader.result; //Array Buffer
            setPhoto(image);
        });
        reader.readAsDataURL(e.target.files[0]);
    };

    const handleSetIdFront = (e) => {
        setIdFront(e.target.files[0]);
        const reader = new FileReader();

        reader.onload = (() => {
            const image = reader.result; //Array Buffer
            setIdFrontPhoto(image);
        });
        reader.readAsDataURL(e.target.files[0]);
    };

    const handleSetIdBack = (e) => {
        setIdBack(e.target.files[0]);
        const reader = new FileReader();

        reader.onload = (() => {
            const image = reader.result; //Array Buffer
            setIdBackPhoto(image);
        });
        reader.readAsDataURL(e.target.files[0]);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    // const startWebCam = async () => {
    //     let stream = null;
    //     try {
    //         const constraints = {
    //             audio: false,
    //             video: { 
    //                 facingMode: { exact: 'environment' },
    //                 width: {
    //                     min: 360,
    //                     max: 1920,
    //                     ideal: 1280 
    //                 },
    //                 height: {
    //                     min: 480,
    //                     max: 1080,
    //                     ideal: 720
    //                 }
    //             }
    //         };
    //         stream = await navigator.mediaDevices.getUserMedia(constraints);
    //         setPhotoFile(stream);
    //         console.log(stream);
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    const handleSetPhoneNumber = (e) => {
        if (!isNaN(Number(e.target.value))) {
            setPhoneNo(e.target.value);
        }
    };

    const handleError = (err, key, msg) => {
        console.log(err.response);
        console.error(err);
        setLoading(false);
        if (err?.message === NETWORK_ERROR) {
            return setErrors({ msg:  NETWORK_ERROR });    
        }

        return setErrors({ [`${key}`]: msg || 'Upload Failed' });
    };

    const selectPhoto = () => document.getElementById('photo').click();

    const selectIdCardFront = () => document.getElementById('idCardFront').click();
    
    const selectIdCardBack = () => document.getElementById('idCardBack').click();

    const uploadPhoto = async () => {
        setErrors({});
        try {
            const file = PhotoFile;
            if (!file) {
                return setErrors({ msg: 'Photo is required!', photo: 'Photo is required!' });
            }

            if (file.size / UPLOAD_LIMIT > 1) {
                return setErrors({ msg: 'File too large', photo: 'Photo must not be greater than 1MB' });
            }

            setLoadingText('Uploading Photo . . .');
            setLoading(true);
            const data = new FormData();
            data.append(`${file.name}`, file);
            const res = await axios.post(`https://objectcontainer.fxblooms.com/api/UploadFiles/Upload`, data, {
                'Content-Type': 'multipart/form-data'
            });
            setPhotoUrl(res.data.fileName);
            setUploadedPhoto(true);
            setLoading(false);
        } catch (err) {
            return handleError(err, 'photo', 'Photo upload failed');
        }
    };

    const uploadIdFront = async () => {
        setErrors({});
        try {
            const file = IdFront;
            if (!file) {
                return setErrors({ msg: 'Photo is required!', idFront: 'Photo is required!' });
            }

            if (file.size / UPLOAD_LIMIT > 1) {
                return setErrors({ msg: 'File too large', idFront: 'Photo must not be greater than 1MB' });
            }

            setLoadingText('Uploading ID Front . . .');
            setLoading(true);
            const data = new FormData();
            data.append(`${file.name}`, file);
            const res = await axios.post(`https://objectcontainer.fxblooms.com/api/UploadFiles/Upload`, data, {
                'Content-Type': 'multipart/form-data'
            });
            setIdFrontUrl(res.data.fileName);
            setUploadedIdFront(true);
            setLoading(false);
        } catch (err) {
            return handleError(err, 'idFront', 'ID upload failed');
        }
    };

    const uploadIdBack = async () => {
        setErrors({});
        try {
            const file = IdBack;
            console.log(file);
            if (!file) {
                return setErrors({ msg: 'Photo is required!', idBack: 'Photo is required!' });
            }

            if (file.size / UPLOAD_LIMIT > 1) {
                return setErrors({ msg: 'File too large', idBack: 'Photo must not be greater than 3MB' });
            }

            setLoadingText('Uploading ID Back . . .');
            setLoading(true);
            const data = new FormData();
            data.append(`${file.name}`, file);
            const res = await axios.post(`https://objectcontainer.fxblooms.com/api/UploadFiles/Upload`, data, {
                'Content-Type': 'multipart/form-data'
            });
            setIdBackUrl(res.data.fileName);
            setUploadedIdBack(true);
            setLoading(false);
        } catch (err) {
            return handleError(err, 'idBack', 'ID upload failed');
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const data = {
            ...Profile,
            FirstName,
            LastName,
            Country,
            CountryCode,
            PhoneNo,
            Address,
            CountryId,
            StateId,
            PostalCode,
            Img: Photo,
            Document: {
                IdNumber,
                DocumentType: Document,
                Img: IdFrontUrl,
                BackImg: IdBackUrl
            }
        };

        const { ConfirmPassword, ...rest } = data;

        const { errors, isValid } = validateCreateProfile({ ...rest });

        if (!isValid) {
            return setErrors({ ...errors, msg: 'Invalid sign up data' });
        }
    
        setLoading(true);
        setLoadingText('One Moment . . .');
        props.createCustomer({ ...rest });
    };

    return (
        <>
            <Helmet><title>Create Profile | FXBLOOMS.com</title></Helmet>
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
            <SignUpSuccessModal handleCloseModal={handleCloseModal} open={open} text={successMessage || ''} />
            <section className={classes.root}>
                <Grid container direction="row">
                    <Grid item xs={12} md={12} lg={5} className={classes.aside}>
                        <div>
                            <a href="https://fxblooms.com">
                                <img src={logo} className={classes.logo} alt="FX Blooms logo" />
                            </a>
                            <Typography variant="subtitle2" component="span" className={classes.text} style={{ fontWeight: 500 }}>Hello <span style={{ color: COLORS.primary }}>{Profile.Username},</span></Typography>
                            <Typography variant="subtitle2" component="span" className={classes.text}>Thanks for joining!.</Typography>
                            <Typography variant="subtitle2" component="span" className={classes.text}>Trust and Security are cornerstones of FXBLOOMS.</Typography>
                            <Typography variant="subtitle2" component="span" className={classes.text}>To ensure this platform remain safe and secure, kindly tell us about yourself.</Typography>
                            <div className={classes.info}>
                                <Typography variant="subtitle2" component="span">Please not that all information provided on this page must be true and accurate.</Typography>
                                <Typography variant="subtitle2" component="span">If any misinformation is spotted, you will not be allowed to use the platform.</Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={12} lg={5} className={classes.formContainer}>
                        <div className={classes.header}>
                            <Typography variant="h4">Create a profile</Typography>
                            <Typography variant="subtitle2" component="span">Complete the form below to create a profile.</Typography>
                            <br /><br /><br />
                            <Typography variant="subtitle2" component="span" color="primary">2 of 2 (Profile details).</Typography>
                            <br /><br />
                            <Alert severity="success">Email successfuly verified</Alert>
                            <br />
                        </div>
                        <form onSubmit={handleFormSubmit} noValidate>
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={12} md={5}>
                                    <Tooltip title="This should be your official government name" placement="top" arrow>
                                        <>
                                            <Typography variant="subtitle2" component="span">First Name</Typography>
                                            <TextField 
                                                className={classes.input}
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
                                        </>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <Tooltip title="This should be your official government name" placement="top" arrow>
                                        <>
                                            <Typography variant="subtitle2" component="span">Last Name</Typography>
                                            <Tooltip title="This should be your official government name" TransitionComponent={Zoom} TransitionProps={{ timeout: 300 }} arrow>
                                                <Information style={{ float: 'right' }} />
                                            </Tooltip>
                                            <TextField 
                                                className={classes.input}
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
                                        </>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="subtitle2" component="span">Phone Number</Typography>
                                    <FormControl 
                                        variant="outlined" 
                                        error={errors.CountryCode ? true : false } 
                                        fullWidth 
                                        required
                                    >
                                        <Select
                                            labelId="CountryCode"
                                            className={classes.input}
                                            value={CountryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                        
                                        >
                                            <MenuItem value="">Country Code</MenuItem>
                                            {/* {countryCodes.map((country, index) => (
                                                <MenuItem key={index} value={country.dialCode}>
                                                    {country.dialCode}
                                                </MenuItem>
                                            ))} */}
                                        </Select>
                                        <FormHelperText>{errors.CountryCode}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                {
                                    CountryCode && 
                                    <Grid item xs={12} md={7}>
                                        <Typography variant="subtitle2" component="span">Phone Number</Typography>
                                        <TextField 
                                            className={classes.input}
                                            value={PhoneNo}
                                            onChange={handleSetPhoneNumber}
                                            type="text"
                                            variant="outlined" 
                                            placeholder="Enter Phone Number"
                                            helperText={errors.PhoneNo}
                                            fullWidth
                                            required
                                            error={errors.PhoneNo ? true : false}
                                        />
                                    </Grid>
                                }
                                <Grid item xs={12} md={10}>
                                <Typography variant="subtitle2" component="span">Address</Typography>
                                    <TextField 
                                        className={classes.input}
                                        value={Address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter your Address"
                                        helperText={errors.Address}
                                        multiline
                                        rows={1}
                                        fullWidth
                                        required
                                        error={errors.Address ? true : false}
                                    />
                                </Grid>
                            
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" component="span">Country</Typography>
                                    <FormControl 
                                        variant="outlined" 
                                        error={errors.Country ? true : false } 
                                        fullWidth 
                                        required
                                    >
                                        <Select
                                            labelId="Country"
                                            className={classes.input}
                                            value={Country}
                                            onChange={(e) => setCountry(e.target.value)}
                                        
                                        >
                                            <MenuItem value="">Select Country</MenuItem>
                                            {countries.map((Country) => (
                                                <MenuItem key={Country.id} value={Country.name}>{Country.name}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.Country}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="subtitle2" component="span">City/State</Typography>
                                    <FormControl 
                                        variant="outlined" 
                                        error={errors.City ? true : false } 
                                        fullWidth 
                                        required
                                    >
                                        <Select
                                            labelId="City"
                                            className={classes.input}
                                            value={City}
                                            onChange={(e) => setCity(e.target.value)}
                                        
                                        >
                                            <MenuItem value="">Select City</MenuItem>
                                            {states.length > 0 &&
                                                states.map((state, index) => (
                                                    <MenuItem key={index} value={state?.name}>{state?.name}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                        <FormHelperText>{errors.City}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    {Country.toLowerCase() !== 'nigeria' && 
                                        <>
                                            <Typography variant="subtitle2" component="span">Postal Code</Typography>
                                            <TextField 
                                                className={classes.input}
                                                value={PostalCode}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                                type="text"
                                                variant="outlined" 
                                                placeholder="Enter postal code"
                                                helperText={errors.PostalCode}
                                                fullWidth
                                                required
                                                error={errors.PostalCode ? true : false}
                                            />
                                        </>
                                    }
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography variant="subtitle1" component="span" style={{ color: COLORS.primary, fontWeight: 300 }}>
                                        Identity
                                    </Typography>
                                </Grid>
                                <Grid item xs={7} style={{ alignSelf: 'center' }}>
                                    <hr />
                                </Grid>
                                <Grid item xs={12} md={10}>
                                    <TextField 
                                        className={classes.input}
                                        onChange={handleSetPhoto}
                                        id="photo"
                                        style={{ display: 'none' }}
                                        type="file"
                                        variant="outlined" 
                                        inputProps={{
                                            accept: 'image/*'
                                        }}
                                        helperText={errors.Photo || 'Upload a clear Photo of your face'}
                                        fullWidth
                                        required
                                        error={errors.Photo ? true : false}
                                    />
                                    {
                                        Photo ? 
                                        <>
                                            <div style={{backgroundImage: `url(${Photo})`,}} className={classes.photo}></div>
                                            {errors.photo && <span className={classes.error}>{errors.photo}</span>}
                                            <br />
                                            {uploadedPhoto 
                                                ?
                                                <span className={classes.uploadSuccess}>Photo Uploaded</span>
                                                :
                                                <>
                                                    <Button onClick={selectPhoto} disabled={loading ? true : false}>Change Photo</Button>
                                                    <Button onClick={uploadPhoto} variant="contained" color="primary" size="small" disabled={loading ? true : false}>Upload Photo</Button>
                                                </>
                                            }
                                        </>
                                        :
                                        <div className={classes.fileUpload} onClick={selectPhoto}>
                                            <Typography variant="subtitle2" component="span">Click here to upload selfie (1MB Limit)</Typography>
                                            <CloudUpload className={classes.uploadIcon} />
                                        </div>
                                    }
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <Typography variant="subtitle2" component="span">Identity Card Type</Typography>
                                    <FormControl 
                                        variant="outlined" 
                                        error={errors.DocumentType ? true : false}
                                        fullWidth 
                                        required
                                    >
                                        <Select
                                            labelId="idCardType"
                                            className={classes.input}
                                            value={DocumentType}
                                            onChange={(e) => setDocumentType(e.target.value)}
                                        
                                        >
                                            <MenuItem value="">Select ID type</MenuItem>
                                            {documents.length > 0 &&
                                                documents.map((document, index) => (
                                                    <MenuItem key={index} value={document?.text}>{document?.text}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                        <FormHelperText>{errors.DocumentType}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <Typography variant="subtitle2" component="span">Document Number</Typography>
                                    <TextField 
                                        className={classes.input}
                                        value={IdNumber}
                                        onChange={(e) => setIdNumber(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Document Number"
                                        helperText={errors.IdNumber}
                                        fullWidth
                                        required
                                        error={errors.IdNumber ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <TextField 
                                        className={classes.input}
                                        onChange={handleSetIdFront}
                                        id="idCardFront"
                                        type="file"
                                        variant="outlined"
                                        style={{ display: 'none' }} 
                                        inputProps={{
                                            accept: 'image/*'
                                        }}
                                        helperText={errors.IdFront || 'ID Card Front'}
                                        fullWidth
                                        required
                                        error={errors.IdFront ? true : false}
                                    />
                                    {
                                        IdFront ? 
                                        <>
                                            <div style={{backgroundImage: `url(${IdFrontPhoto})`,}} className={classes.idPhoto}></div>
                                            {errors.idFront && <span className={classes.error}>{errors.idFront}</span>}
                                            <br />
                                            {
                                                uploadedIdFront
                                                ?
                                                <span className={classes.uploadSuccess}>ID Front Uploaded</span>
                                                :
                                                <>
                                                    <Button onClick={selectIdCardFront} color="primary">Change Photo</Button>
                                                    <Button onClick={uploadIdFront} variant="contained" color="primary" size="small">Upload</Button>   
                                                </>
                                            }
                                        </>
                                        :
                                        <div className={classes.fileUpload} onClick={selectIdCardFront}>
                                            <Typography variant="subtitle2" component="span">Click here to upload (front)</Typography>
                                            <CloudUpload className={classes.uploadIcon} />
                                        </div>
                                    }
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <TextField 
                                        className={classes.input}
                                        onChange={handleSetIdBack}
                                        id="idCardBack"
                                        type="file"
                                        variant="outlined"
                                        style={{ display: 'none' }}
                                        inputProps={{
                                            accept: 'image/*'
                                        }}
                                        helperText={errors.idBack || 'ID Card Back'}
                                        fullWidth
                                        error={errors.idBack ? true : false}
                                    />
                                    {
                                        IdBack ? 
                                        <>
                                            <div style={{backgroundImage: `url(${IdBackPhoto})`,}} className={classes.idPhoto}></div>
                                            {errors.idBack && <span className={classes.error}>{errors.idBack}</span>}
                                            <br />
                                            {
                                                uploadedIdBack
                                                ?
                                                <span className={classes.uploadSuccess}>ID Back Uploaded</span>
                                                :
                                                <>
                                                    <Button onClick={selectIdCardBack} color="primary">Change Photo</Button>
                                                    <Button onClick={uploadIdBack} variant="contained" color="primary" size="small">Upload</Button>
                                                </>
                                            }
                                        </>
                                        :
                                        <div className={classes.fileUpload} onClick={selectIdCardBack}>
                                            <Typography variant="subtitle2" component="span">Click here to upload (back)</Typography>
                                            <CloudUpload className={classes.uploadIcon} />
                                        </div>
                                    }
                                </Grid>
                                <Grid item xs={12} md={10}>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        type="submit"
                                        fullWidth
                                    >
                                        Proceed to set up 2FA
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} xl={12}>
                                    <Typography variant="subtitle1" component="p" style={{ fontWeight: 300 }}>
                                        Already have an account? <RouterLink to={LOGIN} className={classes.link}>Sign In</RouterLink>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </section>
        </>
    );
};

CreateProfile.propTypes = {
    createCustomer: PropTypes.func.isRequired,
    getCountries: PropTypes.func.isRequired,
    getDocuments: PropTypes.func.isRequired
};

export default connect(undefined, { createCustomer, getCountries, getDocuments })(CreateProfile);