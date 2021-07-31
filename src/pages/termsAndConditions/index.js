import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Layout from '../../components/layout';

import { COLORS } from '../../utils/constants';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.lightTeal,
        marginTop: theme.spacing(8.1),
        padding: [[theme.spacing(2), theme.spacing(10), theme.spacing(10), theme.spacing(10)]],

        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(7),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        },

        '& h4': {
            fontWeight: 500,
            marginBottom: theme.spacing(10)
        },

        '& h6': {
            fontWeight: 600,
            marginTop: theme.spacing(5)
        },

        '& p': {
            color: COLORS.offBlack,
            fontSize: theme.spacing(1.8),
            fontWeight: 400,
            lineHeight: 1.5,
            marginTop: theme.spacing(3),
            textAlign: 'justify'
        }
    }
}));

const Index = () => {
    const classes = useStyles();

    return (
        <Layout
            title="Terms &amp; Conditions"
            // description="Your trusted P2P currency exchange platform. FXBLOOMS is committed to making currency exchange more accessible, secure and seamless."
        >
            <section className={classes.root}>
                <Typography variant="h4">Terms &amp; Conditions</Typography>
                <Typography variant="h6">Introduction</Typography>
                <Typography variant="subtitle2" component="p">
                    We are a social network and online platform for professionals. People use our Services to find and be found for business opportunities, to connect with others and find information. Our Privacy Policy applies to any Member or Visitor to our Services.
                </Typography>
                <Typography variant="subtitle2" component="p">
                    Our registered users (“Members”) share their professional identities, engage with their network, exchange knowledge and professional insights, post and view relevant content, learn and develop skills, and find business and career opportunities. Content and data on some of our Services is viewable to non-members (“Visitors”).
                </Typography>
                <Typography variant="subtitle2" component="p">
                    We use the term “Designated Countries” to refer to countries in the European Union (EU), European Economic Area (EEA), and Switzerland.
                </Typography>
                <Typography variant="subtitle2" component="p">
                    Services
                </Typography>
                <Typography variant="h6">
                    This Privacy Policy, including our Cookie Policy applies to your use of our Services.
                </Typography>
                <Typography variant="subtitle2" component="p">
                    This Privacy Policy applies to LinkedIn.com, LinkedIn-branded apps, LinkedIn Learning and other LinkedIn-related sites, apps, communications and services (“Services”), including off-site Services, such as our ad services and the “Apply with LinkedIn” and “Share with LinkedIn” plugins, but excluding services that state that they are offered under a different privacy policy. For California residents, additional disclosures required by California law may be found in our California Privacy Disclosure.
                    Data Controllers and Contracting Parties.
                </Typography>
                <Typography variant="subtitle2" component="p">
                    If you are in the “Designated Countries”, LinkedIn Ireland Unlimited Company (“LinkedIn Ireland”) will be the controller of your personal data provided to, or collected by or for, or processed in connection with our Services.
                </Typography>
                <Typography variant="subtitle2" component="p">
                    If you are outside of the Designated Countries, LinkedIn Corporation will be the controller of your personal data provided to, or collected by or for, or processed in connection with, our Services.
                </Typography>
                <Typography variant="subtitle2" component="p">
                    As a Visitor or Member of our Services, the collection, use and sharing of your personal data is subject to this Privacy Policy and other documents referenced in this Privacy Policy, as well as updates.
                </Typography>
            </section>
        </Layout>
    );
};

export default Index