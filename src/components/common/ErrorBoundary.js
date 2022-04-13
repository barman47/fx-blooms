import { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Button, Grid, Typography, makeStyles, } from '@material-ui/core';

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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

export const ErrorFallback = ({ handleReset }) => {
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
                        <Typography variant="body2" component="p" align="center">Sorry this link is broken, kindly try again or <a href="mailto:support@fxblooms.com">contact support</a>.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Box component="div" className={classes.buttonContainer}>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="large"
                                disableRipple
                                disableFocusRipple
                                onClick={handleReset}
                            >
                                Try Again
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
        console.log(error);
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false });
    }

    render () {
        if (this.state.hasError) {
            return <ErrorFallback handleReset={this.handleReset} />
        }
        return this.props.children;
    }
}

export default ErrorBoundary;