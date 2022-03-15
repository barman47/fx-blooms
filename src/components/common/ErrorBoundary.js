import { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Grid, Typography, makeStyles, } from '@material-ui/core';

import { CONTACT_US } from '../../routes';

import logo from '../../assets/img/logo.svg';

const useStyles = makeStyles(theme => ({
    logo: {
        margin: [[theme.spacing(2), 0, 0, theme.spacing(2)]]
    },

    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
        width: '100vw'
    },

    gridContainer: {
        width: '50%',

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(0, 2),
            width: '100%'
        },

        '& h4': {
            fontWeight: 600
        },

        '& p': {
            fontWeight: 300
        },
    },
    
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
}));

const ErrorPage = () => {
    const classes = useStyles();

    return (
        <>
            <Helmet>
                <title>Error | FXBLOOMS.com</title>
            </Helmet>
            <img src={logo} alt="FXBLOOMS Logo" className={classes.logo} />
            <Box component="section" className={classes.root}>
                <Grid container direction="row" spacing={4} className={classes.gridContainer}>
                    <Grid item xs={12}>
                        <Typography variant="h4" align="center">Oops! Something went wrong</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" component="p" align="center">Sorry this link is broken, kindly try again or contact support.</Typography>
                    </Grid>
                    <Grid xs={12}>
                        <Box component="div" className={classes.buttonContainer}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="medium"
                                disableRipple
                                disableFocusRipple
                                component={RouterLink}
                                to="/"
                            >
                                Take Me Home
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="large"
                                disableRipple
                                disableFocusRipple
                                component={RouterLink}
                                to={CONTACT_US}
                            >
                                Contact Us
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
    }

    render () {
        if (this.state.hasError) {
            return <ErrorPage />
        }
        return this.props.children;
    }
}

export default ErrorBoundary;