import { Link } from 'react-router-dom';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { SIGN_UP } from '../../routes';

import { COLORS } from '../../utils/constants';

import listing1 from '../../assets/img/listing1.png';
import listing2 from '../../assets/img/listing2.png';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.lightTeal,
        marginTop: theme.spacing(8.1),
        paddingLeft: theme.spacing(15),
        [theme.breakpoints.down('lg')]: {
            paddingLeft: theme.spacing(10),
        },
        [theme.breakpoints.down('md')]: {
            
        },
        [theme.breakpoints.down('lg')]: {
            paddingLeft: theme.spacing(10),
        },
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(4),
            marginTop: theme.spacing(7),
        }
    },

    hero: {
        height: '100%'
    },

    text: {
        '& h2': {
            fontStyle: 'italic',
            fontWeight: 700,
            margin: [[theme.spacing(35), 0, theme.spacing(5), 0]],

            [theme.breakpoints.down('lg')]: {
                fontSize: theme.spacing(5),
                marginTop: theme.spacing(23)
            },

            [theme.breakpoints.down('md')]: {
                marginTop: theme.spacing(2)
            },

            [theme.breakpoints.down('sm')]: {
                fontSize: theme.spacing(4),
                marginTop: 0
            }
        }
    },

    listings: {
        display: 'flex',
        flexDirection: 'column',
        maxHeight: theme.spacing(132),
        position: 'relative',
        top: 0,
        left: 0,

        [theme.breakpoints.down('lg')]: {
            maxHeight: theme.spacing(96)
        },
        
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        },
    },

    listing1: {
        position: 'relative',
        top: 0,
        right: 0,
        zIndex: 1,
        width: '100%',
        [theme.breakpoints.down('md')]: {
            width: '80%'
        }
    },

    listing2: {
        backgroundColor: COLORS.lightTeal,
        position: 'relative',
        top: -theme.spacing(45),
        right: theme.spacing(20),
        width: '50%',

        [theme.breakpoints.down('lg')]: {
            right: theme.spacing(12),
            top: -theme.spacing(30)
        },
        [theme.breakpoints.down('md')]: {
            top: -theme.spacing(35),
            width: '50%'
        }
    },
}));

const Hero = () => {
    const classes = useStyles();

    return (
        <section className={classes.root}>
            <Grid container direction="row" className={classes.hero}>
                <Grid item sm={12} lg={6} xl={6} className={classes.text}>
                    <Typography variant="h2">
                        Organise projects.<br />
                        Get more done.
                    </Typography>
                    <Button variant="contained" component={Link} color="primary" to={SIGN_UP}>Get Started</Button>
                </Grid>
                <Grid item sm={12} lg={6} xl={6} className={classes.listings}>
                    <img src={listing1} className={classes.listing1} alt="FX Blooms Listing" />
                    <img src={listing2} className={classes.listing2} alt="FX Blooms Listing" />
                </Grid>
            </Grid>
        </section>
    );
};

export default Hero;