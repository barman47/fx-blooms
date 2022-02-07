import { Link as RouterLink } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Button, Link, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ChevronUp } from 'mdi-material-ui';

import { COLORS } from '../../utils/constants';
import { FAQS, SIGN_UP } from '../../routes';

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
                        <Typography className={classes.heading}>How do I register for an account?</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.content}>
                        <Typography className={classes.text}>Here are the steps required to get an account.</Typography>
                        <Typography className={classes.text}>Click on <br /><Link to={SIGN_UP} component={RouterLink} className={classes.strong}>Get Started</Link></Typography>
                        <List component="ol">
                            <ListItem>
                                <ListItemText primary="1. Provide your profile details - email, username and password" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="2. Verify your email address" />
                            </ListItem>
                        </List>
                        <Typography className={classes.strong}>Viola! Welcome to FXBLOOMS.</Typography>
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
                        <Typography className={classes.text}>As long as you have a willing accept your *ask* rate and amount, you will get the NGN in the account provided in less than 5 minutes. And as a seller, the speed of getting the equivalent EUR depends on the seller's transfer method, your receiving bank and how fast the seller sends the money.</Typography>
                        <Typography className={classes.text}>We know speed of exchange is important to you, and we are tirelessly working on processes and products to expedite the exchange process. We envision exchanges with a click of a button.</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion className={classes.accordion}>
                    <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                        <Typography className={classes.heading}>How to SELL on FXBLOOMS</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                        <Typography className={classes.text}>After signing up and completing the identity verification you are ready to sell EUR on the FXBLOOMS platform.</Typography>
                        <ul>
                            <li>Post the EUR you want to sell on the Make A Listing page input the total amount you want to sell, the rate you desire and the NGN receiving account. This process allows a buyer to see your listing among others sellers listing.</li>
                            <li>A buyer is then able to place a bid by clicking on BUY EUR.</li>
                            <li>Successful bid allows the buyer to see the account to send the NGN to (as provided by you).</li>
                            <li>Once the buyer sends the NGN, a notification is sent to you.</li>
                            <li>You confirming the NGN payment gives you access to the account to send EUR to (as provided by the buyer).</li>
                            <li>The buyer confirms receiving the EUR, and the transaction is considered complete.</li>
                        </ul>
                        <Typography className={classes.strong}>PLEASE DO NOT TRANSFER MONEY TO BUYER UNTIL YOU CONFIRM THE NGN IN YOUR ACCOUNT.</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion className={classes.accordion}>
                    <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                        <Typography className={classes.heading}>How does it work?</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.details}>
                        <Typography className={classes.text}>Only registered and verified users can BUY and SELL on the FXBLOOMS platform.</Typography>
                        <Typography className={classes.text}><Typography className={classes.strong}>To Sell:</Typography> You need to post the amount, a desired rate and a receiving account. Your posting will be added to other seller’s listings on the dashboard for willing buyers to see. An interested buyer can then accept your offer and send you the NGN, confirming the NGN payment in the APP will give you access to the account provided by the buyer, then you proceed and send the EUR to it.</Typography>
                        <Typography className={classes.text}><Typography className={classes.strong}>To buy:</Typography> Simply accept a seller listing by clicking on BUY EUR, then you input the amount you want to buy, your receiving account and place a bid. A successful bid will show you the seller’s receiving account, then transfer the NGN equivalent and the seller will be notified. Once the seller confirms receiving the NGN, he/she then transfers the EUR equivalent to the account you provided.</Typography>
                        <Typography className={classes.strong}>Please note: We strongly advise the seller to confirm the NGN payment on his banking APP, before sending the EUR equivalent. </Typography>
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
            <Button to={FAQS} component={RouterLink} variant="contained" color="primary" className={classes.button}>GO TO FAQs</Button>
        </section>
    );
};

export default FAQs;