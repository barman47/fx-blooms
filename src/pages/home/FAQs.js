import { Link as RouterLink } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Button, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ChevronUp } from 'mdi-material-ui';

import { COLORS } from '../../utils/constants';
import { FAQS, LOGIN, SIGN_UP } from '../../routes';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#f3f3f3',
        color: COLORS.offBlack,
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(5),

        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },

    header: {
        fontWeight: 700,
        marginBottom: theme.spacing(3),
        textAlign: 'center',

        [theme.breakpoints.down('sm')]: {
            fontSize: theme.spacing(3)
        }
    },

    container: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'flex-start',
        gap: theme.spacing(3),
        marginTop: theme.spacing(7),
        padding: theme.spacing(0, 8),

        [theme.breakpoints.down('md')]: {
            gridTemplateColumns: '1fr 1fr',
            padding: theme.spacing(0, 3),
        },

        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr',
            padding: theme.spacing(0, 1),
        }
    },

    accordion: {
        alignSelf: 'flex-start',
        border: 'none',
        boxShadow: 'none',
        padding: theme.spacing(2)
    },

    heading: {
        fontWeight: 600
    },

    summary: {
        '&:hover': {
            color: theme.palette.primary.main
        }
    },

    content: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(1),
        padding: theme.spacing(0, 5)
    },

    details: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(5),
        padding: theme.spacing(0, 5),

        'ul li': {
            color: 'red',
            fontWeight: '300 !important',
            marginBottom: theme.spacing(1)
        }
    },

    text: {
        fontWeight: 300,
        color: COLORS.offBlack
    },

    strong: {
        fontWeight: '600 !important',
        display: 'inline-block'
    },

    button: {
        alignSelf: 'center',
        marginTop: theme.spacing(6),

        [theme.breakpoints.down('sm')]: {
            alignSelf: 'stretch'
        }
    }
}));

const FAQs = () => {
    const classes = useStyles();

    return (
        <section className={classes.root} id={FAQS}>
            <Typography variant="h3" className={classes.header}>Frequently Asked Questions</Typography>
            <Typography variant="h6" align="center">We now have an FAQ list that we hope will help you answer some of the more common ones.</Typography>
            <section className={classes.container}>
                <Accordion className={classes.accordion}>
                    <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                        <Typography className={classes.heading}>How do I sign up on FXBLOOMS?</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                        <Typography className={classes.text}>Click on <Link component={RouterLink} to={SIGN_UP}>Get Started</Link> (You'll be redirected to the create account page)</Typography>
                        <ul>
                            <li>Input your email, username, and password.</li>
                            <li>Read and agree to the terms and conditions.</li>
                            <li>Click on create an account ( a verification link will be sent to your email)</li>
                            <li>Verify your email address with the verification link</li>
                        </ul>
                        <Typography className={classes.text}>Alternatively, you may sign up with Google account by:</Typography>
                        <ul>
                            <li>Read and agree to the terms and conditions.</li>
                            <li>Click on Sign up with Google</li>
                            <li>You will be taken to a page to provide a unique username</li>
                        </ul>
                        <Typography className={classes.text}>Voila! Welcome to FXBLOOMS.</Typography>
                        <Typography className={classes.text}><Typography className={classes.strong}>Note</Typography>: If you already have an FXBLOOMS account. Click <Link component={RouterLink} to={LOGIN}>'Sign in'</Link> instead.</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion className={classes.accordion}>
                    <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                        <Typography className={classes.heading}>Am I known to other users?</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                        <Typography className={classes.text}>No, FXBLOOMS prioritises users' privacy. Other users only see whatever information you choose to share.</Typography>
                        <Typography className={classes.text}>N.B: You may decide to make your phone number visible to other users.</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion className={classes.accordion}>
                    <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                        <Typography className={classes.heading}>How to buy EUR on FXBLOOMS</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                        <Typography className={classes.text}>A user can BUY EUR by accepting an offer or creating a new offer- SELL NGN.</Typography>
                        <Typography className={classes.text}>Accepting Offer - BUY EUR</Typography>
                        <ul>
                            <li>Access all Buy EUR offers by clicking on the BUY EUR button on the dashboard.</li>
                            <li>Accept a suitable offer from all options by clicking on BUY EUR on the preferred offer.</li>
                            <li>The NGN receiving account will prompt up, transfer the NGN amount and click on <Typography className={classes.strong}>Payment Made.</Typography></li>
                            <li>The EUR amount will automatically be moved to your wallet.</li>
                            <li>Withdraw the EUR to your preferred account (pending the seller’s confirmation).</li>
                        </ul>
                        <Typography className={classes.text}>Creating New Offer - SELL NGN</Typography>
                        <ul>
                            <li>From the dashboard, click on 'Make a Listing'</li>
                            <li>Select the currency you wish to sell -  NGN in this case.</li>
                            <li>Input the amount you want to sell, your desired exchange rate and submit.</li>
                            <li>Your listing will appear on the dashboard and made available for willing buyers.</li>
                        </ul>
                        <Typography className={classes.text}>Once a buyer accepts your offer, you will be notified and required to transfer the NGN within 30 mins. Then your wallet will be credited with the EUR equivalent, and you will be able to withdraw (pending sellers confirmation).</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion className={classes.accordion}>
                    <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                        <Typography className={classes.heading}>How do I buy NGN on FXBLOOMS</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                        <Typography className={classes.text}>A user can BUY NGN by accepting an offer or creating a new offer- SELL EUR.</Typography>
                        <Typography className={classes.text}>Accepting Offer - BUY NGN</Typography>
                        <ul>
                            <li>Fund your wallet with the EUR equivalent.</li>
                            <li>Access all Buy NGN offers by clicking on BUY NGN on the dashboard.</li>
                            <li>Accept a suitable offer from all options by clicking on BUY NGN on the preferred offer.</li>
                            <li>A notification will be sent to the SELLER to transfer the NGN within 30 minutes.</li>
                            <li>Once the NGN is sent, your wallet will be debited with the EUR amount.</li>
                            <li>Once you receive the NGN, proceed to the FXBLOOMS to confirm so we can release the EUR for the seller.</li>
                        </ul>
                        <Typography className={classes.text}>Creating New Offer - SELL EUR</Typography>
                        <ul>
                            <li>Fund your wallet with the EUR amount </li>
                            <li>Click on 'Make a Listing' </li>
                            <li>Select the currency you wish to sell -  EUR in this case. </li>
                            <li>Input the amount you want to sell, your desired exchange rate, NGN receiving account and submit.</li>
                            <li>Your listing will appear on the dashboard and made available for willing buyers.</li>
                        </ul>
                        <Typography className={classes.text}>Once your offer is accepted, the user will transfer NGN to your account. Please proceed to FXBLOOMS to confirm once you have received the NGN in your bank.</Typography>
                    </AccordionDetails>
                </Accordion>
            </section>
            <Button to={FAQS} component={RouterLink} variant="contained" color="primary" className={classes.button}>GO TO FAQs</Button>
        </section>
    );
};

export default FAQs;