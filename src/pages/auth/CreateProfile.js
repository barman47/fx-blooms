import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Button, 
    FormHelperText, 
    Grid, 
    TextField, 
    Tooltip, 
    Typography,
    Zoom 
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { Information } from 'mdi-material-ui';

import Spinner from '../../components/common/Spinner';
import Toast from '../../components/common/Toast';

import { getDocuments } from '../../actions/documents';
import { createCustomer } from '../../actions/customer';
import { SET_CURRENT_CUSTOMER } from '../../actions/types';

import { COLORS } from '../../utils/constants';
import { countries } from '../../utils/countries';
import isEmpty from '../../utils/isEmpty';
import { HOME } from '../../routes';
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
    }
}));

const CreateProfile = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const history = useHistory();
    const location = useLocation();

    const { email, isAuthenticated } = useSelector(state => state.customer);
    const { authorized } = useSelector(state => state.twoFactor);
    const { documents } = useSelector(state => state);
    const errorsState = useSelector(state => state.errors);
    
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    
    const [CountryCode, setCountryCode] = useState('');
    const [PhoneNo, setPhoneNo] = useState('');
    const [Address, setAddress] = useState('');
    
    const [Country, setCountry] = useState('');

    const [PostalCode, setPostalCode] = useState('');
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [verifiedEmail, setVerifiedEmail] = useState(false);

    const toast = useRef();

    useEffect(() => {
        if (location?.state?.verifiedEmail && email) {
            setVerifiedEmail(true);
        } else {
            console.log('redirecting');
            // return window.location.href = HOME;
        }
        if (isAuthenticated && authorized) {
            console.log('redirecting');
            return window.location.href = HOME;
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
        if (errorsState?.msg) {
            setErrors({ ...errors, msg: errorsState.msg });
            setLoading(false);
            setLoadingText('');
        }
    }, [errorsState, errors]);

    useEffect(() => {
        setErrors(errors);
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    const handleSetPhoneNumber = (e) => {
        if (!isNaN(Number(e.target.value))) {
            setPhoneNo(e.target.value);
        }
    };

    const countryToFlag = (countryCode) => {
        const codePoints = countryCode
          .toUpperCase()
          .split('')
          .map(char =>  127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
      }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const data = {
            FirstName,
            LastName,
            Country,
            CountryCode,
            PhoneNo,
            Address,
            PostalCode
        };

        const { errors, isValid } = validateCreateProfile(data);

        if (!isValid) {
            return setErrors({ ...errors, msg: 'Invalid sign up data' });
        }
    
        setLoading(true);
        setLoadingText('One Moment . . .');
        props.createCustomer({
            Email: email,
            FirstName,
            LastName,
            PhoneNumber: `+${data.CountryCode}${data.PhoneNo}`,
            CountryId: Country,
            Address,
            PostalCode
        }, history);
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
            <section className={classes.root}>
                <Grid container direction="row">
                    <Grid item xs={12} md={12} lg={5} className={classes.aside}>
                        <div>
                            <a href="https://wp.fxblooms.com">
                                <img src={logo} className={classes.logo} alt="FX Blooms logo" />
                            </a>
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
                            <br />
                        </div>
                        <form onSubmit={handleFormSubmit} noValidate>
                            <Grid container direction="row" spacing={2}>
                                {verifiedEmail && email && 
                                    <Grid item xs={10}>
                                        <Alert severity="success">Email successfuly verified</Alert>
                                    </Grid>
                                }
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
                                    <Autocomplete
                                        id="country-select"
                                        options={countries}
                                        autoHighlight
                                        disableClearable
                                        getOptionLabel={(option) => {
                                            setCountryCode(option.phone);
                                            return option.phone;
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
                                    <FormHelperText id="my-helper-text">Country code. e.g. +234</FormHelperText>
                                    {errors.CountryCode && <FormHelperText error>{errors.CountryCode}</FormHelperText>}
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <br />
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
                            
                                <Grid item xs={12} md={5}>
                                    <Typography variant="subtitle2" component="span">Country</Typography>
                                    <Autocomplete
                                        id="country-select"
                                        options={countries}
                                        autoHighlight
                                        disableClearable
                                        getOptionLabel={(option) => {
                                            setCountry(option.label);
                                            return option.label;
                                        }}
                                        renderOption={(option) => (
                                            <>
                                                <span>{option.label}</span>
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
                                                // onChange={(e) => setCountry(e.target.value)}
                                            />
                                        )}
                                    />
                                    {errors.Country && <FormHelperText error>{errors.Country}</FormHelperText>}
                                    {/* <FormControl 
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
                                    </FormControl> */}
                                </Grid>
                                <Grid item xs={12} md={5}>
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
    getDocuments: PropTypes.func.isRequired
};

export default connect(undefined, { createCustomer, getDocuments })(CreateProfile);