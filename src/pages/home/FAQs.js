import { Link } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Button, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ChevronUp } from 'mdi-material-ui';

import { COLORS } from '../../utils/constants';
import { FAQS } from '../../routes';

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
            fontWeight: '300 !important'
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
        <section className={classes.root}>
            <Typography variant="h3" className={classes.header}>Frequently Asked Questions</Typography>
            <Typography variant="h6" align="center">We now have an FAQ list that we hope will help you answer some of the more common ones.</Typography>
            <section className={classes.container}>
                <Accordion className={classes.accordion}>
                    <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                        <Typography className={classes.heading}>How do I register for an account?</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.content}>
                        <Typography className={classes.text}>Here are the steps required to get an account.</Typography>
                        <Typography className={classes.text}>Click on <Typography className={classes.strong}>Get Started</Typography></Typography>
                        <List component="ol">
                            <ListItem>
                                <ListItemText primary="1. Provide your profile details" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="2. Verify your email address" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="3. Provide your personal details" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="4. Set up 2-factor authentication" />
                            </ListItem>
                        </List>
                        <Typography className={classes.text}>Welcome to FXBLOOMS.</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion className={classes.accordion}>
                    <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                        <Typography className={classes.heading}>How does the pricing work per transaction?</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                        <Typography className={classes.text}>FXBLOOMS is a 100% free platform. Any future change in pricing will be communicated out beforehand.</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion className={classes.accordion}>
                    <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                        <Typography className={classes.heading}>How long does it take to purchase a currency?</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                        <Typography className={classes.text}>As long as you have a buyer willing to accept your *ask* rate or your desired rate and amount align with a seller’s listing, then the speed of the transaction depends on you and the other party. But in most cases 10 to 15 minutes.</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion className={classes.accordion}>
                    <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                        <Typography className={classes.heading}>How to sell EUR on FXBLOOMS</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                        <Typography className={classes.text}>After signing up and completing the identity verification you are ready to sell EUR on the FXBLOOMS platform.</Typography>
                        <ul>
                            <li>Post the EUR you want to sell on the Make A Listing page input the total amount you want to sell, the rate you desire and the smallest amount you can transact then submit. This process allows a buyer to see your listing among others sellers listing.</li>
                            <li>A buyer is then able to contact you through the FXBLOOMS chatbox.</li>
                            <li>Confirm the amount the Buyer wants (if applicable)</li>
                            <li>Provide the buyer the NGN account you want credited</li>
                            <li>confirm his payment, you proceed to</li>
                            <li>Ask for the buyer's EUR account and transfer the agreed amount to it.</li>
                        </ul>
                        <Typography className={classes.strong}>PLEASE DO NOT TRANSFER MONEY TO BUYER UNTIL YOU CONFIRM THE NGN IN YOUR ACCOUNT.</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion className={classes.accordion}>
                    <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                        <Typography className={classes.heading}>How does it work?</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                        <Typography className={classes.text}>To sell, you'd need to provide a valid resident's permit. To buy, you'd need to provide a valid international passport. Once your document is verified, you can start using FXBLOOMS.</Typography>
                        <Typography className={classes.text}>To Sell: You need to <Typography className={classes.strong}>make a listing</Typography>  with your prefered <Typography className={classes.strong}>rate</Typography>. Your listing amount and rate will be posted on the dashboard where other users (buyers and sellers) can see what you’re offering. An interested buyer will contact you.</Typography>
                        <Typography className={classes.text}>To buy: Simply contact a seller with a favourable rate.</Typography>
                        <Typography className={classes.text}>The communication happens in our Chatbox, where you can exchange account details and other information.</Typography>
                        <Typography className={classes.strong}>Please note: We strongly advise a buyer to send their money first, and a seller should only send his after he or she has confirmed payment in his or her  account.</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion className={classes.accordion}>
                    <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                        <Typography className={classes.heading}>What is the transaction limit?</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                        <Typography className={classes.text}>For now the daily limit is set at 5000 EUR or its equivalent.</Typography>
                    </AccordionDetails>
                </Accordion>
            </section>
            <Button to={FAQS} component={Link} variant="contained" color="primary" className={classes.button}>GO TO FAQs</Button>
        </section>
    );
};

export default FAQs;