import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { SET_CUSTOMER} from '../../../actions/types';
import { COLORS, CONFIRMED, PENDING } from '../../../utils/constants';

import PersonalDetails from './PersonalDetails';
import IdentityDetails from './IdentityDetails';

const useStyles = makeStyles(theme =>({
    root: {
        padding: [[theme.spacing(2), theme.spacing(3)]],

        [theme.breakpoints.down('sm')]: {
            padding: [[theme.spacing(1), theme.spacing(2), theme.spacing(5), theme.spacing(2)]],
        },

        '& h6': {
            fontWeight: 600
        }
    },

    container: {
        marginTop: theme.spacing(1)
    },

    buttonContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        columnGap: theme.spacing(1),
        marginTop: theme.spacing(2)
    },

    button: {
        padding: [[theme.spacing(2), theme.spacing(3)]]
    },

    deactivateButton: {
        borderColor: COLORS.red,
        color: COLORS.red,

        '&:hover': {
            backgroundColor: 'initial'
        }
    },

    removeButton: {
        color: COLORS.white,
        backgroundColor: COLORS.red,

        '&:hover': {
            backgroundColor: COLORS.red
        }
    },
}));

const Customer = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { customer } = useSelector(state => state.customers);
    
    useEffect(() => {
        return () => dispatch({ 
            type: SET_CUSTOMER,
            payload: {}
        });
        // eslint-disable-next-line
    }, []);

    return (
        <section className={classes.root}>
            <Grid container direction="row" justify="space-between" className={classes.header}>
                <Grid item xs={12} lg={6}>
                    {customer.customerStatus === PENDING && <Typography variant="h6">User Details (NEW)</Typography>}
                    {customer.customerStatus === CONFIRMED && <Typography variant="h6">User Details (VERIFIED)</Typography>}
                    
                </Grid>
                <Grid item xs={12} lg={6}>
                    <div className={classes.buttonContainer}>
                    {customer.customerStatus === PENDING && 
                        <>
                            <Button variant="outlined" size="large" className={clsx(classes.button, classes.deactivateButton)}>Decline</Button>
                            <Button variant="contained" size="large" color="primary" className={classes.button}>Approve</Button>
                        </>
                    }
                    {customer.customerStatus === CONFIRMED && 
                        <>
                            <Button variant="outlined" size="large" className={clsx(classes.button, classes.deactivateButton)}>Deactivate</Button>
                            <Button variant="contained" size="large" className={clsx(classes.button, classes.removeButton)}>Remove</Button>
                        </>
                    }
                    </div>
                </Grid>
            </Grid>
            <Grid container direction="row" spacing={3} className={classes.container}>
                <Grid item xs={12} lg={6}>
                    <PersonalDetails />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <IdentityDetails />
                </Grid>
            </Grid>
        </section>
    );
}

Customer.propTypes = {
    handleSetTitle: PropTypes.func.isRequired
};

export default Customer;