import { Link as RouterLink } from 'react-router-dom';
import { Grid, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Eye, LightningBolt } from 'mdi-material-ui';

import listing from '../../assets/img/listing1.png';

import { COLORS, SHADOW } from '../../utils/constants';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.lightTeal,
        padding: [[theme.spacing(7), theme.spacing(5)]],
        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },

    item: {
        backgroundColor: COLORS.white,
        borderRadius: theme.shape.borderRadius,
        boxShadow: SHADOW,
        maxHeight: 'inherit',
        padding: theme.spacing(2),

        '& p:first-child': {
            borderRadius: '25px',
            color: theme.palette.primary.main,
            fontSize: theme.spacing(1.7),
            fontWeight: 600,
            marginBottom: theme.spacing(2),
            padding: [[theme.spacing(0.5), theme.spacing(2), theme.spacing(1), theme.spacing(2)]],
            backgroundColor: COLORS.lightTeal,
        },

        '& p:nth-child(2)': {
            fontWeight: 300,
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
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        } 
    }
}));

const Features = () => {
    const classes = useStyles();
    return (
        <Grid container direction="row" className={classes.root}>
            <Grid item xs={12} lg={6}>
                {/* <section className={classes.root}> */}
                <Grid container direction="row" spacing={3}>
                    <Grid item xs={12} md={6}>
                        <div className={classes.item}>
                            <Typography variant="subtitle1" component="P">
                                <Eye className={classes.icon} />
                                &nbsp;&nbsp;
                                No hidden charges
                            </Typography>
                            <Typography variant="subtitle1" component="p">We are built upon honesty and openness - we provide the maximum transparency to our customers</Typography>
                            <Link component={RouterLink} underline="none" className={classes.link}>Get Started</Link>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div className={classes.item}>
                            <Typography variant="subtitle1" component="p">
                                <LightningBolt className={classes.icon} />
                                &nbsp;&nbsp;
                                Quick and timely transactions
                            </Typography>
                            <Typography variant="subtitle1" component="p">We understand that each transaction is important. Thus, we make it happen as soon as possible.</Typography>
                            <Link component={RouterLink} underline="none" className={classes.link}>Get Started</Link>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div className={classes.item}>
                            <Typography variant="subtitle1" component="p">
                                <Eye className={classes.icon} />
                                &nbsp;&nbsp;
                                No middlemen
                            </Typography>
                            <Typography variant="subtitle1" component="P">We guarantee better rates by cutting out middlemen and hidden charges</Typography>
                            <Link component={RouterLink} underline="none" className={classes.link}>Get Started</Link>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div className={classes.item}>
                            <Typography variant="subtitle1" component="P">
                                <Eye className={classes.icon} />
                                &nbsp;&nbsp;
                                Take control of YOUR money
                            </Typography>
                            <Typography variant="subtitle1" component="P">Freedom to exchange at your desired rate</Typography>
                            <Link component={RouterLink} underline="none" className={classes.link}>Get Started</Link>
                        </div>
                    </Grid>
                {/* </section> */}
                </Grid>
            </Grid>
            <Grid item xs={12} lg={6} className={classes.imgContainer}>
                <img src={listing} alt="Sample Listing" />
            </Grid>
        </Grid>
    );
};

export default Features;