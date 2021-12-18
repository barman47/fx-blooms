import { useEffect, useState } from 'react'; 
import { useSelector } from 'react-redux'; 
import { 
    Button,
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
// import PropTypes from 'prop-types';

import isEmpty from '../../../utils/isEmpty'; 
import { COLORS } from '../../../utils/constants'; 
import countryToFlag from '../../../utils/countryToFlag'; 
import { countries } from '../../../utils/countries'; 

const useStyles = makeStyles(theme =>({
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(2),

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
    root: {
        // backgroundColor: COLORS.lightTeal,
        // borderRadius: theme.shape.borderRadius,
        // padding: [[theme.spacing(2), theme.spacing(3)]],

        // [theme.breakpoints.down('md')]: {
        //     paddingBottom: theme.spacing(4)
        // }
    },

    container: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        // padding: [[theme.spacing(2), theme.spacing(3)]],

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

    unverified: {
        borderRadius: '70px',
        color: theme.palette.primary.main,
        backgroundColor: 'rgba(196, 196, 196, 1)',
        padding: theme.spacing(1, 3)
    }
}));

const PersonalDetails = () => {
    const classes = useStyles();
    const { profile } = useSelector(state => state.customer); 

    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [Email, setEmail] = useState('');
    const [Username, setUsername] = useState('');
    const [PhoneNo, setPhoneNo] = useState('');
    const [Address, setAddress] = useState('');
    // eslint-disable-next-line
    const [CountryCode, setCountryCode] = useState('');
    const [country, setCountry] = useState('');
    const [countryId, setCountryId] = useState('');
    // eslint-disable-next-line
    const [city, setCity] = useState('');
    const [stateId, setStateId] = useState('');
    // eslint-disable-next-line
    const [states, setStates] = useState([]);
    const [PostalCode, setPostalCode] = useState('');
    // eslint-disable-next-line
    const [Listings, setListings] = useState(0);
    // eslint-disable-next-line
    const [Transactions, setTransactions] = useState(0);
    
    // eslint-disable-next-line
    const [errors, setErrors] = useState({});
    // eslint-disable-next-line
    const [editable, setEditable] = useState(false);

    useEffect(() => {
        if (profile) {
            const { address, firstName, lastName, email, userName, phoneNo, countryId, stateId, postalCode, numberOfListings, numberOfSuccessfulTransactions } = profile;
            setFirstName(firstName);
            setLastName(lastName);
            setEmail(email);
            setUsername(userName);
            setPhoneNo(phoneNo);
            setAddress(address);
            setCountryId(countryId);
            setStateId(stateId);
            setPostalCode(postalCode);
            setListings(numberOfListings);
            setTransactions(numberOfSuccessfulTransactions);
        }
    }, [profile]);

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

    useEffect(() => {
        if (countryId && stateId) {
            const country = countries.find(country => country.id.toLowerCase() === countryId.toLowerCase());
            const state = country?.states.find(state => state.id.toLowerCase() === stateId.toLowerCase());
            setCity(state?.name);
            setCountry(country?.name);
        }
    }, [countryId, stateId]);
    
    const onSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <div className={classes.header}>
                <div>
                    <Typography variant="h4" color="primary">Account Setup (Profile)</Typography>
                    <Typography variant="body1" component="p">Kindly provide your profile details</Typography>
                    <hr className={classes.hr} />
                </div>
                {!isEmpty(profile) && 
                    <Button variant="outlined" color="primary" onClick={() => setEditable(true)}>Edit Details</Button>
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
                                <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{Username}</Typography>
                            </Grid>
                            {editable &&
                                <Grid item xs={2}>
                                    <Typography variant="subtitle2" component="span" className={classes.label}>Country Code</Typography>
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
                                    <FormHelperText id="my-helper-text">e.g. +234</FormHelperText>
                                    {errors.CountryCode && <FormHelperText error>{errors.CountryCode}</FormHelperText>}
                                </Grid>
                            }
                            <Grid item xs={10}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>Phone Number</Typography>
                                {profile.phoneNo && !editable ?
                                    <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{profile.phoneNo}</Typography>
                                    :
                                    <TextField 
                                        className={classes.info}
                                        value={PhoneNo}
                                        onChange={(e) => setPhoneNo(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Phone Number"
                                        helperText={errors.PhoneNo}
                                        fullWidth
                                        required
                                        error={errors.PhoneNo ? true : false}
                                    />
                                }
                                {/* {showNumber ?
                                    <Button color="primary" onClick={handleHidePhoneNumber}>Hide</Button>
                                    :
                                    <Button color="primary" onClick={handleShowPhoneNumber}>Show</Button>
                                } */}
                            </Grid>
                            {/* <Grid item xs={3}>
                                <br /><br />
                                <Typography variant="subtitle2" component="span" className={classes.unverified}>Unverified</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <br /><br />
                                <Button variant="text" color="primary" startIcon={<AlertOctagram />}>Verify Now</Button>
                            </Grid> */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>Address</Typography>
                                {profile.address && !editable ?
                                    <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{profile.address}</Typography>
                                    :
                                    <TextField 
                                        className={classes.info}
                                        value={Address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Enter Address"
                                        helperText={errors.Address}
                                        fullWidth
                                        multiline
                                        rows={1}
                                        required
                                        error={errors.Address ? true : false}
                                    />
                                }
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>Country</Typography>
                                    {profile.countryId ? 
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
                                                value={profile.countryId || country}
                                                onChange={(e) => setCountry(e.target.value)}
                                            
                                            >
                                                <MenuItem value="">Select Country</MenuItem>
                                                {countries.map((country, index) => (
                                                    <MenuItem key={index} value={country.name}>{country.name}</MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>{errors.country}</FormHelperText>
                                        </FormControl>
                                    }
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span" className={classes.label}>Postal Code</Typography>
                                {profile.postalCode ? 
                                    <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{profile.postalCode}</Typography>
                                    :
                                    <TextField 
                                        className={classes.info}
                                        value={PostalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Postal Code"
                                        helperText={errors.PostalCode}
                                        fullWidth
                                        required
                                        disabled
                                        error={errors.PostalCode ? true : false}
                                    />
                                }
                            </Grid>
                            {editable && 
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary" fullWidth>Save and Continue</Button>
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

export default PersonalDetails;