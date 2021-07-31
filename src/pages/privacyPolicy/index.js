import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Layout from '../../components/layout';

import { COLORS } from '../../utils/constants';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(8.1),
        padding: [[theme.spacing(2), theme.spacing(10), theme.spacing(5), theme.spacing(10)]],

        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(7),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        },

        '& h4': {
            fontWeight: 500,
            marginBottom: theme.spacing(10)
        },

        '& p': {
            color: COLORS.offBlack,
            fontSize: theme.spacing(1.8),
            fontWeight: 300,
            lineHeight: 1.5,
            marginTop: theme.spacing(2),
            textAlign: 'justify'
        },

        '& span': {
            marginLeft: theme.spacing(1)
        },

        '& ol': {
            [theme.breakpoints.down('sm')]: {
                paddingLeft: theme.spacing(4)
            }
        },

        '& ul li': {
            color: COLORS.offBlack,
            listStyleType: 'disc',
            fontWeight: 300,
            // border: '1px solid red',
            // marginBottom: theme.spacing(4),

            // '&::first-line': {
            //     color: 'red'
            // }
        },

        '& ol li': {
            // border: '1px solid red',
            color: COLORS.offBlack,
            fontWeight: 300,
            marginBottom: theme.spacing(4),
        }
    }
}));

const Index = () => {
    const classes = useStyles();

    return (
        <Layout
            title="Privacy Policy"
            description="Security of your data is important to us at FXBLOOMS. Here is our privacy policy."
        >
            <section className={classes.root}>
                <Typography variant="h4">Privacy Policy</Typography>
                <Typography variant="subtitle1" component="p">
                    FXBLOOMS OÜ takes the protection of your personal data very seriously. We handle your personal data confidentiality and pursuant to the statutory data protection regulations and this privacy policy. This policy set out on this page is used to inform our app users and website visitors of how their personal data is managed by FXBLOOMS.
                </Typography>
                <Typography variant="subtitle1" component="p">
                    If you choose to use our Service, then you agree to the collection and use of information in relation with this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy. Please read it carefully. We would like to point out that data transfer on the Internet (for example when communicating by email) may have security vulnerabilities. It is not possible to provide 100% protection for your data from access by third parties.
                </Typography>
                <Typography variant="subtitle1" component="p">
                    The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at fxblooms.com, unless otherwise defined in this Privacy Policy.
                </Typography>
                <ol>
                    <li>
                        <Typography variant="subtitle2" component="span">Who We Are</Typography>
                        <Typography variant="subtitle1" component="p">
                            For the purpose of this document, the data controller is FXBLOOMS OÜ (“we”, “our” and “us”), a company incorporated in Estonia with company registration code is 16262446. In case you have any questions regarding this privacy policy or how your personal data is gathered, stored, shared or used, kindly contact our privacy policy team on privacy@fxblooms.com.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="subtitle2" component="span">The Reason We Collect Information</Typography>
                        <Typography variant="subtitle1" component="p">
                            There are various reasons why we collect, process and store your information. An example is we would like to be sure of the identity of our users or we would like to store your record for audits, regulatory or compliance purposes. Your personal information is needed to ensure  we provide a functional website, content and services.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="subtitle2" component="span">The Information We Collect</Typography>
                        <Typography variant="subtitle1" component="p">
                            The types of personal information we process ourselves  or through other third party services includes but not limited to your email address, first name, last name, date of birth, telephone number, copies of ID, contact details, cookie identifiers, security details to protect identity, nationality, data usage, as well as the data communicated while using the service and application. This information (both the one you give us about you or others provide to us about you) may be added to any personal information we already hold and we will use it in the ways described in this Data Privacy Notice.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="subtitle2" component="span">How We Use The Information Collected About You</Typography>
                        <br /><br />
                        We use the information collected.
                        <br /><br />
                        <ul>
                            <li>To facilitate your onboarding process as a user</li>
                            <li>To provide our product and contract to you based on the obligations in the contract between us and you.</li>
                            <li>To verify your identity and eligibility for our product and service</li>
                            <li>To carry out regulatory requirements and compliance obligations.</li>
                            <li>To inform you about changes in the service we provide.</li>
                            <li>To verify your identity at ID verification companies or agencies. Note that the third party involved may keep the record of such verification.</li>
                            <li>To protect our business and other users, this includes but not limited to , prevention of fraud and other crimes, detection of  fraud.</li>
                            <li>To record or report contractual breach of our terms and agreements.</li>
                            <li>To facilitate complaints, customer support and service.</li>
                            <li>For business processes including but not limited to data analysis, evaluation of products, services, and campaigns.</li>
                            <li>To manage our legitimate interests and protect our reputation.</li>
                            <li>To comply with regulation both legal and business</li>
                        </ul>
                    </li>
                    <li>
                        <Typography variant="subtitle2" component="span">Duration of Data Storage</Typography>
                        <Typography variant="subtitle1" component="p">
                            Your information will be collected and stored for as long as required by the purpose they have been collected for. For example, data collected to meet the contractual obligation between us and the users will be retained until such contractual obligation is not valid anymore. Once the retention period is over, all personal data will be deleted.
                        </Typography>
                        <Typography variant="subtitle1" component="p">
                            In a situation where information is provided while reporting an issue with our service, we will keep such information until the issue is resolved and future occurrence is fully prevented. Where marketing or other information are sent to you, the contact details are stored until you opt out by withdrawing your consent or unsubscribing.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="subtitle2" component="span">Cookies</Typography>
                        <Typography variant="subtitle1" component="p">
                            Cookies are files with a small amount of data that is commonly used as an anonymous unique identifier. These are sent to your browser from the website that you visit and are stored on your computer’s hard drive.
                        </Typography>
                        <Typography variant="subtitle1" component="p">
                            Our website uses these "cookies" to collect information and to improve our Service. Cookies also assist us in the fight against fraud. You have the option to either accept or refuse these cookies, and know when a cookie is being sent to your computer. If you choose to refuse our cookies, you may not be able to use some portions of our Service.
                        </Typography>
                        <Typography variant="subtitle1" component="p">
                            For more general information on cookies, please read <a href="https://www.privacypolicyonline.com/what-are-cookies/" target="_blank" rel="noreferrer">"What Are Cookies".</a>
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="subtitle2" component="span">Service Providers</Typography>
                        <br /><br />
                        We may employ third-party companies and individuals due to the following reasons:
                        <br /><br />
                        <ul>
                            <li>To facilitate our Service;</li>
                            <li>To provide the Service on our behalf;</li>
                            <li>To perform Service-related services; or</li>
                            <li>To assist us in analyzing how our Service is used.</li>
                        </ul>
                        <Typography variant="subtitle1" component="p">
                            We want to inform our Service users that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="subtitle2" component="span">Security</Typography>
                        <Typography variant="subtitle1" component="p">
                            We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="subtitle2" component="span">Links to Other Sites</Typography>
                        <Typography variant="subtitle1" component="p">
                            Our Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="subtitle2" component="span">Children's Privacy</Typography>
                        <Typography variant="subtitle1" component="p">
                            Our Services do not address anyone under the age of 13. We do not knowingly collect personal identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="subtitle2" component="span">Protecting and Disclosing your information</Typography>
                        <Typography variant="subtitle1" component="p">
                            We only share your personal data with trusted partners, and only as necessary. Examples of partners or individuals we can share your data with include but not limited to banking partners, identity verification companies, payment gateway, hosting services, our attorney or representative (under a Power of Attorney), legal advisors, regulatory bodies, Statutory and regulatory bodies (including central and local government) and law enforcement authorities as well as correspondent banks and other financial institutions. Your personal data will only be shared partners who commit to secure and protect your data.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="subtitle2" component="span">Why You Should Provide Us Your Data</Typography>
                        <Typography variant="subtitle1" component="p">
                            The collection of and storage of your personal data of mutual benefit and done in both your interest and ours. We need your personal data In order to ensure  a functional website, content and services.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="subtitle2" component="span">Your Information Rights</Typography>
                        <br /><br />
                        Collecting and storing of your personal data comes with significant rights on your part, and a lot of responsibility on our side. You have several rights in relation to the collection, usage and storage of your personal data. These rights include:
                        <br /><br />
                        <ul>
                            <li>Right to information,</li>
                            <li>Right to restriction of processing,</li>
                            <li>Right to object use of data</li>
                            <li>Right to data erasure and deletion,</li>
                            <li>Right to data portability</li>
                            <li>Right to complain to the relevant supervisory authority</li>
                            <li>Right to revocation of consent declarations</li>
                            <li>Right to withdrawal of consent</li>
                        </ul>
                        <Typography variant="subtitle1" component="p">
                            We are obliged to respond to your data enquiry or request without undue delay. We should respond in most cases within 30 days, and if we are not able to, we may extend to 60 days and provide you the reason for such extension. If you make a request electronically, we will, where possible, reply electronically unless you request us otherwise.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="subtitle2" component="span">Changes to this Policy</Typography>
                        <Typography variant="subtitle1" component="p">
                            We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="subtitle2" component="span">Contact Us</Typography>
                        <Typography variant="subtitle1" component="p">
                            If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.
                        </Typography>
                        <Typography variant="subtitle1" component="p">
                            Last updated: 8th of August 2021
                        </Typography>
                    </li>
                </ol>
            </section>
        </Layout>
    );
};

export default Index