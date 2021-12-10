import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Box, Tab, Tabs, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Account, BagChecked, CardAccountDetailsOutline, LockOutline } from 'mdi-material-ui';

import { getCountries } from '../../../actions/countries'; 
import { getCustomerInformation } from '../../../actions/customer'; 
import { getAccounts } from '../../../actions/bankAccounts';
import { getDocuments } from '../../../actions/documents'; 

import { COLORS } from '../../../utils/constants'; 

import BankAccounts from '../bankAccount/BankAccounts';
import PersonalDetails from './PersonalDetails';
import IDVerification from './IDVerification';
import TwoFactor from '../twoFactor';

const useStyles = makeStyles(theme =>({
    root: {
        display: 'grid',
        gridTemplateColumns: '1fr 4fr',
        padding: [[theme.spacing(15), theme.spacing(10), 0, theme.spacing(10)]],
        gap: theme.spacing(5),

        [theme.breakpoints.down('sm')]: {
            padding: [[theme.spacing(1), theme.spacing(2), theme.spacing(5), theme.spacing(2)]],
        }
    },

    tabContainer: {
        backgroundColor: COLORS.lightTeal,
        borderTopLeftRadius: theme.spacing(3),
        borderBottomLeftRadius: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'flex-start',
        padding: theme.spacing(4, 0)
    },

    tabs: {
        // marginTop: theme.spacing(10),
        width: '100%',

        '& .MuiTab-wrapper': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start'
        }
    },

    tabLabel: {
        textAlign: 'left',
        textTransform: 'capitalize',
        fontWeight: 600
    },

    selectedTab: {
        backgroundColor: theme.palette.primary.main,
        border: 'none !important',
        color: COLORS.offWhite,

        '& .MuiTab-wrapper': {
            color: COLORS.offWhite,
        }
    },

    icon: {
        postion: 'relative',
        top: '10px'
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

function LinkTab(props) {
    return (
        <Tab
            component={RouterLink}
            onClick={(event) => {
            event.preventDefault();
            }}
            {...props}
        />
    );
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
            <div className={classes.tabContainer}>
                <Tabs
                    value={value} 
                    onChange={handleChange} 
                    aria-label="fund-tabs" 
                    indicatorColor="primary" 
                    textColor="primary" 
                    // variant="fullWidth" 
                    className={classes.tabs}
                    orientation="vertical"
                    variant="scrollable"
                >
                    <LinkTab 
                        label={
                            <>
                                <Account className={classes.icon} />&nbsp;&nbsp;&nbsp;
                                <Typography variant="subtitle1" component="p" className={classes.tabLabel}>Profile</Typography>
                            </>
                        } 
                        {...a11yProps(0)} 
                        classes={{ selected: classes.selectedTab }}
                        disableRipple
                        disableFocusRipple
                    />
                    <LinkTab 
                        label={
                            <>
                                <LockOutline className={classes.icon} />&nbsp;&nbsp;&nbsp;
                                <Typography variant="subtitle1" component="p" className={classes.tabLabel}>2FA Setup</Typography>
                            </>
                        } 
                        {...a11yProps(1)} 
                        classes={{ selected: classes.selectedTab }}
                        disableRipple
                        disableFocusRipple
                    />
                    <LinkTab 
                        label={
                            <>
                                <BagChecked className={classes.icon} />&nbsp;&nbsp;&nbsp;
                                <Typography variant="subtitle1" component="p" className={classes.tabLabel}>Bank Account</Typography>
                            </>
                        } 
                        {...a11yProps(2)} 
                        classes={{ selected: classes.selectedTab }}
                        disableRipple
                        disableFocusRipple
                    />
                    <LinkTab 
                        label={
                            <>
                                <CardAccountDetailsOutline className={classes.icon} />&nbsp;&nbsp;&nbsp;
                                <Typography variant="subtitle1" component="p" className={classes.tabLabel}>ID Verification</Typography>
                            </>
                        } 
                        {...a11yProps(3)} 
                        classes={{ selected: classes.selectedTab }}
                        disableRipple
                        disableFocusRipple
                    />
                    {/* <LinkTab 
                        label={
                            <>
                                <KeyVariant className={classes.icon} />&nbsp;&nbsp;&nbsp;
                                <Typography variant="subtitle1" component="p" className={classes.tabLabel}>Set PIN</Typography>
                            </>
                        } 
                        {...a11yProps(3)} 
                        classes={{ selected: classes.selectedTab }}
                        disableRipple
                        disableFocusRipple
                    /> */}
                </Tabs>
            </div>
            <div>
                <TabPanel value={value} index={0}>  
                    <PersonalDetails />
                </TabPanel>
                <TabPanel value={value} index={1}>  
                    <TwoFactor />
                </TabPanel>
                <TabPanel value={value} index={2}>  
                    <BankAccounts />
                </TabPanel>
                <TabPanel value={value} index={3}>  
                    <IDVerification />
                </TabPanel>
            </div>
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