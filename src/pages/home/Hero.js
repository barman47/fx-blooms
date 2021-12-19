import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS } from '../../utils/constants';
import { SIGN_UP } from '../../routes';
import banner from '../../assets/img/banner.jpg';
import patterns from '../../assets/img/logo-pattern.png';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100vw',
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        // position: 'relative',
        // position: 'absolute',
        // zIndex: -1

        [theme.breakpoints.down('md')]: {
            gridTemplateColumns: '1fr',
            height: '80vh',
        }
    },

    left: {
        backgroundImage: `url(${patterns})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: theme.spacing(12),
        paddingRight: theme.spacing(12),
        width: 'initial',
        height: '100%',

        [theme.breakpoints.down('sm')]: {
            alignItems: 'flex-start',
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            width: 'initial',
        },

        '& div': {
            display: 'grid',
            gridTemplateRows: 'repeat(3, 1fr)',
            alignItems: 'center',
            // rowGap: theme.spacing(1),

            
            [theme.breakpoints.down('sm')]: {
                rowGap: theme.spacing(2),
            },

            '& h3': {
                color: COLORS.offWhite,
                fontWeight: 600,

                [theme.breakpoints.down('sm')]: {
                    fontSize: theme.spacing(3.5)
                },
            },

            '& p': {
                color: COLORS.offWhite,
                fontWeight: 300,
            },
        }
    },

    right: {
        backgroundImage: `url(${banner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%',

        [theme.breakpoints.down('md')]: {
            display: 'none',
        }
    },

    button: {
        justifySelf: 'flex-start',

        [theme.breakpoints.down('sm')]: {
            justifySelf: 'stretch',
        }
    }
}));

const Hero = () => {
    const classes = useStyles();
    const { isAuthenticated } = useSelector(state => state.customer);

    return (
        <section className={classes.root}>
            <div className={classes.left}>
                <div>
                    <Typography variant="h3">Decentralized<br /> Money Exchange</Typography>
                    <Typography variant="subtitle2" component="p">FXBLOOMS is a peer-to-peer currency exchange platform that empowers you to exchange money seamlessly and securely at your desired rate.</Typography>
                    {!isAuthenticated && <Button to={SIGN_UP} component={Link} variant="contained" color="primary" className={classes.button}>GET STARTED</Button>}
                </div>
            </div>
            <div className={classes.right}></div>
        </section>
    );
};

export default Hero;