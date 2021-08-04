import { Link } from 'react-router-dom';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PlayCircle } from 'mdi-material-ui';

import { SIGN_UP } from '../../routes';
import banner from '../../assets/img/banner.png';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(8.1),
        paddingLeft: theme.spacing(15),

        [theme.breakpoints.down('lg')]: {
            paddingBottom: theme.spacing(5),
            paddingLeft: theme.spacing(10),
        },

        [theme.breakpoints.down('md')]: {
            paddingLeft: 0
        },
        
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(4),
            marginTop: theme.spacing(7),
        }
    },

    hero: {
        height: '100%',
        paddingLeft: theme.spacing(5),
        
        [theme.breakpoints.down('sm')]: {
            paddingLeft: 0
        }
    },

    banner: {
        [theme.breakpoints.down('md')]: {
            display: 'none'
        },

        '& img': {
            width: '100%'
        }
    },

    text: {
        '& h1': {
            fontWeight: 300,
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
        },

        '& h6': {
            width: '95%'
        }
    },

    highlight: {
        color: theme.palette.primary.main
    },

    getStarted: {
        paddingBottom: theme.spacing(2),
        paddingTop: theme.spacing(2)
    }
}));

const Hero = () => {
    const classes = useStyles();

    return (
        <section className={classes.root}>
            <Grid container direction="row" spacing={10} className={classes.hero}>
                <Grid item sm={12} lg={6} xl={6} className={classes.text}>
                    <Grid container direction="row" spacing={3} alignItems="center">
                        <Grid item xs={12}>
                            <Typography variant="h1">
                                Decentralized Money Exchange
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6">
                                FXBLOOMS is a <span className={classes.highlight}>peer-to-peer</span> 
                                currency exchange platform that gives you the freedom to exchange money
                                <span className={classes.highlight}> seemlessly and securely</span> at <span className={classes.highlight}>any rate you desire</span>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button 
                                classes={{ root: classes.getStarted }}
                                variant="contained" 
                                component={Link} 
                                color="primary" 
                                to={SIGN_UP}
                                size="large"
                                fullWidth
                            >
                                Get Started
                            </Button>                            
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button 
                                component={Link} 
                                color="primary" 
                                to={SIGN_UP}
                                size="large"
                                fullWidth
                            >
                                <PlayCircle />
                                <strong>See how it works</strong>
                            </Button>                            
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item sm={12} lg={6} xl={6} className={classes.banner}>
                    <img src={banner} alt="FXBLOOMS" />
                </Grid>
            </Grid>
        </section>
    );
};

export default Hero;