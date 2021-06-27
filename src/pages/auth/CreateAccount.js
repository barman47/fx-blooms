import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, 
    FormControl, 
    FormHelperText, 
    Grid, 
    InputLabel, 
    MenuItem, 
    Select, 
    TextField, 
    Tooltip, 
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import emojiFlags from 'emoji-flags';

import Spinner from '../../components/common/Spinner';
import Toast from '../../components/common/Toast';

import { getCountries } from '../../actions/countries';
import { getDocuments } from '../../actions/documents';
import { createCustomer } from '../../actions/customer';

import isEmpty from '../../utils/isEmpty';
import { LOGIN } from '../../routes';
import { COLORS } from '../../utils/constants';
import validateCreateProfile from '../../utils/validation/customer/createAccount';

import logo from '../../assets/img/logo.svg';

const useStyles = makeStyles(theme => ({
    aside: {
        backgroundColor: COLORS.lightTeal,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        // height: '100vh',
        padding: [[theme.spacing(4), theme.spacing(8)]],

        '& div:first-child': {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'space-evenly',

            '& span': {
                width: '60%'
            },
            
            '& div': {
                width: '60%'
            }
        },

        [theme.breakpoints.down('md')]: {
            height: '50vh'
        },

        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },

    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        // height: '100vh',
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
    }
}));

const CreateAccount = (props) => {
    const classes = useStyles();
    const { countries } = useSelector(state => state);
    const { documents } = useSelector(state => state);
    const errorsState = useSelector(state => state.errors);
    

    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [CountryCode, setCountryCode] = useState('');
    const [PhoneNo, setPhone] = useState('');
    const [Address, setAddress] = useState('');
    const [Country, setCountry] = useState('');
    const [CountryId, setCountryId] = useState('');
    const [City, setCity] = useState('');
    const [StateId, setStateId] = useState('');
    const [states, setStates] = useState([]);
    const [PostalCode, setPostalCode] = useState('');
    // eslint-disable-next-line
    const [Photo, setPhoto] = useState('');
    const [PhotoFile, setPhotoFile] = useState(null);
    const [DocumentType, setDocumentType] = useState('');
    const [IdNumber, setIdNumber] = useState('');
    // eslint-disable-next-line
    const [IdFront, setIdFront] = useState('');
    const [IdFrontPhoto, setIdFrontPhoto] = useState(null);
    // eslint-disable-next-line
    const [IdBackPhoto, setIdBackPhoto] = useState(null);
    // eslint-disable-next-line
    const [IdBack, setIdBack] = useState('');
    // eslint-disable-next-line
    const [Profile, setProfile] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');

    const countryCodes = emojiFlags.data;

    const location = useLocation();

    const toast = useRef();
    const spinner = useRef();

    useEffect(() => {
        if (countries.length === 0) {
            props.getCountries();
        }
        if (documents.length === 0) {
            props.getDocuments();
        }
        // eslint-disable-next-line
    }, []);

    // useEffect(() => {
    //     console.log(emojiFlags.data);
    // }, []);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors({ ...errors, msg: errorsState.msg });
        }
        setLoading(false);
        setLoadingText('');
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
    }, [Country, countries]);

    // Setting StateId when user selects a state
    useEffect(() => {
        if (!isEmpty(City)) {
            const state = states.find(state => state?.name === City);
            setStateId(state?.id);
        }
    }, [City, states]);


    useEffect(() => {
        setErrors(errors);
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    const handleSetPhoto = (e) => {
        setPhoto(e.target.files[0]);
        const reader = new FileReader();

        reader.onload = (() => {
            const image = reader.result; //Array Buffer
            console.log(image)
            setPhotoFile(image);
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

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const data = {
            ...Profile,
            FirstName,
            LastName,
            CountryCode,
            PhoneNo,
            Address,
            CountryId,
            StateId,
            PostalCode,
            Img: PhotoFile,
            Document: {
                IdNumber,
                DocumentType,
                Img: IdFrontPhoto
            }
        };

        const { ConfirmPassword, ...rest } = data;

        const { errors, isValid } = validateCreateProfile({ ...rest });

        if (!isValid) {
            console.log(errors);
            console.log({...rest});
            return setErrors({ ...errors, msg: 'Invalid sign up data' });
        }

        // spinner.current.toggle();
        setLoading(false);
        setLoadingText('One Moment . . .');
        props.createCustomer({ ...rest });
    };

    return (
        <>
            <Helmet><title>Create Profile | FXBlooms.com</title></Helmet>
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
            <section>
                <Grid container direction="row">
                    <Grid item xs={12} md={12} lg={5} className={classes.aside}>
                        <div>
                            <RouterLink to="/">
                                <img src={logo} className={classes.logo} alt="FX Blooms logo" />
                            </RouterLink>
                            <Typography variant="subtitle2" component="span">Hello [name]!</Typography>
                            <Typography variant="subtitle2" component="span">Thanks for joining FXBlooms!</Typography>
                            <Typography variant="subtitle2" component="span">Our aim is to make P2P foreign currency exchange much less stressful, safer and faster.</Typography>
                            <Typography variant="subtitle2" component="span">We are committed to keeping this platform safe, secoure and trustworthy.</Typography>
                            <Typography variant="subtitle2" component="span">Kindly tell us about yourself.</Typography>
                            <div>
                                <Typography variant="subtitle2" component="span">Please not that all information provided on this page must be true and accurate.</Typography>
                                <Typography variant="subtitle2" component="span">If any misinformation is spotted, you will not be allowed to use the platform.</Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={12} lg={5} className={classes.formContainer}>
                        <div className={classes.header}>
                            <Typography variant="h4">Create account</Typography>
                            <Typography variant="subtitle2" component="span">Complete the form below to create an acount.</Typography>
                            <br /><br /><br />
                            <Typography variant="subtitle2" component="span" color="primary">2 of 2 (Personal details).</Typography>
                            <br />
                        </div>
                        <form onSubmit={handleFormSubmit} noValidate>
                            <Grid container direction="row" spacing={3}>
                                <Grid item xs={12} md={6} lg={6} xl={6}>
                                    <Tooltip title="This should be your official government name" placement="top" arrow>
                                        <TextField 
                                            className={classes.input}
                                            value={FirstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            type="text"
                                            variant="outlined" 
                                            placeholder="Enter First Name"
                                            label="First Name" 
                                            helperText={errors.FirstName}
                                            fullWidth
                                            required
                                            error={errors.FirstName ? true : false}
                                        />
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={12} md={6} lg={6} xl={6}>
                                    <Tooltip title="This should be your official government name" placement="top" arrow>
                                        <TextField 
                                            className={classes.input}
                                            value={LastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            type="text"
                                            variant="outlined" 
                                            placeholder="Enter Last Name"
                                            label="Last Name" 
                                            helperText={errors.LastName}
                                            fullWidth
                                            required
                                            error={errors.LastName ? true : false}
                                        />
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={12} md={3} lg={3} xl={3}>
                                    <FormControl 
                                        variant="outlined" 
                                        error={errors.CountryCode ? true : false } 
                                        fullWidth 
                                        required
                                    >
                                        <InputLabel 
                                            id="CountryCode" 
                                            variant="outlined" 
                                            error={errors.CountryCode ? true : false}
                                        >
                                            Country Code
                                        </InputLabel>
                                        <Select
                                            labelId="CountryCode"
                                            className={classes.input}
                                            value={CountryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                        
                                        >
                                            <MenuItem value="">Country Code</MenuItem>
                                            {countryCodes.map((country, index) => (
                                                <MenuItem key={index} value={country.dialCode}>
                                                    {/* <span role="img" aria-label={country.name}>{country.emoji}</span> */}
                                                    {/* {String.fromCodePoint('0x' + country?.unicode.split(' '[0].substring(2)))}{String.fromCodePoint('0x' + country?.unicode.split(' '[1].substring(2)))} */}
                                                    {country.dialCode}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.CountryCode}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                {
                                    CountryCode && 
                                    <Grid item xs={12} md={9} lg={9} xl={9}>
                                        <TextField 
                                            className={classes.input}
                                            value={PhoneNo}
                                            onChange={(e) => setPhone(e.target.value)}
                                            type="text"
                                            variant="outlined" 
                                            placeholder="Enter Phone Number"
                                            label="Phone Number" 
                                            helperText={errors.PhoneNo}
                                            fullWidth
                                            required
                                            error={errors.PhoneNo ? true : false}
                                        />
                                    </Grid>
                                }
                                <Grid item xs={12} md={12} lg={12} xl={12}>
                                    <TextField 
                                        className={classes.input}
                                        value={Address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter your Address"
                                        label="Address" 
                                        helperText={errors.Address}
                                        multiline
                                        rows={2}
                                        fullWidth
                                        required
                                        error={errors.Address ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4} lg={4} xl={4}>
                                    <FormControl 
                                        variant="outlined" 
                                        error={errors.Country ? true : false } 
                                        fullWidth 
                                        required
                                    >
                                        <InputLabel 
                                            id="Country" 
                                            variant="outlined" 
                                            error={errors.Country ? true : false}
                                        >
                                            Country
                                        </InputLabel>
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
                                <Grid item xs={12} md={4} lg={4} xl={4}>
                                    <FormControl 
                                        variant="outlined" 
                                        error={errors.City ? true : false } 
                                        fullWidth 
                                        required
                                    >
                                        <InputLabel 
                                            id="City" 
                                            variant="outlined" 
                                            error={errors.City ? true : false}
                                        >
                                            City/State
                                        </InputLabel>
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
                                <Grid item xs={12} md={4} lg={4} xl={4}>
                                    <TextField 
                                        className={classes.input}
                                        value={PostalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter post code"
                                        label="Post Code" 
                                        helperText={errors.PostalCode}
                                        fullWidth
                                        required
                                        error={errors.PostalCode ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="subtitle1" component="span" style={{ color: COLORS.primary, fontWeight: 300 }}>
                                        Identity
                                    </Typography>
                                </Grid>
                                <Grid item xs={10} style={{ alignSelf: 'center' }}>
                                    <hr />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField 
                                        className={classes.input}
                                        onChange={handleSetPhoto}
                                        type="file"
                                        variant="outlined" 
                                        accept="image/*"
                                        helperText={errors.Photo || 'Upload a clear Photo of your face'}
                                        fullWidth
                                        required
                                        error={errors.Photo ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl 
                                        variant="outlined" 
                                        error={errors.DocumentType ? true : false}
                                        fullWidth 
                                        required
                                    >
                                        <InputLabel 
                                            id="idCardType" 
                                            variant="outlined" 
                                            error={errors.DocumentType ? true : false}
                                        >
                                            Identity Card Type
                                        </InputLabel>
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
                                <Grid item xs={12} md={6}>
                                    <TextField 
                                        className={classes.input}
                                        value={IdNumber}
                                        onChange={(e) => setIdNumber(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Document Number"
                                        label="Document Number" 
                                        helperText={errors.IdNumber}
                                        fullWidth
                                        required
                                        error={errors.IdNumber ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField 
                                        className={classes.input}
                                        onChange={handleSetIdFront}
                                        type="file"
                                        variant="outlined" 
                                        helperText={errors.IdFront || 'ID Card Front'}
                                        fullWidth
                                        required
                                        error={errors.IdFront ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField 
                                        className={classes.input}
                                        onChange={handleSetIdBack}
                                        type="file"
                                        variant="outlined" 
                                        helperText={errors.idBack || 'ID Card Back'}
                                        fullWidth
                                        error={errors.idBack ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} xl={12}>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        type="submit"
                                        fullWidth
                                    >
                                        Create Account
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
CreateAccount.propTypes = {
    createCustomer: PropTypes.func.isRequired,
    getCountries: PropTypes.func.isRequired,
    getDocuments: PropTypes.func.isRequired
};

export default connect(undefined, { createCustomer, getCountries, getDocuments })(CreateAccount);