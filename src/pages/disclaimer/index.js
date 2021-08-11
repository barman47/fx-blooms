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

        '& div': {
            marginBottom: theme.spacing(5)
        },

        '& h4': {
            fontWeight: 500,
        },
        
        '& small': {
            color: COLORS.offBlack,
            display: 'inline-block',
            fontWeight: 300,
            marginBottom: theme.spacing(5)
        },

        '& p': {
            fontSize: theme.spacing(1.8),
            fontWeight: 300,
            lineHeight: 1.5,
            marginTop: theme.spacing(2),
            textAlign: 'justify'
        },

        '& span': {
            marginLeft: theme.spacing(1)
        },

        '& ul li': {
            color: COLORS.offBlack,
            listStyleType: 'disc',
            fontWeight: 300
        }
    },

    title: {
        marginBottom: theme.spacing(4)
    }
}));

const Index = () => {
    const classes = useStyles();

    return (
        <Layout
            title="Disclaimer"
            // description="Security of your data is important to us at FXBLOOMS. Here is our privacy policy."
        >
            <section className={classes.root}>
                <Typography variant="h4">Disclaimer</Typography>
                <Typography variant="subtitle2" component="small">Last updated: August 15th, 2021</Typography>
                <Typography variant="h5" className={classes.title}>Interpretation and Definitions</Typography>
                <div>
                    <Typography variant="h6">Interpretation</Typography>
                    <Typography variant="subtitle1" component="p">
                        The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                    </Typography>
                </div>
                <Typography variant="h6">Interpretation</Typography>
                <Typography variant="subtitle1" component="p">
                    For the purposes of this Disclaimer:
                </Typography>
                <div>
                    <ul>
                        <li>
                            <Typography variant="subtitle1" component="p">
                                Company (referred to as either "the Company", "We", "Us" or "Our" in this Disclaimer) refers to FXBLOOMS OÜ, Harju maakond, Tallinn, Kesklinna linnaosa, Narva mnt 7, 10117 Estonia.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="subtitle1" component="p">
                                Service refers to the Application.
                            </Typography>
                            <Typography variant="subtitle1" component="p">
                                You mean the individual accessing the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.
                            </Typography>
                            <Typography variant="subtitle1" component="p">
                                Application means the software program provided by the Company downloaded by You on any electronic device named FXBLOOMS.
                            </Typography>
                        </li>
                    </ul>
                </div>
                <div>
                    <Typography variant="h5">Disclaimer</Typography>
                    <Typography variant="subtitle1" component="p">
                        The information contained on the Service is for general information purposes only.
                    </Typography>
                    <Typography variant="subtitle1" component="p">
                        The Company assumes no responsibility for errors or omissions in the contents of the Service.
                    </Typography>
                    <Typography variant="subtitle1" component="p">
                        In no event shall the Company be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service. The Company reserves the right to make additions, deletions, or modifications to the contents on the Service at any time without prior notice. This Disclaimer has been created with the help of the Disclaimer Generator.
                    </Typography>
                    <Typography variant="subtitle1" component="p">
                        The Company does not warrant that the Service is free of viruses or other harmful components.
                    </Typography>
                </div>
                <div>
                    <Typography variant="h5">External Links Disclaimer</Typography>
                    <Typography variant="subtitle1" component="p">
                        The Service may contain links to external websites that are not provided or maintained by or in any way affiliated with the Company.
                    </Typography>
                    <Typography variant="subtitle1" component="p">
                        Please note that the Company does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
                    </Typography>
                </div>
                <div>
                    <Typography variant="h5">Errors and Omissions Disclaimer</Typography>
                    <Typography variant="subtitle1" component="p">
                        The information given by the Service is for general guidance on matters of interest only. Even if the Company takes every precaution to ensure that the content of the Service is both current and accurate, errors can occur. Plus, given the changing nature of laws, rules and regulations, there may be delays, omissions or inaccuracies in the information contained on the Service.
                    </Typography>
                    <Typography variant="subtitle1" component="p">
                        The Company is not responsible for any errors or omissions, or for the results obtained from the use of this information.
                    </Typography>
                </div>
                <div>
                    <Typography variant="h5">Fair Use Disclaimer</Typography>
                    <Typography variant="subtitle1" component="p">
                        The Company may use copyrighted material which has not always been specifically authorized by the copyright owner. The Company is making such material available for criticism, comment, news reporting, teaching, scholarship, or research.
                    </Typography>
                    <Typography variant="subtitle1" component="p">
                        The Company believes this constitutes a "fair use" of any such copyrighted material as provided for in section 107 of the United States Copyright law.
                    </Typography>
                    <Typography variant="subtitle1" component="p">
                        If You wish to use copyrighted material from the Service for your own purposes that go beyond fair use, You must obtain permission from the copyright owner.
                    </Typography>
                </div>
                <div>
                    <Typography variant="h5">Views Expressed Disclaimer</Typography>
                    <Typography variant="subtitle1" component="p">
                        The Service may contain views and opinions which are those of the authors and do not necessarily reflect the official policy or position of any other author, agency, organization, employer or company, including the Company.
                    </Typography>
                    <Typography variant="subtitle1" component="p">
                        Comments published by users are their sole responsibility and the users will take full responsibility, liability and blame for any libel or litigation that results from something written in or as a direct result of something written in a comment. The Company is not liable for any comment published by users and reserve the right to delete any comment for any reason whatsoever.
                    </Typography>
                </div>
                <div>
                    <Typography variant="h5">No Responsibility Disclaimer</Typography>
                    <Typography variant="subtitle1" component="p">
                        The information on the Service is provided with the understanding that the Company is not herein engaged in rendering legal, accounting, tax, or other professional advice and services. As such, it should not be used as a substitute for consultation with professional accounting, tax, legal or other competent advisers.
                    </Typography>
                    <Typography variant="subtitle1" component="p">
                        In no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever arising out of or in connection with your access or use or inability to access or use the Service.
                    </Typography>
                </div>
                <div>
                    <Typography variant="h5">"Use at Your Own Risk" Disclaimer</Typography>
                    <Typography variant="subtitle1" component="p">
                        All information in the Service is provided "as is", with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance, merchantability and fitness for a particular purpose.
                    </Typography>
                    <Typography variant="subtitle1" component="p">
                        The Company will not be liable to You or anyone else for any decision made or action taken in reliance on the information given by the Service or for any consequential, special or similar damages, even if advised of the possibility of such damages.
                    </Typography>
                </div>
                <div>
                    <Typography variant="h5">Contact Us</Typography>
                    <Typography variant="subtitle1" component="p">
                        If you have any questions about this Disclaimer, You can contact Us:
                    </Typography>
                    <Typography variant="subtitle1" component="p">
                        By email: <a href="mailto:hello@fxblooms.com">hello@fxblooms.com</a>
                    </Typography>
                </div>
            </section>
        </Layout>
    );
};

export default Index