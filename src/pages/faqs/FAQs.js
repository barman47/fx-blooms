import { Link as RouterLink } from 'react-router-dom';
import { 
    Accordion, 
    AccordionDetails, 
    AccordionSummary, 
    Box, 
    Link,
    Typography 
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ChevronUp } from 'mdi-material-ui';

import Layout from '../../components/layout';

import { LOGIN, SIGN_UP } from '../../routes';

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
                            <Typography className={classes.heading}>How do I change my personal details on FXBLOOMS?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>To change your personal details, like (name, date of birth, address), kindly send a mail to us at <a href="mailto:support@fxblooms.com">support@fxblooms.com</a>.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How do I reset my password?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>If you cannot remember your account password:</Typography>
                            <ul>
                                <li>Go to Login on the FXBLOOMS app</li>
                                <li>Click on ‘Forgotten password?'</li>
                                <li>You will be redirected to a page for you to enter your email address.</li>
                                <li>Once you fill in your email address, you will receive an email containing a password reset link.</li>
                                <li>Click on the link and create a new password.</li>
                            </ul>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How do I reset my password?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>If you cannot remember your account password:</Typography>
                            <ol>
                                <li>Go to Login on the FXBLOOMS app</li>
                                <li>Click on ‘Forgotten password?'</li>
                                <li>You will be redirected to a page for you to enter your email address.</li>
                                <li>Once you fill in your email address, you will receive an email containing a password reset link.</li>
                                <li>Click on the link and create a new password.</li>
                            </ol>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How do I change my PIN?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <ol>
                                <li>Click on change PIN under the security menu.</li>
                                <li>Enter your new PIN.</li>
                                <li>You will receive an OTP on your registered number.</li>
                                <li>Enter the OTP received and click on update.</li>
                            </ol>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How to disable an account?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>By simply contacting us on <a href="mailto:support@fxblooms.com">support@fxblooms.com</a>. You can also reactivate it when you change your mind.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How do I make a complaint?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>By simply contacting us on <a href="mailto:support@fxblooms.com">support@fxblooms.com</a> We’ll do our best to resolve the issue immediately.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>Which documents can I use for the Identity verification process?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>We accept international passports, drivers licénse, resident permits and national ID cards.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How do I verify my ID?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <ol>
                                <li>Click on ID verification under the security tab.</li>
                                <li>Kindly fill the requested information and proceed</li>
                                <li>Then take the picture of your ID, and a selfie of yourself to finalise</li>
                                <li>A success/ failed status notification will be displayed.</li>
                            </ol>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>What happens to my personal information and documents?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>Your information and/or documents are stored on our secured servers. We only use them when we are completing our Know Your Customer (KYC) checks.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>What is FXBLOOMS wallet?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>Your Wallet is your secure account storing your money electronically on the FXBLOOMS platform. You can fund and withdraw from your wallet so you can consider it as another bank account for your transactions.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How many wallets can I have?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>At the moment, we only power Euro wallets but we are working towards supporting multiple wallets for more currencies in the future.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How do I fund my wallet?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <ol>
                                <li>Click on Add fund on the wallet</li>
                                <li>Input the amount</li>
                                <li>Select the account you wish to pay with from a list of saved accounts  (N.B If your the account is not yet saved on FXBLOOMS, click on the Add account button to save it)</li>
                                <li>Proceed to authorise the payment via your banking app.</li>
                            </ol>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>Can I fund my wallet with a Card?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>Not at the moment, we are presently working on other payment options like card payments and direct transfer.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How long does it take for the funds to reflect?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>Payments to your wallet should reflect immediately or within 30 minutes in a few cases.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>Why has my fund not reflected in my wallet?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>This may be due to bank processing delays. If the funds sent have not been reflected in your wallet within 6 hours, kindly reach out to us at <a href="mailto:support@fxblooms.com">support@fxblooms.com</a></Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>What is FXBLOOMS marketplace?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>FXBLOOMS marketplace is a secure peer-peer currency exchange marketplace where buyers and sellers meet. All offers created appear here and users can accept the offer that interests them.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>What currencies can be exchanged on the FXBLOOMS marketplace?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>Currently, we support  NGN and EUR only. However, we are tirelessly working on introducing more currency pairs.</Typography>
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
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How long does it take to purchase currency?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>A user can exchange by either accepting an offer or creating a new offer. For offer acceptance the exchanges take between seconds to 30 mins depending on the currency.</Typography>
                            <Typography className={classes.text}>For creation of a new offer, the exchange time depends on how fast a buyer accepts your offer.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>What is the transaction limit?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>For now the daily limit is set at EUR5000 or its equivalent.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How many offers can I have on the Marketplace?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>As many offers as your wallet balance can take!</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>Can the beneficiary of the exchanged funds be anyone even if they are not on FXBLOOMS?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>Yes, the beneficiary of the exchanged funds doesn’t have to be on FXBLOOMS to receive the money. Just provide their correct account details during the wallet withdrawal and let us do the rest.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>Can I withdraw an offer?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>Yes, as long as it is not yet accepted.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>Am I known to other users?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>No, FXBLOOMS prioritises users' privacy. Other users only see whatever information you choose to share.</Typography>
                            <Typography className={classes.text}><Typography className={classes.strong}>NB</Typography>: You may decide to make your phone number visible to other users.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>How much do you charge per transaction?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>FXBLOOMS is 100% free for now.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>What other charges are involved?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>No listing fee, No withdrawal fee, No processing fee. FXBLOOMS is 100% free for now.</Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary className={classes.summary} expandIcon={<ChevronUp />}>
                            <Typography className={classes.heading}>What comes with the transaction name?</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.details}>
                            <Typography className={classes.text}>Only the username.</Typography>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Box>
        </Layout>
    );
};

export default FAQs;