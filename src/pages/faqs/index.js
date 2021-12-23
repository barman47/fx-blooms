import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ChevronUp } from 'mdi-material-ui';

import Layout from '../../components/layout';

import { COLORS } from '../../utils/constants';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#fcfcfc',
        marginTop: theme.spacing(8.1),

        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(7),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },

    content: {
        backgroundColor: COLORS.darkTeal,
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100vw',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        [theme.breakpoints.down('md')]: {
            height: '50vh'
        },
        
        [theme.breakpoints.down('sm')]: {
            height: '40vh'
        },

        '& h4:first-child': {
            color: COLORS.offWhite,
            fontWeight: 800
        },

        '& p': {
            color: COLORS.offWhite,
            fontWeight: 300,
            marginTop: theme.spacing(2)
        }
    },

    container: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: theme.spacing(5),
        marginTop: theme.spacing(75),
        padding: [[theme.spacing(2), theme.spacing(10), theme.spacing(10), theme.spacing(10)]],

        [theme.breakpoints.down('md')]: {
            marginTop: theme.spacing(70),
            padding: theme.spacing(2)
        },

        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(45),
            padding: [[theme.spacing(2), theme.spacing(3), theme.spacing(3), theme.spacing(3)]]
        }
    },

    accordion: {
        alignSelf: 'flex-start',
        border: 'none !important',
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

    accordionContent: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(1),
        padding: theme.spacing(0, 5),

        '& ol li': {
            color: COLORS.offBlack,
            fontWeight: 300
        },

        '& ul li': {
            color: COLORS.offBlack,
            fontWeight: 300
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


    item: {
        marginBottom: theme.spacing(10),

        '& h6': {
            fontWeight: 300,
            marginBottom: theme.spacing(5)
        },

        '& p': {
            color: COLORS.offBlack,
            lineHeight: 1.9,
            marginBottom: theme.spacing(0.5),
            fontSize: theme.spacing(1.8),
            fontWeight: 300,
            textAlign: 'justify'
        }
    }
}));

const FAQs = () => {
    const classes = useStyles();

    return (
        <Layout title="Frequently Asked Questions">
            <Box component="section" className={classes.root}>
                <Box component="header" className={classes.content}>
                    <Typography variant="h4">Frequently Asked Questions</Typography>
                    <Typography variant="subtitle2" component="p">We now have an FAQ list that we hope will help <br />you answer some of the more common ones.</Typography>
                </Box>
                <Box component="section" className={classes.container}>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How do I register for an account?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.accordionContent}>
                            <Typography className={classes.text}>Here are the steps required to get an account.</Typography>
                            <Typography className={classes.text}>Click on <Typography className={classes.strong}>Get Started</Typography></Typography>
                            <ol>
                                <li>Provide your profile details</li>
                                <li>Verify your email address</li>
                                <li>Provide your personal details</li>
                                <li>Set up 2-factor authentication</li>
                            </ol>
                            <Typography className={classes.text}>Welcome to FXBLOOMS.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>What comes with the transaction name?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.accordionContent}>
                            <Typography className={classes.text}>We make use of usernames to protect privacy but allow tracking of users.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How does it work?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>To sell, you'd need to provide a valid resident's permit. To buy, you'd need to provide a valid international passport. Once your document is verified, you can start using FXBLOOMS.</Typography>
                            <Typography className={classes.text}>To Sell: You need to <Typography className={classes.strong}>make a listing</Typography>  with your prefered <Typography className={classes.strong}>rate</Typography>. Your listing amount and rate will be posted on the dashboard where other users (buyers and sellers) can see what you're offering. An interested buyer will contact you.</Typography>
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
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>Does the Other User Get to Know Me?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>Other users will not see any of your private information. Be rest assured your data is safe with us.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>Which currency can be traded?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>FXBLOOMS support EURO and Naira exchange. More currency pairs will be added in the future.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How do I log in a complaint?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>In case you are not satisfied with our service, please raise a support ticket by sending an email to <Typography className={classes.strong} style={{ cursor: 'pointer', color: '#1a73e8' }} onClick={() => window.open('mailto:support@fxblooms.com')}>support@fxblooms.com</Typography>, and we will get back to you.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How does the Pricing work per transaction?</Typography>
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
                            <Typography className={classes.text}>As long as you have a buyer willing to accept your *ask* rate or your desired rate and amount align with a seller's listing, then the speed of the transaction depends on you and the other party. But in most cases 10 to 15 minutes.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>Is there instant transfer?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>Yes, we recommend sellers to use the instant transfer option when possible.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How to disable an account?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>By simply contacting us on <Typography className={classes.strong} style={{ cursor: 'pointer', color: '#1a73e8' }} onClick={() => window.open('mailto:support@fxblooms.com')}>support@fxblooms.com</Typography>. You can also reactivate it when you change your mind.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>What are the documents needed for Identity verification?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>We accept international passports, drivers license and national ID for users on boarding. To buy, any of the ID submitted during on sign up would suffice. However, to sell on the platform, we may request more ID and information.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How to buy EUR on FXBLOOMS?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>After signing up and completing the identity verification you are ready to buy EUR on the FXBLOOMS platform.</Typography>
                            <ul>
                                <li>Choose from all the available EUR offers in the All Listing Page.</li>
                                <li>Place an order to buy the EUR by contacting the chosen seller.</li>
                                <li>Align with the SELLER the amount you are sending.</li>
                                <li>Transfer the agreed EUR to the account provided by the seller.</li>
                                <li>Lastly, provide the seller the account you want credited and confirm the payment.</li>
                            </ul>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How can I report malicious users?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>Kindly send a complaint or malicious user to us by emailing <Typography className={classes.strong} style={{ cursor: 'pointer', color: '#1a73e8' }} onClick={() => window.open('mailto:support@fxblooms.com')}>support@fxblooms.com</Typography> or by flagging the user. When you send an email to us kindly provide as many details as possible e,g. Chatbox ID, your username and the username of the person you want to report.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How do I protect myself against fraud?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>As one of the several internal controls to ensure security on the FXBLOOMS platform, we strongly recommend the seller of EUR to confirm NGN payment in their account before transferring the corresponding EUR.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How to sell EUR EUR on FXBLOOMS?</Typography>
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
                </Box>
            </Box>
        </Layout>
    );
};

export default FAQs;