import { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { getCountries } from '../../../actions/countries'; 
import { getCustomerInformation } from '../../../actions/customer'; 
import { getDocuments } from '../../../actions/documents'; 

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
    }
}));

const Profile = (props) => {
    const classes = useStyles();
    const { countries, documents } = useSelector(state => state);
    const { profile } = useSelector(state => state.customer);

    const { getDocuments, getCountries, getCustomerInformation, handleSetTitle } = props;

    useEffect(() => {
        handleSetTitle('My Profile');
        // eslint-disable-next-line
    }, []);
    
    useEffect(() => {
        if (_.isEmpty(profile)) {
            getCustomerInformation();
        }
        if (countries.length === 0) {
            getCountries();
        }
        if (documents.length === 0) {
            getDocuments();
        }
        // eslint-disable-next-line
    }, []);

    return (
        <section className={classes.root}>
            <Typography variant="h6">My Profile</Typography>
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

Profile.propTypes = {
    getCountries: PropTypes.func.isRequired,
    getCustomerInformation: PropTypes.func.isRequired,
    getDocuments: PropTypes.func.isRequired,
    handleSetTitle: PropTypes.func.isRequired
};

export default connect(undefined, { getCountries, getCustomerInformation, getDocuments })(Profile);