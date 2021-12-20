import { Link as RouterLink } from 'react-router-dom';
import { 
    Divider, 
    Link, 
    IconButton,
    Tooltip,
    Typography,
    Zoom 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Instagram, Linkedin, Twitter, Telegram } from 'mdi-material-ui';
import { Link as AnimatedLink, animateScroll as scroll } from 'react-scroll';
import clsx from 'clsx';

import { BLOG, DISCLAIMER, TERMS, PRIVACY_POLICY, FAQS, ABOUT_US, LOGIN, SIGN_UP, CONTACT_US } from '../../routes';
import { COLORS } from '../../utils/constants';

import logo from '../../assets/img/logo-white.svg';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.black,
        color: COLORS.offWhite,
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(4),
        padding: [[theme.spacing(5), theme.spacing(15)]],

        [theme.breakpoints.down('md')]: {
            alignItems: 'center',
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        },

        '& span:last-child': {
            fontWeight: 300,

            [theme.breakpoints.down('sm')]: {
                display: 'inline-block',
                width: '100%'
            }
        },
    },

    logo: {
        cursor: 'pointer',
        [theme.breakpoints.down('md')]: {
            margin: '0 auto 20px auto',
            width: 'initial'
        }
    },

    content: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
        gap: theme.spacing(5),
        
        [theme.breakpoints.down('md')]: {
            gap: theme.spacing(2)
        },

        [theme.breakpoints.down('sm')]: {
            gap: theme.spacing(5),
            gridTemplateColumns: '1fr 1fr',
        },
        
        '& div': {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: theme.spacing(2),

            '& h6': {
                marginBottom: theme.spacing(2)
            },

            '& span:first-child': {
                fontWeight: 200
            }
        },

        '& div:first-child': {
            [theme.breakpoints.down('md')]: {
                gridColumn: '1 / span 2'
            }
        }
    },

    link: {
        color: COLORS.offWhite,
        cursor: 'pointer',
        fontWeight: 200,
        textDecoration: 'none',

        '&:hover': {
            textDecoration: 'underline',
        }
    },

    socialContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)'
    },

    social: {
        color: COLORS.white,
    },

    divider: {
        borderTop: `1px solid ${COLORS.offBlack}`
    },

    copyright: {
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        }
    }
}));

const Footer = () => {
    const classes = useStyles();

    return (
        <footer className={classes.root}>
            <section className={classes.content}>
                <div>
                    <img src={logo} className={classes.logo} alt="FX Blooms Logo" onClick={() => scroll.scrollToTop} />
                    <Typography variant="subtitle2" component="span">
                        FXBLOOMS OÜ (Registry code: 16262446) is a company acting as a Commercial Agent and located at Harju maakond, Tallinn, Lasnamäe linnaosa, Tuha tn 3, 11415 Estonia.
                    </Typography>
                </div>
                <div>
                    <Typography variant="h6">Company</Typography>
                    <AnimatedLink 
                        to={ABOUT_US} 
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                        className={classes.link}
                        >
                            About us
                    </AnimatedLink>
                    <a className={classes.link} target="_blank" href={PRIVACY_POLICY} rel="noreferrer">Privacy Policy</a>
                    <a className={classes.link} target="_blank" href={TERMS}  rel="noreferrer">Terms &amp; Conditions</a>
                    <a className={classes.link} target="_blank" href={DISCLAIMER}  rel="noreferrer">Disclaimer</a>
                </div>
                <div>
                    <Typography variant="h6">Users</Typography>
                    <Link className={classes.link} underline="hover" to={LOGIN} component={RouterLink}>Login</Link>
                    <Link className={classes.link} underline="hover" to={SIGN_UP} component={RouterLink}>Sign Up</Link>
                    <Link className={classes.link} underline="hover" to={BLOG} target="_blank" component={RouterLink}>Blog</Link>
                </div>
                <div>
                    <Typography variant="h6">Help</Typography>
                    <a className={classes.link} target="_blank" href={FAQS}  rel="noreferrer">FAQs</a>
                    <a className={classes.link} target="_blank" href={CONTACT_US}  rel="noreferrer">Contact Us</a>
                </div>
                <div>
                    <Typography variant="h6">Connect</Typography>
                    <a className={classes.link} href="mailto:hello@fxblooms.com">hello@fxblooms.com</a>
                    <a className={classes.link} href="tel:+37255617440">+372 5561 7440</a>
                    <section className={classes.socialContainer}>
                        <Tooltip title="Follow FXBLOOMS on Instagram" TransitionComponent={Zoom} TransitionProps={{ timeout: 300 }} arrow>
                            <IconButton 
                                className={clsx(classes.linkedInIcon, classes.social)}
                                onClick={() => {
                                    window.open('https://www.instagram.com/fxblooms/', '_blank', 'noopener,noreferrer')
                                }}
                            >
                                <Instagram />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Connect with us on LinkedIn" TransitionComponent={Zoom} TransitionProps={{ timeout: 300 }} arrow>
                            <IconButton 
                                className={clsx(classes.linkedInIcon, classes.social)}
                                onClick={() => {
                                    window.open('https://www.linkedin.com/company/fxblooms/', '_blank', 'noopener,noreferrer')
                                }}
                            >
                                <Linkedin />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Follow us Twitter" TransitionComponent={Zoom} TransitionProps={{ timeout: 300 }} arrow>
                            <IconButton 
                                className={clsx(classes.linkedInIcon, classes.social)}
                                onClick={() => {
                                    window.open('https://twitter.com/FXBLOOM1', '_blank', 'noopener,noreferrer')
                                }}
                            >
                                <Twitter />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Connect with us on Telegram" TransitionComponent={Zoom} TransitionProps={{ timeout: 300 }} arrow>
                            <IconButton 
                                className={clsx(classes.linkedInIcon, classes.social)}
                                onClick={() => {
                                    window.open('https://t.me/joinchat/4zNq4cJg-fA1NjFi', '_blank', 'noopener,noreferrer')
                                }}
                            >
                                <Telegram />
                            </IconButton>
                        </Tooltip>
                    </section>
                </div>
            </section>
            <Divider className={classes.divider} />
            <Typography variant="subtitle2" component="span" className={classes.copyright}>
                FXBLOOMS O&#220; 16262446, Estonia. &copy; {new Date().getFullYear()} All rights reserved.
            </Typography>  
        </footer>
    );
};

export default Footer;