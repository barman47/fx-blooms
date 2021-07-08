import { useEffect, useState } from 'react'; 
import { connect, useSelector } from 'react-redux'; 
import PropTypes from 'prop-types';
import { 
    Box, 
    Divider,
    Grid,
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { getCountries } from '../../../actions/countries'; 
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

const PersonalDetails = (props) => {
    const classes = useStyles();
    const { countries } = useSelector(state => state);
    const { customer } = useSelector(state => state.customers);

    const [country, setCountry] = useState('');
    const [countryId, setCountryId] = useState('');
    const [city, setCity] = useState('');
    const [stateId, setStateId] = useState('');
    const [states, setStates] = useState([]);

    const { getCountries } = props;

    useEffect(() => {
        if (countries.length === 0) {
            getCountries();
        }
    }, [countries, getCountries]);

    useEffect(() => {
        if (customer) {
            const { countryId, stateId } = customer;
            setCountryId(countryId);
            setStateId(stateId);
        }
    }, [customer]);

    useEffect(() => {
        if (countryId) {
            const country = countries.find(country => country.id === countryId);
            setStates(country?.states);
            setCountry(country?.name);
        }
    }, [countryId, countries]);

    useEffect(() => {
        if (states?.length > 0 && stateId) {
            const city = states.find(state => state.id === stateId);
            setCity(city.name)
        }
    }, [stateId, states]);

    // useEffect(() => {
    //     if (states?.length > 0) {
    //         const state = states.find(state => state.id === stateId);
    //         setCity(state.name);
    //     }
    // }, [states, stateId]);

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
                            <Typography variant="subtitle2" className={classes.info}>{customer?.firstName}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Last Name</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{customer?.lastName}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Email Address</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{customer?.email}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Username</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{customer?.username}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Phone Number</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{customer?.phoneNo}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Address</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{customer?.address}</Typography>
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
                            <Typography variant="subtitle2" className={classes.info}>{customer?.postalCode}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Listings</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{customer?.listings?.length}</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Successful Transactions</Typography>
                            <Typography variant="subtitle2" className={classes.info}>[NA]</Typography>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    );
};

PersonalDetails.propTypes = {
    getCountries: PropTypes.func.isRequired
};

export default connect(undefined, { getCountries })(PersonalDetails);