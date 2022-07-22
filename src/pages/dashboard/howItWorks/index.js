import { useEffect, useState } from 'react';
import { 
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ViewListOutline } from 'mdi-material-ui';
// import { COLORS } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0, 5),

        [theme.breakpoints.down('sm')]: {
            padding: 0
        }
    },

    title: {
        marginBottom: theme.spacing(2)
    },

    accordion: {
        marginBottom: theme.spacing(3)
    },

    accordionHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },

    heading: {
        fontSize: theme.spacing(2)
    },

    icon: {
        color: theme.palette.primary.main,
        marginRight: theme.spacing(1)
    },

    header: {
        fontWeight: 600,
        margin: theme.spacing(2, 0)
    },

    content: {
        display: 'block'
    },

    text: {
        fontWeight: 300,
        marginBottom: theme.spacing(1)
    },

    listItem: {
        fontWeight: 300
    }
}));

const HowItWorks = ({ handleSetTitle }) => {
    const classes = useStyles();

    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };    

    useEffect(() => {
        handleSetTitle('How it works');
        // eslint-disable-next-line
    }, []);

    return (
        <Box component="section" className={classes.root}>
            <Typography variant="h6" className={classes.title}>How it works</Typography>
            <Accordion className={classes.accordion} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary className={classes.accordionHeader}>
                    <ViewListOutline className={classes.icon} />
                    <Typography variant="h6" className={classes.heading}>How to exchange EURO for NAIRA</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.content}>
                    <Typography variant="body2" component="p" className={classes.text}>A user can exchange EURO for NAIRA  by <strong>accepting an offer</strong> -BUY NGN or <strong>creating a new offer</strong>- SELL EUR. </Typography>
                    <Typography variant="body2" component="p" className={classes.header}>Accepting Offer - BUY NGN</Typography>
                    <Box component="ul">
                        <li className={classes.listItem}>Fund your wallet with the EUR equivalent.</li>
                        <li className={classes.listItem}>From the dashboard, access all NGN offers by clicking on the BUY button and also the currency - in this case NGN</li>
                        <li className={classes.listItem}>Accept a suitable offer from all available options by clicking on BUY NGN on the preferred listing.</li>
                        <li className={classes.listItem}>A notification will be sent to the seller to transfer the NGN within the hour.</li>
                        <li className={classes.listItem}>Once you receive the NGN, proceed to your FXBLOOMS account to confirm so we can release the EUR in your wallet to the seller.</li>
                    </Box>
                    <Typography variant="body2" component="p" className={classes.header}>Creating New Offer - SELL EUR</Typography>
                    <Box component="ul">
                        <li className={classes.listItem}>Fund your wallet with the EUR amount</li>
                        <li className={classes.listItem}>From the dashboard, click on the SELL button and also the EUR button.</li>
                        <li className={classes.listItem}>Input the amount you want to sell, your desired exchange rate, NGN receiving account and submit.</li>
                        <li className={classes.listItem}>Your listing will appear on the dashboard under BUY EUR and made available for willing buyers.</li>
                    </Box>
                    <Typography variant="body2" component="p" className={classes.text}>Once your offer is accepted, the buyer will transfer NGN to your account. You should then proceed to your FXBLOOMS account to confirm receiving  the NGN, so we can release the EUR for the seller.</Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion className={classes.accordion} expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary className={classes.accordionHeader}>
                    <ViewListOutline className={classes.icon} />
                    <Typography variant="h6" className={classes.heading}>How to exchange NAIRA for EUR</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.content}>
                    <Typography variant="body2" component="p" className={classes.text}>A user can exchange NAIRA for EURO by <strong>accepting an offer</strong> (BUY EUR) or <strong>creating a new offer</strong>- SELL NGN.</Typography>
                    <Typography variant="body2" component="p" className={classes.header}>Accepting Offer - BUY EUR</Typography>
                    <Box component="ul">
                        <li className={classes.listItem}>From the dashboard, access all BUY EUR offers by clicking on the BUY and EUR buttons.</li>
                        <li className={classes.listItem}>Accept a suitable offer from all applicable listings by clicking on BUY EUR on the preferred listing.</li>
                        <li className={classes.listItem}>The NGN receiving account of the seller will prompt up, transfer the NGN amount and click on <strong>Payment Made.</strong></li>
                        <li className={classes.listItem}>The EUR amount will automatically be moved to your wallet but Escrowed</li>
                        <li className={classes.listItem}>The EUR amount will be made available for withdrawal immediately the seller confirms receiving the NGN.</li>
                    </Box>
                    <Typography variant="body2" component="p" className={classes.header}>Creating New Offer - SELL NGN</Typography>
                    <Box component="ul">
                        <li className={classes.listItem}>From the dashboard, click on the sell button and also the currency you want to sell  (NGN in this case).</li>
                        <li className={classes.listItem}>Input the amount you want to sell, your desired exchange rate, check the box to agree to transfer the NGN as soon as your offer is accepted and submit. </li>
                        <li className={classes.listItem}>Your listing will appear on the dashboard and be made available for willing buyers.</li>
                    </Box>
                    <Typography variant="body2" component="p" className={classes.text}>Once a buyer accepts your offer, you will be notified to transfer the NGN right away. Once done, the EUR amount is moved to your wallet and made available for withdrawal once the buyer confirms receiving the NGN.</Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion className={classes.accordion} expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary className={classes.accordionHeader}>
                    <ViewListOutline className={classes.icon} />
                    <Typography variant="h6" className={classes.heading}>Funding of Wallet</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.content}>
                    <Box component="ul">
                        <li className={classes.listItem}>From the dashboard or wallet page, click on the fund wallet button.</li>
                        <li className={classes.listItem}>Input the amount you want to fund</li>
                        <li className={classes.listItem}>Select the account you wish to pay with from a list of your saved accounts  (N.B If your the paying account is not yet saved on FXBLOOMS, click on the Add account button to save it)</li>
                        <li className={classes.listItem}>Proceed to authorise the payment via your banking app or internet banking.</li>
                        <li className={classes.listItem}>Once the payment is successful, your wallet will be credited within the hour.</li>
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Accordion className={classes.accordion} expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                <AccordionSummary className={classes.accordionHeader}>
                    <ViewListOutline className={classes.icon} />
                    <Typography variant="h6" className={classes.heading}>How to withdrawal from wallet</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.content}>
                    <Box component="ul">
                        <li className={classes.listItem}>Click on the withdrawal button on the dashboard</li>
                        <li className={classes.listItem}>Select the receiving account</li>
                        <li className={classes.listItem}>Input the amount you want to withdraw</li>
                        <li className={classes.listItem}>Type in an optional reference</li>
                        <li className={classes.listItem}>Enter your 4 digits security PIN</li>
                        <li className={classes.listItem}>Click on send request button</li>
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Accordion className={classes.accordion} expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
                <AccordionSummary className={classes.accordionHeader}>
                    <ViewListOutline className={classes.icon} />
                    <Typography variant="h6" className={classes.heading}>KYC</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.content}>
                    <Typography variant="body2" component="p" className={classes.text}>To have full access to the FXBLOOMS platform, all users are to go through our KYC process starting with the ID verification.</Typography>
                    <Typography variant="body2" component="p" className={classes.header}>How do I verify my ID?</Typography>
                    <Box component="ol">
                        <li className={classes.listItem}>Click on ID verification under the security menu</li>
                        <li className={classes.listItem}>Kindly fill the requested information and proceed</li>
                        <li className={classes.listItem}>Then take the picture of your ID, and a selfie of yourself to finalise</li>
                        <li className={classes.listItem}>A success/ failed status notification will be displayed.</li>
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Accordion className={classes.accordion} expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
                <AccordionSummary className={classes.accordionHeader}>
                    <ViewListOutline className={classes.icon} />
                    <Typography variant="h6" className={classes.heading}>How do I change my PIN?</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.content}>
                    <Box component="ol">
                        <li className={classes.listItem}>Click on change PIN under the security menu.</li>
                        <li className={classes.listItem}>Enter your new PIN</li>
                        <li className={classes.listItem}>You will receive an OTP on your registered number</li>
                        <li className={classes.listItem}> Enter the OTP received and click on update.</li>
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Accordion className={classes.accordion} expanded={expanded === 'panel7'} onChange={handleChange('panel7')}>
                <AccordionSummary className={classes.accordionHeader}>
                    <ViewListOutline className={classes.icon} />
                    <Typography variant="h6" className={classes.heading}>2FA Authenticator - Setting up, Deactivating and Activating</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.content}>
                    <Typography variant="body2" component="p" className={classes.header}>Google Authenticator</Typography>
                    <Typography variant="body2" component="p" className={classes.text}>Visit the Apple App Store or Google Play Store to download Google Authenticator app on your smartphone</Typography>
                    <Typography variant="body2" component="p" className={classes.text}>Then from the dashboard, click on security &gt; 2FA, then select for the Google Authentication SET UP. This will show the both automatic setup and manual setup options.</Typography>
                    <Typography variant="body2" component="p" className={classes.text}>Automatic setup:	This option is for users with a Google authentication app downloaded on a device different from the one they signed on FXBLOOMS with. Kindly open the google authenticator app on your phone and  scan the barcode on your screen of the 2nd device with the Google Authenticator App. This will sync the FXBLOOMS app into Google Authenticator. This is the default authenticator for FXBLOOMS, and you will need the 6 digits code from the Google authenticator every time you sign in to the FXBLOOMS platform.</Typography>
                    <Typography variant="body2" component="p" className={classes.text}>Manual setup: This option is for users with the Google authentication app downloaded on the same smartphone they are signed on with on FXBLOOMS. Kindly manually copy the setup code, and go to the Google authenticator, click on the big plus sign, select enter setup key, put FXBLOOMS in the first field and paste the copied code in the second field then save. This will save the FXBLOOMS app in the Google Authenticator. This is the default authenticator for FXBLOOMS, and you will need the 6 digits code from the Google authenticator every time you sign in to the FXBLOOMS platform.</Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion className={classes.accordion} expanded={expanded === 'panel8'} onChange={handleChange('panel8')}>
                <AccordionSummary className={classes.accordionHeader}>
                    <ViewListOutline className={classes.icon} />
                    <Typography variant="h6" className={classes.heading}>How to track open and closed transactions</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.content}>
                    <Box component="ul">
                        <li className={classes.listItem}>Click on the Transaction tab to see the list of all transactions</li>
                        <li className={classes.listItem}>Click on the view more button to see more details of the transactions.</li>
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Accordion className={classes.accordion} expanded={expanded === 'panel9'} onChange={handleChange('panel9')}>
                <AccordionSummary className={classes.accordionHeader}>
                    <ViewListOutline className={classes.icon} />
                    <Typography variant="h6" className={classes.heading}>How to cancel pending transaction</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.content}>
                    <Box component="ul">
                        <li className={classes.listItem}>You may cancel a pending transaction provided the other user has not yet sent the NGN.</li>
                        <li className={classes.listItem}>Simply click on the transaction, and you will see the pending transaction and the countdown.</li>
                        <li className={classes.listItem}>You may cancel such transaction by clicking on the cancel button</li>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default HowItWorks;