import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Layout from '../../components/layout';

import { COLORS } from '../../utils/constants';

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
        }
    },

    container: {
        marginTop: theme.spacing(75),
        padding: [[theme.spacing(2), theme.spacing(10), theme.spacing(10), theme.spacing(10)]],

        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(45),
            padding: [[theme.spacing(2), theme.spacing(3), theme.spacing(3), theme.spacing(3)]]
        },
    },

    item: {
        marginBottom: theme.spacing(10),

        '& p:first-child': {
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

const PrivacyPolicy = () => {
    const classes = useStyles();

    return (
        <Layout title="Privacy Policy">
            <Box component="section" className={classes.root}>
                <Box component="header" className={classes.content}>
                    <Typography variant="h4">Privacy Policy</Typography>
                </Box>
                <Box component="section" className={classes.container}>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">Processing of personal data</Typography>
                        <Typography variant="body2" component="p">
                            FXBLOOMS OÜ (registry code 16262446), located at Harju maakond, Tallinn, Lasnamäe linnaosa, Tuha tn 3, 11415 Estonia, email privacy@fxblooms.com (hereinafter referred to as the service provider), processes your personal data in accordance with the requirements of the Personal Data Protection Act of Estonia.
                            The service provider processes personal information only for providing the service you have ordered. We do not transmit, sell, or disclose your data to third parties without your prior consent or in the cases provided by law.
                        </Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">1. Data we collect</Typography>
                        <Typography variant="body2" component="p">1.1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The service provider processes the following data:</Typography>
                        <Typography variant="body2" component="p">1.1.1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;First name and surname, phone number, email;</Typography>
                        <Typography variant="body2" component="p">1.1.2.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date of birth, copies of ID, contact details;</Typography>
                        <Typography variant="body2" component="p">1.1.3.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Security details to protect identity, nationality, data usage, as well as the data communicated while using the service and application;</Typography>
                        <Typography variant="body2" component="p">1.1.4.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;User session data, cookies, and IP address.</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">2. How do we collect your data?</Typography>
                        <Typography variant="body2" component="p">2.1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You directly provide us with most of the data we collect. We collect and process data when you:</Typography>
                        <Typography variant="body2" component="p">2.1.1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You onboard and/or login as a user.</Typography>
                        <Typography variant="body2" component="p">2.1.2.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You choose to link your account with a third party account e.g. Google account.</Typography>
                        <Typography variant="body2" component="p">2.1.3.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Use or view our website via your browser's cookies.</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">3. Purpose of data processing</Typography>
                        <Typography variant="body2" component="p">3.1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To process payments through payment gateway service provider</Typography>
                        <Typography variant="body2" component="p">3.2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To process orders</Typography>
                        <Typography variant="body2" component="p">3.3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To contact and inform persons involved about exceptional circumstances regarding the order or delivery</Typography>
                        <Typography variant="body2" component="p">3.4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To issue invoices</Typography>
                        <Typography variant="body2" component="p">3.5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To execute reimbursements</Typography>
                        <Typography variant="body2" component="p">3.6&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To manage and solve order related errors, refunds, and feedback</Typography>
                        <Typography variant="body2" component="p">3.7&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To email you with special offers on other products we think you might like</Typography>
                        <Typography variant="body2" component="p">3.8&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To make the website more user-friendly and to carry out technical improvements</Typography>
                        <Typography variant="body2" component="p">3.9&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To facilitate your onboarding process as a user</Typography>
                        <Typography variant="body2" component="p">3.10&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To provide our product and contract to you based on the obligations in the contract between us and you.</Typography>
                        <Typography variant="body2" component="p">3.11&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To verify your identity and eligibility for our product and service</Typography>
                        <Typography variant="body2" component="p">3.12&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To carry out regulatory requirements and compliance obligations.</Typography>
                        <Typography variant="body2" component="p">3.13&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To inform you about changes in the service we provide.</Typography>
                        <Typography variant="body2" component="p">3.14&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To verify your identity at ID verification companies or agencies. Note that the third party involved may keep the record of such verification.</Typography>
                        <Typography variant="body2" component="p">3.15&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To protect our business and other users, including detection and prevention of fraud and other crimes.</Typography>
                        <Typography variant="body2" component="p">3.16&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To record or report contractual breach of our terms and agreements.</Typography>
                        <Typography variant="body2" component="p">3.17&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To facilitate complaints, customer support, and service.</Typography>
                        <Typography variant="body2" component="p">3.18&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For business processes including, but not limited to, data analysis, evaluation of products, services, and campaigns.</Typography>
                        <Typography variant="body2" component="p">3.19&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To manage our legitimate interests and protect our reputation.</Typography>
                        <Typography variant="body2" component="p">3.20&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To comply with applicable regulations.</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">4. Legal basis</Typography>
                        <Typography variant="body2" component="p">4.1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The data subject has given consent to the processing</Typography>
                        <Typography variant="body2" component="p">4.2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Processing is necessary for performance of a contract between the two parties</Typography>
                        <Typography variant="body2" component="p">4.3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Processing is necessary for compliance with a legal obligation</Typography>
                        <Typography variant="body2" component="p">4.4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Processing is necessary to protect the data subject's vital interests</Typography>
                        <Typography variant="body2" component="p">4.5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Processing is necessary for the performance of a task carried out in the public interest or in the exercise of official authority vested in the controller</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">5. How do we store your data</Typography>
                        <Typography variant="body2" component="p">5.1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The service provider securely stores your data at www.fxblooms.com, by FXBLOOMS OÜ (registry code 16262446), located at Harju maakond, Tallinn, Lasnamäe linnaosa, Tuha tn 3, 11415 Estonia.</Typography>
                        <Typography variant="body2" component="p">5.2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Service Provider will retain User's personal data for a period of 5 years after termination of customer relationship with the User. Once this time-period has expired, we will delete the User's data by removing and erasing it from the company's database and records.</Typography>
                        <Typography variant="body2" component="p">5.3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Accountancy related data (invoices and payment records) shall be retained for 7 years.</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">6. Security</Typography>
                        <Typography variant="body2" component="p">6.1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The service provider is the holder and controller of the collected data. The access to customer's personal data is provided only to staff members of the service provider for processing orders and managing order related errors, refunds and feedback while taking the relevant precautions and measures in order to avoid disclosure, unauthorised access, loss and unlawful use of personal data by irrelevant third parties.</Typography>
                        <Typography variant="body2" component="p">6.2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The service provider may and can transmit personal data to relevant third parties to process orders, manage service provider's accountancy operations, verification of User's identity and documents, proportionately to what is necessary to perform the relevant action.</Typography>
                        <Typography variant="body2" component="p">6.3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The service provider transmits the personal data necessary for verification of User's identity and documents to GetID (https://getid.ee) which is a recognized identity verification service provider.</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">7. Marketing</Typography>
                        <Typography variant="body2" component="p">7.1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The service provider would like to send you information about products and services of ours that we think you might like. If you have agreed to receive marketing, you may always opt out at a later date.</Typography>
                        <Typography variant="body2" component="p">7.2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You have the right at any time to stop the service provider from contacting you for marketing purposes.</Typography>
                        <Typography variant="body2" component="p">7.3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; If you no longer wish to be contacted for marketing purposes, please inform us at privacy@fxblooms.com and you will be removed from our mailing list.</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">8. What are your data protection rights?</Typography>
                        <Typography variant="body2" component="p">8.1.1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The service provider would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</Typography>
                        <Typography variant="body2" component="p">8.1.2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The right to access - You have the right to request the service provider for copies of your personal data.</Typography>
                        <Typography variant="body2" component="p">8.1.3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The right to rectification - You have the right to request that the service provider correct any information you believe is inaccurate. You also have the right to request the service provider's owner to complete the information you believe is incomplete.</Typography>
                        <Typography variant="body2" component="p">8.1.4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The right to erasure - You have the right to request that the service provider erase your personal data, under certain conditions.</Typography>
                        <Typography variant="body2" component="p">8.1.5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The right to restrict processing - You have the right to request that the service provider restrict the processing of your personal data, under certain conditions.</Typography>
                        <Typography variant="body2" component="p">8.1.6&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The right to object to processing - You have the right to object to the service provider's processing of your personal data.</Typography>
                        <Typography variant="body2" component="p">8.1.7&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The right to data portability - You have the right to request that the service provider's transfers the data that we have collected to another organization, or directly to you, under certain conditions.</Typography>
                        <Typography variant="body2" component="p">8.2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us at our email: privacy@fxblooms.com</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">9. Privacy policies of other websites</Typography>
                        <Typography variant="body2" component="p">9.1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The service provider's website contains links to other websites. Our privacy policy applies only to our website, so if you click on a link to another website, you should read their privacy policy.</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">10. Privacy policies of other websites</Typography>
                        <Typography variant="body2" component="p">10.1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The service provider keeps its privacy policy under regular review and places any updates on this web page, changes take place immediately after they have been published on the website.</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">11. How to contact us?</Typography>
                        <Typography variant="body2" component="p">11.1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If you have any questions about the service provider's privacy policy, the data we hold on you, or you would like to exercise one of your data protection rights, please do not hesitate to contact us.</Typography>
                        <Typography variant="body2" component="p">11.2.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Email us at: privacy@fxblooms.com</Typography>
                        <Typography variant="body2" component="p">11.3.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You have the right to have access to your personal data at any time and to have it corrected, closed or deletion, unless otherwise provided by law.</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">12. How to contact us?</Typography>
                        <Typography variant="body2" component="p">12.1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Complaints and Disputes</Typography>
                        <Typography variant="body2" component="p">12.2.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; If you wish to report a complaint or if you feel that the service provider has not addressed your concern in a satisfactory manner, you may contact the supervisory authority – Estonian Data Protection Inspectorate at info@aki.ee</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">The service provider presumes that the customer has understood and accepted the terms of current "Privacy policy" and "Terms and conditions" before using the website and "User Agreement" before using the services.</Typography>
                        <Typography variant="body2" component="p">COOKIE POLICY</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">1.  FXBLOOMS OÜ (hereinafter referred as to the service provider) uses cookies on this website.</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">2. What are Cookies?</Typography>
                        <Typography variant="body2" component="p">2.1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cookies are small text files placed on your computer to collect standard internet log information and visitor behavior information. When you visit our website, we may collect information from you automatically through cookies or similar technology. We use the following cookies on our website:</Typography>
                        <Typography variant="body2" component="p">2.2.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;session cookies which are temporary and expire once you close your browser (or once your session ends)</Typography>
                        <Typography variant="body2" component="p">2.3.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;persistent cookies which are cookies that remain on your hard drive until you erase them or your browser does, depending on the cookie’s expiration date.</Typography>
                        <Typography variant="body2" component="p">2.4.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For further information, visit <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" target="_blank" rel="noreferrer">https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies</a></Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">3. How do we use cookies?</Typography>
                        <Typography variant="body2" component="p">3.1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The service provider uses cookies in a range of ways to improve your experience on our website, including:</Typography>
                        <Typography variant="body2" component="p">3.1.1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Collecting anonymous and general statistics about the number of website visitors</Typography>
                        <Typography variant="body2" component="p">3.1.2.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Understanding how you use our website</Typography>
                        <Typography variant="body2" component="p">3.1.3.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Making the website more user-friendly</Typography>
                        <Typography variant="body2" component="p">3.1.4.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To carry out technical improvements</Typography>
                        <Typography variant="body2" component="p">3.1.5.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To enable certain functions of the service</Typography>
                        <Typography variant="body2" component="p">3.1.6.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To provide analytics</Typography>
                        <Typography variant="body2" component="p">3.1.7.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To store your preferences</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">4. What types of cookies do we use?</Typography>
                        <Typography variant="body2" component="p">4.1.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;When you use and access the service, we may place a number of cookie files in your web browser. We use both functionality and advertising cookies on the website and different types of cookies to run the website.</Typography>
                        <Typography variant="body2" component="p">4.2.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;There are a number of different types of cookies, however, our website uses:</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">4.2.1. Functionality cookies – The service provider uses these cookies so that we recognize you on our website and remember your previously selected preferences. These include what language you prefer and location you are in. These cookies are temporary and expire once you close your browser (or once your session ends).</Typography>
                        <Typography variant="body2" component="p">4.2.2. Advertising cookies – The service provider owner uses these cookies to collect information about your visit to our website, the content you viewed, the links you followed and information about your browser, device, and your IP address. The service provider may share some limited aspects of this data with third parties for advertising purposes. We may also share online data collected through cookies with our advertising partners. This means that when you visit another website, you may be shown advertising based on your browsing patterns on our website.</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="body2" component="p">5. How to manage cookies?</Typography>
                        <Typography variant="body2" component="p">5.1. You can set your browser not to accept cookies, and the above website tells you how to remove cookies from your browser. However, in a few cases, some of our website features may not function as a result.</Typography>
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
};

export default PrivacyPolicy;