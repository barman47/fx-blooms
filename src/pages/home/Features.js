import { Link as RouterLink } from 'react-router-dom';
import { Grid, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Cancel, CarTurbocharger, Eye, LightningBolt } from 'mdi-material-ui';

import listing from '../../assets/img/listing.png';

import { COLORS } from '../../utils/constants';
import { SIGN_UP, WHY } from '../../routes';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.lightTeal,
        padding: [[theme.spacing(7), 0, theme.spacing(7), theme.spacing(5)]],

        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },

    left: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: theme.spacing(4),
        height: '100%',
        // justifyContenty: 'stretch',
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr',
        }
    },

    item: {
        backgroundColor: COLORS.white,
        borderRadius: '10px',
        boxShadow: '0px 4px 24px rgba(30, 98, 98, 0.24)',
        alignSelf: 'stretch',
        padding: theme.spacing(2),

        '& p:first-child': {
            borderRadius: '25px',
            color: theme.palette.primary.main,
            fontSize: theme.spacing(1.7),
            fontWeight: 800,
            marginBottom: theme.spacing(2),
            padding: [[theme.spacing(0.5), theme.spacing(2), theme.spacing(1), theme.spacing(2)]],
            backgroundColor: COLORS.lightTeal,
        },

        '& p:nth-child(2)': {
            fontWeight: 400,
            marginBottom: theme.spacing(2),
        }
    },

    icon: {
        position: 'relative',
        top: '8px'
    },

    link: {
        fontWeight: 600
    },

    imgContainer: {
        // border: '1px solid red',
        position: 'relative',
        // right: theme.spacing(-5),

        [theme.breakpoints.down('md')]: {
            display: 'none'
        },
        [theme.breakpoints.down('sm')]: {
            right: 0
        },

        '& img': {
            borderRadius: '10px',
            boxShadow: '0px 4px 24px rgba(30, 98, 98, 0.24)',
            width: '100%'
        }
    }
}));

const Features = () => {
    const classes = useStyles();
    return (
        <section className={classes.root} id={WHY}>
            <Grid container direction="row" spacing={5}>
                <Grid item xs={12} lg={6}>
                    <div className={classes.left}>
                        <div className={classes.item}>
                            <Typography variant="subtitle1" component="p">
                                <Eye className={classes.icon} />
                                &nbsp;&nbsp;
                                No hidden charges
                            </Typography>
                            <Typography variant="subtitle1" component="p">We are built upon honesty and openness - we provide the maximum transparency to our customers</Typography>
                            <Link to={SIGN_UP} component={RouterLink} underline="none" className={classes.link}>Get Started</Link>
                        </div>
                        <div className={classes.item}>
                            <Typography variant="subtitle1" component="p">
                                <LightningBolt className={classes.icon} />
                                &nbsp;&nbsp;
                                Quick and timely transactions
                            </Typography>
                            <Typography variant="subtitle1" component="p">We understand that each transaction is important. Thus, we make it happen as soon as possible.</Typography>
                            <Link to={SIGN_UP} component={RouterLink} underline="none" className={classes.link}>Get Started</Link>
                        </div>
                        <div className={classes.item}>
                            <Typography variant="subtitle1" component="p">
                            <Cancel className={classes.icon} />
                                &nbsp;&nbsp;
                                No middlemen
                            </Typography>
                            <Typography variant="subtitle1" component="p">We guarantee better rates by cutting out middlemen and hidden charges</Typography>
                            <Link to={SIGN_UP} component={RouterLink} underline="none" className={classes.link}>Get Started</Link>
                        </div>
                        <div className={classes.item}>
                            <Typography variant="subtitle1" component="p">
                                <CarTurbocharger className={classes.icon} />
                                &nbsp;&nbsp;
                                Take control of YOUR money
                            </Typography>
                            <Typography variant="subtitle1" component="p">Freedom to exchange at your desired rate</Typography>
                            <Link to={SIGN_UP} component={RouterLink} underline="none" className={classes.link}>Get Started</Link>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} lg={6} className={classes.imgContainer}>
                    <img src={listing} alt="Sample Listing" />
                </Grid>
            </Grid>
        </section>
    );
};

export default Features;