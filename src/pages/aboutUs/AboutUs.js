import { Box, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import Layout from '../../components/layout';

import { COLORS, SHADOW, TRANSITION } from '../../utils/constants';

import background from '../../assets/img/patterns-black.jpg';
import createAccount from '../../assets/img/create-account.png';
import makeListing from '../../assets/img/make-listing.png';
import allListings from '../../assets/img/listing.png';
import { CrosshairsGps } from 'mdi-material-ui';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(8.1),

        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(7),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },

    content: {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        [theme.breakpoints.down('md')]: {
            height: '50vh'
        },
        [theme.breakpoints.down('sm')]: {
            height: '70vh'
        }
    },

    goal: {
        borderBottom: `3px solid transparent`,
        color: COLORS.offWhite,
        cursor: 'pointer',
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(10),
        transition: TRANSITION,
        width: '30vw',

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(3),
            width: '75vw'
        },

        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderBottom: `3px solid rgb(30, 98, 98)`
        },

        '& h6': {
            marginBottom: theme.spacing(2)
        },

        '& p': {
            fontWeight: 300,
            textAlign: 'center'
        },
    },

    icon: {
        fontSize: theme.spacing(5),
        marginBottom: theme.spacing(2)
    },

    container: {
        marginTop: '100vh',
        padding: theme.spacing(10),

        [theme.breakpoints.down('md')]: {
            marginTop: '70vh'
        },

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2)
        },

        '& h4': {
            color: COLORS.offBlack,
            marginBottom: theme.spacing(2),
            fontWeight: 700,

            [theme.breakpoints.down('sm')]: {
                fontSize: theme.spacing(2.5)
            }
        },

        '& p': {
            color: COLORS.offBlack,
            fontWeight: 300
        }
    },

    image: {
        borderRadius: theme.shape.borderRadius,
        boxShadow: SHADOW,
        width: '100%'
    }
}));

const AboutUs = () => {
    const classes = useStyles();

    return (
        <Layout title="About Us">
            <Box component="section" className={classes.root}>
                <Box component="div" className={classes.content}>
                    <Box component="header" className={classes.goal}>
                        <CrosshairsGps className={classes.icon} />
                        <Typography variant="h6">Our Goal</Typography>
                        <Typography variant="body2" component="p">To empower and give you the freedom to exchange your money at your own rate</Typography>
                    </Box>
                </Box>
                <Grid container direction="row" spacing={5} className={classes.container}>
                    <Grid item xs={12} lg={6}>
                        <Typography variant="h4">Security First</Typography>
                        <Typography variant="body2" componet="p">Currency exchange via unverifiable sources can lead to bank account closure or trouble with the Authorities. We have industry-standard Know Your Customer (KYC) in place; all users on FXBLOOMS are duly registered and verified to protect you against fraud.</Typography>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <img src={createAccount} alt="Create Account" className={classes.image} />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <img src={makeListing} alt="Create Account" className={classes.image} />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Typography variant="h4">Democratizing Money Exchange</Typography>
                        <Typography variant="body2" componet="p">We created a marketplace void of middlemen and expensive bank charges. We believe that an accessible market creates competition. Many potential buyers and sellers are awaiting you on the marketplace.</Typography>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Typography variant="h4">Disruptive Solution</Typography>
                        <Typography variant="body2" componet="p">Traditional money remittances are done at fixed and unfavorable rates. We offer you the freedom to exchange money at your desired exchange rate from the comfort of your home. Ultimately, giving you control over your money exchange - after all, it's your money.</Typography>
                        <Typography variant="body2" componet="p">Your money, Your terms.</Typography>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <img src={allListings} alt="Create Account" className={classes.image} />
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
};

export default AboutUs;