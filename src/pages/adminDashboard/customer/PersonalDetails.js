import { useEffect, useState } from 'react'; 
import { useSelector } from 'react-redux'; 
import { 
    Box, 
    Divider,
    Grid,
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
    const [stateId, setStateId] = useState('');
    const [states, setStates] = useState([]);
    const [PostalCode, setPostalCode] = useState('');
    const [Listings, setListings] = useState(0);
    const [Transactions, setTransactions] = useState(0);

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

    const onSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <Grid className={classes.root} container direction="column">
            <Grid item>
                <Box className={classes.header}>
                    <Typography variant="subtitle2">Personal Details</Typography>
                </Box>
            </Grid>
            <Divider />
            <br />
            <Grid item>
                <form onSubmit={onSubmit} noValidate>
                    <Grid container direction="row" spacing={3}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>First Name</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{FirstName}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Last Name</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{LastName}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Email Address</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{Email}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Username</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{Username}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Phone Number</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{PhoneNo}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Address</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{Address}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Country</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{country}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>City/State</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{city}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Postal Code</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{PostalCode}</Typography>
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