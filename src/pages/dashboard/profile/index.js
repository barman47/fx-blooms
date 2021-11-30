import { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Box, Button, Grid, Tab, Tabs, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { getCountries } from '../../../actions/countries'; 
import { getCustomerInformation } from '../../../actions/customer'; 
import { getAccounts } from '../../../actions/bankAccounts';
import { getDocuments } from '../../../actions/documents'; 

import { COLORS } from '../../../utils/constants'; 

import BankAccounts from './BankAccounts';
import PersonalDetails from './PersonalDetails';
import IdentityDetails from './IdentityDetails';

const useStyles = makeStyles(theme =>({
    root: {
        padding: [[theme.spacing(10), theme.spacing(3)]],

        [theme.breakpoints.down('sm')]: {
            padding: [[theme.spacing(1), theme.spacing(2), theme.spacing(5), theme.spacing(2)]],
        }
    },

    container: {
        marginTop: theme.spacing(1),

        '& h6': {
            fontWeight: 600
        }
    },

    tabs: {
        borderBottom: `1px solid ${COLORS.borderColor}`,
    },

    tabLabel: {
        textTransform: 'capitalize',
        fontWeight: 600
    }
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
            <Box p={3}>
                <Typography>{children}</Typography>
            </Box>
            )}
        </div>
    );
}
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `fund-tabs-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Profile = (props) => {
    const classes = useStyles();
    const { countries, documents } = useSelector(state => state);
    const { customerId, profile } = useSelector(state => state.customer);
    const { accounts } = useSelector(state => state.bankAccounts);

    const { getAccounts, getDocuments, getCountries, getCustomerInformation, handleSetTitle } = props;

    const [value, setValue] = useState(0);

    useEffect(() => {
        handleSetTitle('Profile');
        if (accounts.length === 0) {
            getAccounts(customerId);
        }
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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <section className={classes.root}>
            <Grid container direction="row" spacing={3} className={classes.container}>
                <Grid item xs={6}>
                    <Typography variant="h6">Profile</Typography>
                </Grid>
                {value === 0 && 
                    <Grid item xs={6} justifySelf="flex-end">
                        <Button variant="outlined" color="primary">Edit Details</Button>
                    </Grid>
                }
                <Grid item xs={8}>
                    <Tabs value={value} onChange={handleChange} aria-label="fund-tabs" indicatorColor="primary" textColor="primary" variant="fullWidth" className={classes.tabs}>
                        <Tab 
                            label={
                                <Typography variant="subtitle1" component="p" className={classes.tabLabel}>Bio Details</Typography>
                            } 
                            {...a11yProps(0)} 
                            disableRipple
                        />
                        <Tab 
                            label={
                                <Typography variant="subtitle1" component="p" className={classes.tabLabel}>Bank Accounts</Typography>
                            } 
                            {...a11yProps(1)} 
                            disableRipple
                        />
                        <Tab 
                            label={
                                <Typography variant="subtitle1" component="p" className={classes.tabLabel}>Verification &amp; Security</Typography>
                            } 
                            {...a11yProps(1)} 
                            disableRipple
                        />
                    </Tabs>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <TabPanel value={value} index={0}>  
                        <PersonalDetails />
                    </TabPanel>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <TabPanel value={value} index={0}>  
                        <IdentityDetails />
                    </TabPanel>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <TabPanel value={value} index={0}>  
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            // disabled={editable ? false : true}
                        >
                            Submit
                        </Button>
                    </TabPanel>
                </Grid>
                <Grid item xs={12} lg={12}>
                    <TabPanel value={value} index={1}>  
                        <BankAccounts />
                    </TabPanel>
                </Grid>
            </Grid>
        </section>
    );
}

Profile.propTypes = {
    getAccounts: PropTypes.func.isRequired,
    getCountries: PropTypes.func.isRequired,
    getCustomerInformation: PropTypes.func.isRequired,
    getDocuments: PropTypes.func.isRequired,
    handleSetTitle: PropTypes.func.isRequired
};

export default connect(undefined, { getAccounts, getCountries, getCustomerInformation, getDocuments })(Profile);