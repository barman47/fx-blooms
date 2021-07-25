import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SIGN_UP } from '../../routes';

import img from '../../assets/img/about.png';

const useStyles = makeStyles(theme => ({
    root: {
        padding: [[theme.spacing(5), theme.spacing(10)]],

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(3)
        }
    },

    left: {
        display: 'grid',
        gridTemplateColumns: '1fr'
    },

    text: {
        fontWeight: 300
    },

    img: {
        width: '100%'
    }
}));

const AboutUs = () => {
    const classes = useStyles();

    return (
        <Grid container direction="row" spacing={5} className={classes.root}>
            <Grid item xs={12} lg={5}>
                <Grid container direction="column" spacing={5}>
                    <Grid item>
                        <Typography variant="h2">About Us</Typography>
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
                <img src={img} className={classes.img} alt="About FXBLOOMS" />
            </Grid>
        </Grid>
    );
};

export default AboutUs;