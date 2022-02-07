import { Link as RouterLink } from 'react-router-dom';
import { 
    Accordion, 
    AccordionDetails, 
    AccordionSummary, 
    Box, 
    Link,
    List,
    ListItem,
    ListItemText, 
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ChevronUp } from 'mdi-material-ui';

import Layout from '../../components/layout';

import { SIGN_UP } from '../../routes';

import { COLORS } from '../../utils/constants';
import background from '../../assets/img/patterns-black.jpg';

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
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
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
            fontWeight: 800,

            [theme.breakpoints.down('sm')]: {
                fontSize: theme.spacing(3)
            }
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
            gridTemplateColumns: '1fr',
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
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>Does the Other User Get to Know Me?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>No other users will not see any of your private information you do not want them to see. Be rest assured your data is safe with us.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>Which currency can be traded?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>FXBLOOMS support EUR and NGN exchange. More currency pairs will be added in the future.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How do I log in a complaint?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>Kindly raise a support ticket by sending an email to support@fxblooms.com, and we will get back to you.</Typography>
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
                            <Typography className={classes.text}>As long as you have a willing accept your *ask* rate and amount, you will get the NGN in the account provided in less than 5 minutes. And as a seller, the speed of getting the equivalent EUR depends on the seller's transfer method, your receiving bank and how fast the seller sends the money.</Typography>
                            <Typography className={classes.text}>We know speed of exchange is important to you, and we are tirelessly working on processes and products to expedite the exchange process. We envision exchanges with a click of a button.</Typography>
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
                            <Typography className={classes.text}>We accept international passports, drivers licénse and national ID for users on boarding.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How to buy on FXBLOOMS?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>After signing up and completing the identity verification, a user is ready to BUY EUR on the FXBLOOMS platform.</Typography>
                            <Typography className={classes.text}>
                                A buyer simply chooses the most suitable offer among  sellers listing, he/she then clicks on BUY EUR, then input the amount to buy, a receiving account and place a bid. A successful bid will show the seller’s receiving account the buyer is expected to transfer the NGN to, and the seller is then notified. 
                                Once the seller confirms receiving the NGN, he/she then transfers the EUR equivalent to the account provided by you (buyer).  
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How can I report malicious users?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>Kindly send a complaint or malicious user to us by emailing <Typography className={classes.strong} style={{ cursor: 'pointer', color: '#1a73e8' }} onClick={() => window.open('mailto:support@fxblooms.com')}>support@fxblooms.com</Typography>.</Typography>
                            <Typography className={classes.text}>You can also flag the user. When you do so, we commence an investigation and take necessary actions.</Typography>
                            <Typography className={classes.text}>When you send us an email, please provide as many details as possible for example, transaction ID, your username, and the username of the person you want to report.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How do I protect myself against fraud?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>As one of the several internal controls put in place, we strongly recommend the seller of EUR to confirm NGN payment in their account before transferring the EUR.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How SELL on FXBLOOMS?</Typography>
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
                </Box>
            </Box>
        </Layout>
    );
};

export default FAQs;