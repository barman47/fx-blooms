import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink, useLocation } from 'react-router-dom';
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

import isEmpty from '../../utils/isEmpty';
import { LOGIN } from '../../routes';
import { COLORS } from '../../utils/constants';
import validateSignUp from '../../utils/validation/customer/createProfile';

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

const CreateAccount = (e) => {
    const classes = useStyles();

    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [PhoneNo, setPhone] = useState('');
    const [Address, setAddress] = useState('');
    const [Country, setCountry] = useState('');
    const [City, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [photo, setPhoto] = useState('');
    const [idType, setIdType] = useState('');
    // eslint-disable-next-line
    const [idFront, setIdFront] = useState('');
    const [idBack, setIdBack] = useState('');
    // eslint-disable-next-line
    const [Profile, setProfile] = useState({});
    const [errors, setErrors] = useState({});

    const countries = emojiFlags.data;

    const location = useLocation();

    const toast = useRef();
    const spinner = useRef();

    // useEffect(() => {
    //     console.log(emojiFlags.data);
    // }, []);

    useEffect(() => {
        if (location.state) {
            setProfile({ ...location.state });
        }
    }, [location.state]);

    useEffect(() => {
        setErrors(errors);
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const data = {
            
        };

        const { errors, isValid } = validateSignUp(data);

        if (!isValid) {
            return setErrors({ ...errors, msg: 'Invalid sign up data' });
        }

        setErrors({});
        // spinner.current.handleToggle();
        alert('Sign up successful!');
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
            <Spinner ref={spinner} text="Please wait . . ." />
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
                                        error={errors.countryCode ? true : false } 
                                        fullWidth 
                                        required
                                    >
                                        <InputLabel 
                                            id="countryCode" 
                                            variant="outlined" 
                                            error={errors.countryCode ? true : false}
                                        >
                                            Country Code
                                        </InputLabel>
                                        <Select
                                            labelId="countryCode"
                                            className={classes.input}
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                        
                                        >
                                            <MenuItem value="">Country Code</MenuItem>
                                            {countries.map((Country) => (
                                                <MenuItem key={Country.code} value={Country.dialCode}>
                                                    {/* <span role="img" aria-label={Country.name}>{Country.emoji}</span> */}
                                                    {/* {String.fromCodePoint('0x' + Country?.unicode.split(' '[0].substring(2)))}{String.fromCodePoint('0x' + Country?.unicode.split(' '[1].substring(2)))} */}
                                                    {Country.dialCode}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.countryCode}</FormHelperText>
                                    </FormControl>
                                    {/* <TextField 
                                        className={classes.input}
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Country Code"
                                        label="Country Code" 
                                        helperText={errors.countryCode}
                                        fullWidth
                                        required
                                        error={errors.countryCode ? true : false}
                                    /> */}
                                </Grid>
                                <Grid item xs={12} md={9} lg={9} xl={9}>
                                    <TextField 
                                        className={classes.input}
                                        value={PhoneNo}
                                        onChange={(e) => setPhone(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        // placeholder="Enter Country Code"
                                        // label="Country Code" 
                                        helperText={errors.PhoneNo}
                                        fullWidth
                                        required
                                        error={errors.PhoneNo ? true : false}
                                    />
                                </Grid>
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
                                                <MenuItem key={Country.code} value={Country.name}>{Country.name}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.Country}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4} lg={4} xl={4}>
                                    <TextField 
                                        className={classes.input}
                                        value={City}
                                        onChange={(e) => setCity(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter your Address"
                                        label="City/State" 
                                        helperText={errors.City}
                                        fullWidth
                                        required
                                        error={errors.City ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4} lg={4} xl={4}>
                                    <TextField 
                                        className={classes.input}
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter post code"
                                        label="Post Code" 
                                        helperText={errors.postalCode}
                                        fullWidth
                                        required
                                        error={errors.postalCode ? true : false}
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
                                        value={photo}
                                        onChange={(e) => setPhoto(e.target.value)}
                                        type="file"
                                        variant="outlined" 
                                        // placeholder="Enter post code"
                                        // label="Post Code" 
                                        helperText={errors.photo || 'Upload a clear photo of your face'}
                                        fullWidth
                                        required
                                        error={errors.photo ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField 
                                        className={classes.input}
                                        value={idType}
                                        onChange={(e) => setIdType(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Select ID type"
                                        label="Identity Card Type" 
                                        helperText={errors.idType}
                                        fullWidth
                                        required
                                        error={errors.idType ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField 
                                        className={classes.input}
                                        value={idType}
                                        onChange={(e) => setIdFront(e.target.value)}
                                        type="file"
                                        variant="outlined" 
                                        // placeholder="Select ID Card Front"
                                        // label="ID Card Front" 
                                        helperText={errors.idFront || 'ID Card Front'}
                                        fullWidth
                                        required
                                        error={errors.idFront ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField 
                                        className={classes.input}
                                        value={idBack}
                                        onChange={(e) => setIdBack(e.target.value)}
                                        type="file"
                                        variant="outlined" 
                                        // placeholder="Select ID Back"
                                        // label="ID Card Back" 
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

export default CreateAccount;