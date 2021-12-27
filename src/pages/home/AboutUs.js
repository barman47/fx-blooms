import { Link } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import YouTube from 'react-youtube';

import { ABOUT_US } from '../../routes';
import { COLORS } from '../../utils/constants';
import patterns from '../../assets/img/logo-pattern.png';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundImage: `url(${patterns})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: [[theme.spacing(5), theme.spacing(10)]],

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(3)
        }
    },

    content: {
        display: 'grid',
        gap: theme.spacing(5),
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',

        [theme.breakpoints.down('md')]: {
            gridTemplateColumns: '1fr'
        },

        '& div:first-child': {
            '& h3': {
                color: COLORS.offWhite,
                fontWeight: 600,
                marginBottom: theme.spacing(5),
    
                [theme.breakpoints.down('sm')]: {
                    fontSize: theme.spacing(3.5),
                    textAlign: 'center'
                }
            }
        }
    },

    text: {
        color: COLORS.offWhite,
        fontWeight: 300
    },

    button: {
        marginTop: theme.spacing(5),

        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
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
        }
    };

    const onReady = (e) => {
        // access to player in all event handlers via e.target
        e.target.pauseVideo();
    };

    return (
        <section className={classes.root} id={ABOUT_US}>
            <div className={classes.content}>
                <div>
                    <Typography variant="h3">What is FXBLOOMS?</Typography>
                    <Typography variant="subtitle2" className={classes.text}>FXBLOOMS is a market place for peer-to-peer exchange of currencies.</Typography>
                    <Typography variant="subtitle2" className={classes.text}>We are fully committed to making currency exchange more accessible, secure and seamless.</Typography>
                    <Button component={Link} to={ABOUT_US} color="primary" variant="contained" className={classes.button}>ABOUT US</Button>
                </div>    
                <YouTube className={classes.video} videoId="0gfyjfo7GO0" opts={opts} onReady={onReady} />
            </div>
        </section>
    );
};

export default AboutUs;