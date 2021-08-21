import { useSelector } from 'react-redux'; 
import { 
    Box, 
    Divider,
    Grid,
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
    const { customer } = useSelector(state => state.customers);

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
                            <Typography variant="subtitle2" className={classes.info}>{customer?.userName}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Phone Number</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{customer?.phoneNo}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Address</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{customer?.address}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Country</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{customer?.countryId}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Postal Code</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{customer?.postalCode}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Listings</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{customer?.numberOfListings}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" component="span" className={classes.label}>Successful Transactions</Typography>
                            <Typography variant="subtitle2" className={classes.info}>{customer?.numberOfSuccessfulTransactions}</Typography>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    );
};

export default PersonalDetails;