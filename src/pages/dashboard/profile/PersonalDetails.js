import { useEffect, useState } from 'react'; 
import { useSelector } from 'react-redux'; 
import { 
    Box, 
    Button, 
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    MenuItem,
    Select,
    TextField, 
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import isEmpty from '../../../utils/isEmpty'; 
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

const PersonalDetails = () => {
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
    // eslint-disable-next-line
    const [stateId, setStateId] = useState('');
    const [states, setStates] = useState([]);
    const [PostalCode, setPostalCode] = useState('');
    // eslint-disable-next-line
    const [Listings, setListings] = useState(0);
    // eslint-disable-next-line
    const [Transactions, setTransactions] = useState(0);
    
    // eslint-disable-next-line
    const [errors, setErrors] = useState({});
    const [editable, setEditable] = useState(false);

    useEffect(() => {
        if (profile) {
            const { firstName, lastName, email, username, phoneNo, countryId, stateId, postalCode } = profile;
            setFirstName(firstName);
            setLastName(lastName);
            setEmail(email);
            setUsername(username);
            setPhoneNo(phoneNo);
            setCountryId(countryId);
            setStateId(stateId);
            setPostalCode(postalCode);
        }
    }, [profile]);

    // Setting states when a country is selected
    useEffect(() => {
        if (!isEmpty(country)) {
            const country = countries.find(country => country.name === country);
            const CountryId = country?.id;
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
    }, [country, countries]);

    useEffect(() => {
        if (countryId) {
            const country = countries.find(country => country.id === countryId);
            setCountry(country?.name);
        }
    }, [countries, countryId]);
    // useEffect(() => {}, [stateId]);

    const onSubmit = (e) => {
        e.preventDefault();
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
                                disabled={editable ? false : true}
                                error={errors.FirstName ? true : false}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Last Name</Typography>
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
                                disabled={editable ? false : true}
                                error={errors.LastName ? true : false}
                            />
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
                            <TextField 
                                className={classes.info}
                                value={Username}
                                type="text"
                                variant="outlined" 
                                helperText={errors.Username}
                                fullWidth
                                required
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Phone Number</Typography>
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
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Address</Typography>
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
                                disabled={editable ? false : true}
                                error={errors.Address ? true : false}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Country</Typography>
                                <FormControl 
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
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>City/State</Typography>
                            <FormControl 
                                    variant="outlined" 
                                    error={errors.city ? true : false}
                                    disabled={editable ? false : true}
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
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Postal Code</Typography>
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
                                disabled={editable ? false : true}
                                error={errors.PostalCode ? true : false}
                            />
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

export default PersonalDetails;