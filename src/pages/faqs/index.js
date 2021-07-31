import { useState } from 'react';
import { 
    Grid, 
    IconButton,
    InputAdornment,
    TextField, 
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Magnify } from 'mdi-material-ui';

import Layout from '../../components/layout';
import Contact from '../../pages/home/Contact';

import { COLORS } from '../../utils/constants';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(8.1),
        padding: [[theme.spacing(2), theme.spacing(10), 0, theme.spacing(10)]],

        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(7),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        },

        '& h4': {
            fontWeight: 500,

            [theme.breakpoints.down('md')]: {
                marginBottom: theme.spacing(5)
            },

            [theme.breakpoints.down('sm')]: {
                fontSize: theme.spacing(2.5)
            }
        },

        '& h6': {
            fontWeight: 600,

            [theme.breakpoints.down('sm')]: {
                fontSize: theme.spacing(2)
            }
        },

        '& p': {
            color: COLORS.offBlack,
            fontSize: theme.spacing(1.8),
            fontWeight: 400,
            lineHeight: 1.5,
            marginTop: theme.spacing(3),
            textAlign: 'justify'
        }
    },

    formContainer: {
        marginBottom: theme.spacing(10)
    },

    question: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        marginBottom: theme.spacing(2),
        padding: theme.spacing(4)
    },

    searchIcon: {
        color: theme.palette.primary.main
    }
}));

const Index = () => {
    const classes = useStyles();

    const [searchText, setSearchText] = useState('');
    // eslint-disable-next-line
    const [errors, setErrors] = useState({});

    const onSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <Layout
            title="Frequently Asked Questions"
            description="In effort to ensure a seamless experience on our FXBLOOMS platform. Here are few of the frequently asked questions (FAQs)."
        >
            <section className={classes.root}>
                <Grid container direction="row">
                    <Grid item xs={12} lg={6}>
                        <Typography variant="h4">Frequently Asked Questions</Typography>
                    </Grid>
                    <Grid item xs={12} lg={6} className={classes.formContainer}>
                        <form onSubmit={onSubmit} noValidate>
                            <TextField 
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                type="search"
                                variant="outlined" 
                                placeholder="Search"
                                helperText={errors.searchText}
                                fullWidth
                                required
                                error={errors.searchText  ? true : false}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="search-faqs"
                                                onClick={onSubmit}
                                            >
                                                <Magnify className={classes.searchIcon} />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </form>
                    </Grid>
                </Grid>
                <Grid container direction="row" spacing={5}>
                    <Grid item xs={12} lg={6}>
                        <Grid container direction="column">
                            <Grid item xs={12} className={classes.question}>
                                <Typography variant="h6">How do I register for an account?</Typography>
                                <Typography variant="subtitle2" component="p">Register to FXBLOOMS by using the sign up page, once the required information and documents are provided, we will verify them and get back to you and hurray… welcome to FXBLOOMS family.</Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.question}>
                                <Typography variant="h6">Does the other user get to know me?</Typography>
                                <Typography variant="subtitle2" component="p">Other users will not see any of your private information. Be rest assured your data is safe with us.</Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.question}>
                                <Typography variant="h6">How do I log a complaint?</Typography>
                                <Typography variant="subtitle2" component="p">In case you are not satisfied with our service, please raise a support ticket by sending an email to <a className={classes.link} href="mailto:support@fxblooms.com">support@fxblooms.com</a>, and we will get back to you.</Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.question}>
                                <Typography variant="h6">What comes with the transaction name?</Typography>
                                <Typography variant="subtitle2" component="p">We make use of usernames to protect privacy but allow tracking of users.</Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.question}>
                                <Typography variant="h6">How does the pricing work per transaction?</Typography>
                                <Typography variant="subtitle2" component="p">FXBLOOMS is a 100% free platform. Any future change in pricing will be communicated out beforehand. </Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.question}>
                                <Typography variant="h6">What are the documents needed for identity verification?</Typography>
                                <Typography variant="subtitle2" component="p">We accept international passports, drivers licénse and national ID for users on boarding. To buy, any of the ID submitted during on sign up would suffice. However, to sell on the platform, we may request more ID and information.</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Grid container direction="column">
                            <Grid item className={classes.question}>
                                <Typography variant="h6">How does it work?</Typography>
                                <Typography variant="subtitle2" component="p">Sign up, get verified and welcome to the FXBLOOMS family.</Typography>
                                <Typography variant="subtitle2" component="p">As a verified user, you are able to buy and sell currencies.</Typography>
                                <Typography variant="subtitle2" component="p">To sell, you need to make a listing and *ask* for a rate. The amount and *ask* rate get posted on the dashboard, where a buyer can see and contact you.</Typography>
                                <Typography variant="subtitle2" component="p">To buy, you only need to *accept* a seller posting.</Typography>
                                <Typography variant="subtitle2" component="p">The communication happens in our Chatbox, where you can exchange account details and other information.</Typography>
                                <Typography variant="subtitle2" component="p">Please note: We strongly advise a buyer to send their money first, and a seller should only send his after he or she has confirmed payment in his or her  account.</Typography>
                            </Grid>
                            <Grid item className={classes.question}>
                                <Typography variant="h6">How long does it take to purchase currency?</Typography>
                                <Typography variant="subtitle2" component="p">As long as you have a buyer willing to accept your *ask* rate or your desired rate and amount align with a seller’s listing, then the speed of the transaction depends on you and the other party. But in most cases 10 to 15 minutes.</Typography>
                            </Grid>
                            <Grid item className={classes.question}>
                                <Typography variant="h6">Which currency can be traded?</Typography>
                                <Typography variant="subtitle2" component="p">FXBLOOMS support EURO and Naira exchange. More currency pairs will be added in the future.</Typography>
                            </Grid>
                            <Grid item className={classes.question}>
                                <Typography variant="h6">How to disable an account?</Typography>
                                <Typography variant="subtitle2" component="p">By simply contacting us on support@fxblooms.com. YOu can also reactivate it when you change your mind.</Typography>
                            </Grid>
                            <Grid item className={classes.question}>
                                <Typography variant="h6">Is there instant transfer?</Typography>
                                <Typography variant="subtitle2" component="p">Yes, we recommend sellers to use the instant transfer option when possible.</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Contact />
            </section>
        </Layout>
    );
};

export default Index