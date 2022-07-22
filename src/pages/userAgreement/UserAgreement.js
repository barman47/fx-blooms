import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { CheckBold } from 'mdi-material-ui';

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

        '& h6': {
            fontWeight: 600,
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
    },

    iconList: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: theme.spacing(2),
    },

    checkIcon: {
        color: '#1e6262',
        marginRight: theme.spacing(2),
        position: 'relative',
        top: '-3px' 
    },

    listItem: {
        color: COLORS.offBlack,
        fontWeight: 300,
        lineHeight: 1.5,
        marginBottom: theme.spacing(2)
    }
}));

const UserAgreement = () => {
    const classes = useStyles();

    return (
        <Layout
            title="User Agreement"
            // description="Your trusted P2P currency exchange platform. FXBLOOMS is committed to making currency exchange more accessible, secure and seamless."
        >
            <Box component="section" className={classes.root}>
                <Box component="header" className={classes.content}>
                    <Typography variant="h4">User Agreement</Typography>
                </Box>
                <Box component="section" className={classes.container}>
                    <Box component="div" className={classes.item}>
                        <Typography variant="h6">General</Typography>
                        <ol>
                            <li className={classes.listItem}>Services on this website are provided by FXBLOOMS OÜ (registry code 16262446), located at Harju maakond, Tallinn, Kesklinna linnaosa, Narva mnt 7, 10117 Estonia (hereinafter the Service Provider). The purpose of the following provisions in this user agreement (hereinafter the Agreement) is to govern legal relationship between the Service Provider and the person requesting account opening and access to using the services on the Website (hereinafter the User). The Agreement applies to the use of the Website and services provided by the Service Provider.</li>
                            <li className={classes.listItem}>The term "You" in the context of the Agreement refers to the User.</li>
                            <li className={classes.listItem}>Services refer to providing a digital platform for peer-to-peer currency exchange, where people find mutually interested other people who need to change currency for remittance and/or trading purposes.</li>
                            <li className={classes.listItem}>Currency refers to a value represented in the digital form, which is digitally transferable, preservable or tradable and which natural persons or legal persons accept as a payment instrument and that is recognized as the legal tender of a country or funds for the purposes of Article 4(25) of Directive (EU) 2015/2366 of the European Parliament and of the Council on payment services in the internal market, amending Directives 2002/65/EC, 2009/110/EC and 2013/36/EU and Regulation (EU) No 1093/2010, and repealing Directive 2007/64/EC (OJ L 337, 23.12.2015, pp 35–127).</li>
                            <li className={classes.listItem}>By confirming the User Agreement, the User asserts that it is capable of making decisions on the Selling the Currency and concluding User Agreements, as well as that it understands all risks including the risk not to recover the Sold Currency or any part thereof.</li>
                            <li className={classes.listItem}>The User is aware of and understands that third parties, who have obtained the User's password, can access the User's Profile and the User's Virtual Account and assume obligations on behalf of the User. If the User's Profile and the User's Account is used to carry out activities on the Platform using a correct User's e-mail address and password, it shall be considered that the activities with the respective User's Profile and User's Virtual Account have been performed by the User itself.</li>
                            <li className={classes.listItem}>Personal data is any information that relates to an identified or identifiable individual.</li>
                            <li className={classes.listItem}>Cookies are a small amount of data generated by a website and saved by User's web browser. Its purpose is to remember information about you, similar to a preference file created by a software application.</li>
                            <li className={classes.listItem}>Device could be any device with internet that can access the service such as a mobile phone, a computer or a digital tablet.</li>
                            <li className={classes.listItem}>The Service Provider communicates, forwards requests and contacts the User via email correspondence, in urgent cases that need immediate attention and/or action the Service Provider contacts the User by telephone.</li>
                        </ol>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="h6">RESTRICTIONS AND AGE REQUIREMENT</Typography>
                        <div className={classes.iconList}>
                            <CheckBold className={classes.checkIcon} />
                            <Typography variant="body2" component="p">You agree not to, and You will not permit others to:</Typography>
                        </div>
                        <ol>
                            <li className={classes.listItem}>is 18 years old or older;</li>
                            <li className={classes.listItem}>is of legal age in the User's jurisdiction and place of residence;</li>
                            <li className={classes.listItem}>there are no legal restrictions in the country of the User's residence to engage in activities related with sale and purchase of currencies in digital form.</li>
                            <li className={classes.listItem}>The User is not entitled to use a right of withdrawal for 14 days from the Agreement nor from transactions governed by the Agreement for providing services on the Website according to the Estonian Law of Obligations Act § 53 subsection 4.</li>
                        </ol>
                        <div className={classes.iconList}>
                            <CheckBold className={classes.checkIcon} />
                            <Typography variant="body2" component="p">The Service Provider is a limited liability company registered in Estonia. Access to the Website or services offered on the Website by certain persons or in certain countries may be contrary to the law. It is the User's responsibility to determine whether the use of the Website and/or services offered on the Website comply with the local applicable regulations.</Typography>
                        </div>
                        <div className={classes.iconList}>
                            <CheckBold className={classes.checkIcon} />
                            <Typography variant="body2" component="p">By using the Website and services provided through the Website, the User warrants that he/she:</Typography>
                        </div>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="h6">REGISTRATION AND THE ACCOUNT</Typography>
                        <div className={classes.iconList}>
                            <CheckBold className={classes.checkIcon} />
                            <Typography variant="body2" component="p">Upon registering account for using the services (hereinafter the Account) and when using the services, the User agrees to provide the Service Provider the following data:</Typography>
                        </div>
                        <ol>
                            <li className={classes.listItem}>first name and surname;</li>
                            <li className={classes.listItem}>ID document number;</li>
                            <li className={classes.listItem}>personal identification number (if issued);</li>
                            <li className={classes.listItem}>date of birth;</li>
                            <li className={classes.listItem}>ID document expiration date;</li>
                            <li className={classes.listItem}>ID document photograph;</li>
                            <li className={classes.listItem}>address;</li>
                            <li className={classes.listItem}>telephone number;</li>
                            <li className={classes.listItem}>biometrical data/face photograph;</li>
                            <li className={classes.listItem}>citizenship and country of origin;</li>
                            <li className={classes.listItem}>source and ownership of funds;</li>
                            <li className={classes.listItem}>device information and location;</li>
                            <li className={classes.listItem}>data concerning transactions (account owner, amount), use of services and all data related to payments, returns to settlement accounts and transfers;</li>
                            <li className={classes.listItem}>other data (beneficial owners, right of representation, information whether the person is a politically exposed person) that is required to be collected and verified by the Service Provider according to the requirements of the jurisdiction and legislation of residence of the Service Provider;</li>
                            <li className={classes.listItem}>based on the request of the Service Provider, the User may be obliged to submit additional documents and in a requested format, to ensure that the Service Provider meets the requirements derived from the jurisdiction and legislation of residence of the Service Provider.</li>
                        </ol>
                        <div className={classes.iconList}>
                            <CheckBold className={classes.checkIcon} />
                            <Typography variant="body2" component="p">The User warrants that:</Typography>
                        </div>
                        <ol>
                            <li className={classes.listItem}>he/she is the only person authorized to use the Account and shall not share the credentials that are used to access the Account with any other person and the User shall do everything within his/her power to prevent access of any other persons to the Account and is solely responsible for maintaining the confidentiality and security of the credentials of the Account;</li>
                            <li className={classes.listItem}>that data provided to the Service Provider for registering account is true, current and complete and the User is aware of the consequences arising from the submission of inaccurate data;</li>
                            <li className={classes.listItem}>he/she notifies the Service Provider if there are any changes or amendments in the personal data provided to the Service Provider.</li>
                            <li className={classes.listItem}>the Account shall not be used for illegal activities, including but not limited to money laundering, terrorist financing or any other unlawful activity;</li>
                            <li className={classes.listItem}>the Service Provider shall be notified immediately if the User has reasons to believe that the Account has been stolen, used for illegal activities or the User is not able to access the Account due to unknown reasons;</li>
                            <li className={classes.listItem}>he/she will cooperate with the Service Provider in a full capacity and timely manner within the process of gathering information and documents related to the User's identification and personal data, prevention and identification of money laundering and terrorist financing, and cases provided in the provisions of 3.2.4 and 3.2.5 of the Agreement;</li>
                            <li className={classes.listItem}>he/she has given a consent to transfer personal data to third party service providers that the Service Provider is using related to the fulfilment of its obligations and necessary features for seamless service provision;</li>
                        </ol>
                        <div className={classes.iconList}>
                            <CheckBold className={classes.checkIcon} />
                            <Typography variant="body2" component="p">The Service Provider reserves the right to decide whether to open the Account and conduct service provision without providing any justification or reasoning for a rejection.</Typography>
                        </div>
                        <div className={classes.iconList}>
                            <CheckBold className={classes.checkIcon} />
                            <Typography variant="body2" component="p">The Service Provider reserves the right in its sole and absolute discretion, without providing any justification or reasoning, to refuse to open, suspend or close the Account and/or limit access to the Website and services, especially in cases, including but not limited:</Typography>
                        </div>
                        <ol>
                            <li className={classes.listItem}>the User has provided the Service Provider personal data or information that is requested in relation to fulfilment of obligations derived from the requirements of the jurisdiction and legislation of residence of the Service Provider, and such personal data and information is untrue, false or expired;</li>
                            <li className={classes.listItem}>the User fails to provide or update personal data accordingly, also upon request of the Service Provider;</li>
                            <li className={classes.listItem}>the User fails to respond to the Service Provider's requests;</li>
                            <li className={classes.listItem}>due to suspicious activity that may relate to money laundering, terrorist financing or any other unlawful activity;</li>
                            <li className={classes.listItem}>the Account is being used by any person other than the User;</li>
                            <li className={classes.listItem}>due to technical errors.</li>
                            <li className={classes.listItem}>The Service Provider reserves the right to immediately close the Account, limit access to the Website and terminate the Agreement with the User without any prior notification or reasoning, if the Service Provider has reasons to believe that the account is being used for money laundering, terrorist financing or for any other unlawful activity.</li>
                        </ol>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="h6">SERVICES AND TAXES</Typography>
                        <div className={classes.iconList}>
                            <CheckBold className={classes.checkIcon} />
                            <Typography variant="body2" component="p">The Service Provider is obliged to provide the following services through the Website:</Typography>
                        </div>
                        <ol>
                            <li className={classes.listItem}>The Service Provider will facilitate orders, transactions and other actions necessary for the service provision with professional care, due diligence and according to its best knowledge.</li>
                            <li className={classes.listItem}>The User shall be responsible for determining his/her tax obligations as well as is being responsible for conducting tax filings to an appropriate tax authority and tax any income derived from exchanging currencies or from any of the provided services according to the applicable legislation of their place of residence.</li>
                            <li className={classes.listItem}>The Service Provider is not liable for withholding any taxes derived from the activities of using the Website or services.</li>
                        </ol>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="h6">PAYMENTS</Typography>
                        <ol>
                            <li className={classes.listItem}>Upon registering and using the services on the Website the User agrees to pay all fees or charges to that arise from making a deposit or using the services. You can find all fees related to the use of the Website and services from the table of fees.</li>
                            <li className={classes.listItem}>Unless otherwise indicated, the User shall provide the Service Provider with a valid credit/debit card (Visa, MasterCard, or any other issuer accepted by the Service Provider) (hereinafter referred to as Payment Provider) as a condition to deposit funds to the Account.</li>
                            <li className={classes.listItem}>The User's Payment Provider agreement governs the use of the designated credit/debit card account, and the User must refer to that agreement and not the provisions in the Agreement to determine the User's rights and liabilities with respect to User's Payment Provider.</li>
                            <li className={classes.listItem}>Upon providing the Service Provider with credit/debit card number and associated payment information, the User agrees that the Service Provider is authorized to verify information immediately, and correspondingly invoice the Account for all fees and charges due and payable to the Service Provider hereunder and that no additional notice or consent is required.</li>
                            <li className={classes.listItem}>The User agrees to immediately notify the Service Provider of any change in the User's billing address or the credit/debit card used for payment hereunder.</li>
                            <li className={classes.listItem}>The User reserves the right at any time to change its prices and billing methods, either immediately upon posting on the Website or by e-mail delivery to the Users. Any attorney fees, court costs, or other costs incurred in collection of delinquent undisputed amounts shall be the responsibility of and paid for by the User.</li>
                            <li className={classes.listItem}>The User is responsible for any third-party fees that the User may incur when using the Service.</li>
                        </ol>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="h6">THIRD PARTY SERVICES</Typography>
                        <ol>
                            <li className={classes.listItem}>The Service Provider may display, include or make available third-party content (including data, information, applications and other products/services) or provide links to third-party websites or services or use third parties in conducting its business (hereinafter Third-Party Services).</li>
                            <li className={classes.listItem}>The User acknowledges and agrees that the Service Provider shall not be responsible for any Third-Party Services, including their accuracy, completeness, timeliness, validity, copyright compliance, legality, decency, quality or any other aspect thereof, unless related to the fulfilment of the Service Provider's lawful obligations on personal data processing. The Service Provider does not assume and shall not have any liability or responsibility to the User or any other person or entity for any Third-Party Services.</li>
                            <li className={classes.listItem}>Third-Party Services and links thereto are provided solely as a convenience to the User and the User access and use them entirely at the User's own risk and subject to such third parties' terms and conditions.</li>
                        </ol>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="h6">PAYMENTS</Typography>
                        <ol>
                            <li className={classes.listItem}>Upon registering and using the services on the Website the User agrees to pay all fees or charges to that arise from making a deposit or using the services. You can find all fees related to the use of the Website and services from the table of fees.</li>
                            <li className={classes.listItem}>Unless otherwise indicated, the User shall provide the Service Provider with a valid credit/debit card (Visa, MasterCard, or any other issuer accepted by the Service Provider) (hereinafter referred to as Payment Provider) as a condition to deposit funds to the Account.</li>
                            <li className={classes.listItem}>The User's Payment Provider agreement governs the use of the designated credit/debit card account, and the User must refer to that agreement and not the provisions in the Agreement to determine the User's rights and liabilities with respect to User's Payment Provider.</li>
                            <li className={classes.listItem}>Upon providing the Service Provider with credit/debit card number and associated payment information, the User agrees that the Service Provider is authorized to verify information immediately, and correspondingly invoice the Account for all fees and charges due and payable to the Service Provider hereunder and that no additional notice or consent is required.</li>
                            <li className={classes.listItem}>The User agrees to immediately notify the Service Provider of any change in the User's billing address or the credit/debit card used for payment hereunder.</li>
                            <li className={classes.listItem}>The User reserves the right at any time to change its prices and billing methods, either immediately upon posting on the Website or by e-mail delivery to the Users. Any attorney fees, court costs, or other costs incurred in collection of delinquent undisputed amounts shall be the responsibility of and paid for by the User.</li>
                            <li className={classes.listItem}>The User is responsible for any third-party fees that the User may incur when using the Service.</li>
                        </ol>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="h6">TERM AND TERMINATION OF THE AGREEMENT</Typography>
                        <ol>
                            <li className={classes.listItem}>This Agreement shall remain in effect until terminated by the User or the Service Provider.</li>
                            <li className={classes.listItem}>The Service Provider may, in its sole discretion, at any time and for any or no reason, suspend or terminate this Agreement with or without prior notice.</li>
                            <li className={classes.listItem}>This Agreement will be terminated immediately, without prior notice from the Service Provider in the event that the User fails to comply with any provision of this Agreement.</li>
                            <li className={classes.listItem}>Termination of this Agreement will not limit the Service Provider's rights or remedies at law or in equity in case of breach by the User (during the term of this Agreement) of any of the User's obligations under the present Agreement.</li>
                            <li className={classes.listItem}>The User is entitled to terminate this Agreement at any time by requesting the Service Provider to close the Account by sending a written notice to support@fxblooms.com The Service Provider shall not close the Account in cases where there is an open investigation by the regulatory authority.</li>
                            <li className={classes.listItem}>The User is obliged to withdraw any funds from the Account within 30 days starting from date of termination notification submitted to the Service Provider. The Service Provider reserves the right to restrict access or refuse withdrawals from the Account if there are reasons to suspect or believe that the Account has been or is being used as described in the provisions 3.2.4, 3.2.5 and 3.2.6 or there is an open investigation by the regulatory authority.</li>
                        </ol>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="h6">INDEMNIFICATION</Typography>
                        <Typography variant="body2" component="p">You agree to indemnify and hold the Service Provider and its parents, subsidiaries, affiliates, officers, employees, agents, partners and licensors (if any) harmless from any claim or demand, including reasonable attorneys' fees, arising out of the User's use of the website or violation of any right of a third party.</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="h6">NO WARRANTIES</Typography>
                        <ol>
                            <li className={classes.listItem}>The Website is provided to You „as is" and „as available" and with all faults and defects without warranty of any kind.</li>
                            <li className={classes.listItem}>To the maximum extent permitted under applicable law, the Service Provider, on its own behalf and on behalf of its affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the website, including all implied warranties or merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice.</li>
                            <li className={classes.listItem}>Without limitation, the Service Provider provides no warranty or undertaking, and makes no representation of any kind that the Website will meet the User's requirements, achieve any intended results, be compatible or work with any other software, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected.</li>
                        </ol>
                        <div className={classes.iconList}>
                            <CheckBold className={classes.checkIcon} />
                            <Typography variant="body2" component="p">Without limitation, the Service Provider shall not make any representation or warranty of any kind, express or implied:</Typography>
                        </div>
                        <ol>
                            <li className={classes.listItem}>as to the operation or availability of the Website, or the information, content, and materials or products included thereon;</li>
                            <li className={classes.listItem}>that the Website will be uninterrupted or error-free;</li>
                            <li className={classes.listItem}>as to the accuracy, reliability, or currency of any information or content provided through the Website;</li>
                            <li className={classes.listItem}>that the Website, its servers, the content, or e-mails sent from or on behalf of the Service Provider are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.</li>
                        </ol>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="h6">LIMITATION OF LIABILITY</Typography>
                        <ol>
                            <li className={classes.listItem}>Not withstanding any damages that the User might incur, the entire liability of the Service Provider and any of its suppliers under any provision of this Agreement and the User's exclusive remedy for all of the foregoing shall be limited to the amount actually paid by the User for the use of the Website and the services contained therein.</li>
                            <li className={classes.listItem}>To the maximum extent permitted by applicable law, in no event shall the Service Provider or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, for loss of data or other information, for business interruption, for personal injury, for loss of privacy arising out of or in any way related to the use of or inability to use the Website, third-party software and/or third-party hardware used with the Website, or otherwise in connection with any provision of this Agreement), even if the Service Provider or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.</li>
                        </ol>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="h6">FORCE MAJEURE</Typography>
                        <Typography variant="body2" component="p">The Service Provider is not held responsible to fulfil or to partially fulfil any obligations under this Agreement if such failure has occurred as a result of any abnormal or unforeseeable circumstance outside the Service Provider's reasonable control and that could not be envisaged, escaped, or eliminated, including but not limited to governmental action and acts that have affected the activities of the Service Provider, political unrest, strikes, declared and undeclared wars and acts of God.</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="h6">SEVERABILITY</Typography>
                        <Typography variant="body2" component="p">If any provision of this Agreement is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="h6">WAIVER</Typography>
                        <Typography variant="body2" component="p">Except as provided herein, the failure to exercise a right or to require performance of an obligation under this Agreement shall not affect a party's ability to exercise such right or require such performance at any time thereafter nor constitute waiver of any subsequent breach.</Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="h6">PRIVACY POLICY</Typography>
                        <Typography variant="body2" component="p">
                            In order to operate the Website, the Service Provider employs third party service providers that may process personal data for the purpose of providing services (e.g. facilitating transactions and processing personal data) and/or for the purpose of complying with legal obligations. The Service Provider undertakes to adhere to best practices and principles of personal data processing, compliant with all applicable legislation, including the European Union General Data Protection Regulation. Any personal data processed shall be processed in a fair and transparent manner. The Service Provider limits the amount of personal data collected to what is required for efficient operation of the Website. The Service Provider implements security measures necessary to ensure the confidentiality, security and integrity of collected personal data.
                            Details on how personal data is collected, stored, secured and processed is described in the Privacy Policy of the Service Provider which is an integral part of the basis for the service provision.
                        </Typography>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="h6">DISCLAIMER</Typography>
                        <ol>
                            <li className={classes.listItem}>The Service Provider is not responsible for any content, code or any other imprecision.</li>
                            <li className={classes.listItem}>The Service Provider does not provide warranties or guarantees.</li>
                            <li className={classes.listItem}>In no event shall the Service Provider be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Website or services or the contents of the Website or services.</li>
                            <li className={classes.listItem}>The Service Provider reserves the right to make additions, deletions, or modifications to the contents on the Website and services at any time without prior notice.</li>
                        </ol>
                    </Box>
                    <Box component="div" className={classes.item}>
                        <Typography variant="h6">FINAL PROVISIONS</Typography>
                        <Typography variant="body2" component="p">* The Agreement constitutes the entire agreement between the User and the Service Provider regarding use of the Website and services, and supersedes all prior and contemporaneous written or oral agreements between the User and the Service Provider</Typography>
                        <ol>
                            <li className={classes.listItem}>All matters relating to the Website or any particular services offered on the Website and all matters related to the Agreement and any claims or disputes arising therefrom or related thereto, shall be governed by the laws of Estonia without giving effect to any choice or conflict of law provision or rule.</li>
                            <li className={classes.listItem}>The Harju County Court shall have an exclusive jurisdiction to solve any disputes or claims if it is not possible to settle them in an extrajudicial manner or by a negotiation.</li>
                        </ol>
                        <Typography variant="body2" component="p">The Service Provider presumes that the User has understood and accepted the current "User Agreement", "Privacy policy" and "Terms and Conditions" before using the Website and services.</Typography>
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
};

export default UserAgreement;