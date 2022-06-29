import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
    Box,
    Button,
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import { GET_ERRORS } from '../../../actions/types';
import { WALLETS } from '../../../routes';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',

        '& div': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '80%'
        },

        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center',
            padding: theme.spacing(1),
        }
    },

    button: {
        marginTop: theme.spacing(3)
    }

}));

const FundingFailure = ({ handleSetTitle }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        handleSetTitle('Funding Failed');
        dispatch({
            type: GET_ERRORS,
            payload: {}
        });
        // eslint-disable-next-line
    }, []);

    return (
        <Box component="section" className={classes.root}>
            <Box component="div">
                <Typography variant="h6" color="secondary" className={classes.pageTitle}>Something Went Wrong!</Typography>
                <Typography variant="body2" component="p">An error occured while processing your fund. If your funds do not reflect in your wallet after a couple of minutes, kindly try again.</Typography>
                <Button 
                    to={WALLETS}
                    component={Link}
                    variant="contained" 
                    color="primary" 
                    size="large"
                    className={classes.button}
                    disableRipple
                    disableFocusRipple
                    disableTouchRipple
                >
                    Go to Wallet
                </Button>
            </Box>
        </Box>
    );
};

FundingFailure.propTypes = {
    handleSetTitle: PropTypes.func.isRequired
};

export default FundingFailure;