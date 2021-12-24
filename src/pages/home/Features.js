import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import listing from '../../assets/img/listing.png';

import { COLORS } from '../../utils/constants';
import { SIGN_UP } from '../../routes';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.lightTeal,
        padding: theme.spacing(10, 5),
        width: 'initial',

        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        },

        '& h6': {
            [theme.breakpoints.down('sm')]: {
                textAlign: 'center'
            },  
        }
    },

    link: {
        fontWeight: 600
    },

    imageContainer: {
        // border: '1px solid red',
        position: 'relative',
        // right: theme.spacing(-5),

        [theme.breakpoints.down('md')]: {
            display: 'none'
        },
        [theme.breakpoints.down('sm')]: {
            right: 0
        },

        '& img': {
            borderRadius: '10px',
            boxShadow: '0px 4px 24px rgba(30, 98, 98, 0.24)',
            width: '100%'
        }
    },

    button: {
        color: COLORS.offWhite,
        backgroundColor: theme.palette.primary.main,
        
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: COLORS.offWhite,
        },

        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    }
}));

const Features = () => {
    const classes = useStyles();

    const { isAuthenticated } = useSelector(state => state.customer);

    return (
        <Grid container direction="row" spacing={5} className={classes.root}>
            <Grid item xs={12} lg={6}>
                <Grid container direction ="column" spacing={5}>
                    <Grid item xs={12}>
                        <Typography variant="h6"  color="primary">Safe and Secure</Typography>
                        <Typography variant="subtitle1" component="p">- Two-factor authentication (2FA) to protect your account from unauthorized access.</Typography>
                        <Typography variant="subtitle1" component="p">- Anti-fraud verification system to protect all users.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6"  color="primary">Accessible Market</Typography>
                        <Typography variant="subtitle1" component="p">- Get the best rates from our competitive marketplace.</Typography>
                        <Typography variant="subtitle1" component="p">- Sending money home? Funding your blocked bank account? We've got you covered!</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6"  color="primary">Convenient</Typography>
                        <Typography variant="subtitle1" component="p">- Hassle-free money exchange.</Typography>
                        <Typography variant="subtitle1" component="p">- Just list, buyers await you.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {!isAuthenticated && <Button to={SIGN_UP} underline="none" component={Link} variant="contained" className={classes.button}>GET STARTED</Button>}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} lg={6} className={classes.imageContainer}>
                <img src={listing} alt="Listings" />
            </Grid>
        </Grid>
    );
};

export default Features;