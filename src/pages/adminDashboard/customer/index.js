import { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { getCountries } from '../../../actions/countries'; 
import { getCustomerInformation } from '../../../actions/customer'; 
import { getDocuments } from '../../../actions/documents';

import { COLORS } from '../../../utils/constants';

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

const Customer = (props) => {
    const classes = useStyles();
    const { countries, documents } = useSelector(state => state);
    const { profile } = useSelector(state => state.customer);
    
    useEffect(() => {
        if (_.isEmpty(profile)) {
            props.getCustomerInformation();
        }
        if (countries.length === 0) {
            props.getCountries();
        }
        if (documents.length === 0) {
            props.getDocuments();
        }
        // eslint-disable-next-line
    }, []);

    return (
        <section className={classes.root}>
            <Grid container direction="row" justify="space-between" className={classes.header}>
                <Grid item xs={12} lg={6}>
                    <Typography variant="h6">User Details (VERIFIED)</Typography>
                </Grid>
                <Grid item alignSelf="center" xs={12} lg={6}>
                    <div className={classes.buttonContainer}>
                        <Button variant="outlined" size="large" className={clsx(classes.button, classes.deactivateButton)}>Deactivate</Button>
                        <Button variant="contained" size="large" className={clsx(classes.button, classes.removeButton)}>Remove</Button>
                        
                        {/* <Button variant="outlined" size="large" className={clsx(classes.button, classes.deactivateButton)}>Decline</Button>
                        <Button variant="contained" size="large" color="primary" className={classes.button}>Approve</Button> */}
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
    getCountries: PropTypes.func.isRequired,
    getCustomerInformation: PropTypes.func.isRequired,
    getDocuments: PropTypes.func.isRequired
};

export default connect(undefined, { getCountries, getCustomerInformation, getDocuments })(Customer);