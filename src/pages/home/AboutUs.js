import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import YouTube from 'react-youtube';

import { ABOUT_US, SIGN_UP } from '../../routes';

const useStyles = makeStyles(theme => ({
    root: {
        padding: [[theme.spacing(5), theme.spacing(10)]],

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(3)
        }
    },

    left: {
        width: '80%',

        '& h3': {
            fontWeight: 300
        }
    },

    text: {
        fontWeight: 300
    },

    video: {
        width: '100%'
    }
}));

const AboutUs = () => {
    const classes = useStyles();

    const opts = {
        // height: '390',
        // width: '640',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
            color: 'white',
            playsinline: 1
        },
    };

    const onReady = (e) => {
        // access to player in all event handlers via e.target
        e.target.pauseVideo();
      }

    return (
        <Grid container direction="row" spacing={10} className={classes.root} id={ABOUT_US}>
            <Grid item xs={12} lg={4} className={classes.left}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Typography variant="h3">About Us</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2" className={classes.text}>FXBLOOMS is a market place for peer-to-peer exchange of currencies.</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2" className={classes.text}>We are fully committed to making currency exchange more accessible, secure and seamless.</Typography>
                    </Grid>
                    <Grid item>
                        <Button to={SIGN_UP} component={RouterLink} color="primary" size="large">Get Started</Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} lg={7}>
                <YouTube className={classes.video} videoId="71YM28sN0vE" opts={opts} onReady={onReady} />
            </Grid>
        </Grid>
    );
};

export default AboutUs;