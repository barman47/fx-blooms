import { useEffect, useState } from 'react'; 
import { connect, useSelector } from 'react-redux'; 
import { 
    Box, 
    Button, 
    Divider,
    Grid,
    TextField, 
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { setHidePhoneNumber, setShowPhoneNumber } from '../../../actions/customer'; 

// import isEmpty from '../../../utils/isEmpty'; 
import { COLORS } from '../../../utils/constants'; 

const useStyles = makeStyles(theme =>({
    root: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        padding: [[theme.spacing(2), theme.spacing(3)]],

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

    button: {
        fontWeight: 500
    },

    label: {
        fontWeight: 300
    },

    info: {
        fontWeight: 600
    }
}));

const PersonalDetails = (props) => {
    const classes = useStyles();
    const { countries } = useSelector(state => state); 
    const { profile } = useSelector(state => state.customer); 

    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [Email, setEmail] = useState('');
    const [Username, setUsername] = useState('');
    const [PhoneNo, setPhoneNo] = useState('');
    const [Address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [countryId, setCountryId] = useState('');
    const [city, setCity] = useState('');
    const [stateId, setStateId] = useState('');
    // eslint-disable-next-line
    const [states, setStates] = useState([]);
    const [PostalCode, setPostalCode] = useState('');
    const [Listings, setListings] = useState(0);
    const [Transactions, setTransactions] = useState(0);

    const [showNumber, setShowNumber] = useState(false);
    
    // eslint-disable-next-line
    const [errors, setErrors] = useState({});
    const [editable, setEditable] = useState(false);

    const { setHidePhoneNumber, setShowPhoneNumber } = props;

    useEffect(() => {
        setShowNumber(profile.showPhoneNumber);
    }, [profile.showPhoneNumber]);

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
            setCity(state.name);
            setCountry(country?.name);
        }
    }, [countries, countryId, stateId]);
    
    const onSubmit = (e) => {
        e.preventDefault();
    };

    const handleShowPhoneNumber = () => {
        setShowPhoneNumber();
    };

    const handleHidePhoneNumber = () => {
        setHidePhoneNumber();
    };

    return (
        <Grid className={classes.root} container direction="column">
            <Grid item>
                <Box className={classes.header}>
                    <Typography variant="subtitle2">Personal Details</Typography>
                    <Button color="primary" classes={{ root: classes.button }} onClick={() => setEditable(true)}>Edit</Button>
                </Box>
            </Grid>
            <Divider />
            <br />
            <Grid item>
                <form onSubmit={onSubmit} noValidate>
                    <Grid container direction="row" spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>First Name</Typography>
                            <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{FirstName}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Last Name</Typography>
                            <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{LastName}</Typography>
                            {/* <TextField 
                                className={classes.info}
                                value={LastName}
                                onChange={(e) => setLastName(e.target.value)}
                                type="text"
                                variant="outlined" 
                                placeholder="Enter Last Name"
                                helperText={errors.LastName}
                                fullWidth
                                required
                                // disabled={editable ? false : true}
                                disabled
                                error={errors.LastName ? true : false}
                            /> */}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Email Address</Typography>
                            <TextField 
                                className={classes.info}
                                value={Email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                variant="outlined" 
                                placeholder="Enter Email"
                                helperText={errors.Email}
                                fullWidth
                                required
                                disabled={editable ? false : true}
                                error={errors.Email ? true : false}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Username</Typography>
                            <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{Username}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Phone Number</Typography>
                            {showNumber ?
                                <Button color="primary" onClick={handleHidePhoneNumber}>Hide</Button>
                                :
                                <Button color="primary" onClick={handleShowPhoneNumber}>Show</Button>
                            }
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
                                disabled={editable ? false : true}
                                error={errors.PhoneNo ? true : false}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Address</Typography>
                            <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{Address}</Typography>
                            {/* <TextField 
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
                                disabled
                                error={errors.Address ? true : false}
                            /> */}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Country</Typography>
                            <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{country}</Typography>
                                {/* <FormControl 
                                    variant="outlined" 
                                    helperText={errors.country}
                                    error={errors.country ? true : false}
                                    disabled={editable ? false : true}
                                    fullWidth 
                                    required
                                >
                                    <Select
                                        labelId="CountryCode"
                                        className={classes.input}
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                    
                                    >
                                        <MenuItem value="">Select Country</MenuItem>
                                        {countries.map((country, index) => (
                                            <MenuItem key={index} value={country.name}>{country.name}</MenuItem>
                                        ))}
                                    </Select>
                                <FormHelperText>{errors.country}</FormHelperText>
                            </FormControl> */}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>City/State</Typography>
                            <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{city}</Typography>
                            {/* <FormControl 
                                    variant="outlined" 
                                    error={errors.city ? true : false}
                                    disabled
                                    fullWidth 
                                    required
                                >
                                    <Select
                                        labelId="CountryCode"
                                        className={classes.input}
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    
                                    >
                                        <MenuItem value="">Select State</MenuItem>
                                        {states.map((state, index) => (
                                            <MenuItem key={index} value={state.name}>{state.name}</MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{errors.city}</FormHelperText>
                            </FormControl> */}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {PostalCode && 
                                <>
                                    <Typography variant="subtitle2" component="span" className={classes.label}>Postal Code</Typography>
                                    <Typography variant="subtitle1" component="p" style={{ fontWeight: 500 }} className={classes.label}>{PostalCode}</Typography>
                                </>
                            }
                            {/* <TextField 
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
                            /> */}
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={editable ? false : true}
                            >
                                Submit
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Listings</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{Listings}</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Successful Transactions</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{Transactions}</Typography>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    );
};

PersonalDetails.propTypes = {
    setHidePhoneNumber: PropTypes.func.isRequired,
    setShowPhoneNumber: PropTypes.func.isRequired
};

export default connect(undefined, { setHidePhoneNumber, setShowPhoneNumber })(PersonalDetails);