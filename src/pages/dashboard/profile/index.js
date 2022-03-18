import { useEffect, useState } from 'react';
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Box, Tab, Tabs, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Account, BagChecked, CardAccountDetailsOutline, History, LockOutline, Logout } from 'mdi-material-ui';

import { getCountries } from '../../../actions/countries'; 
import { getCustomerInformation, logout } from '../../../actions/customer'; 
import { getAccounts } from '../../../actions/bankAccounts';
import { getDocuments } from '../../../actions/documents'; 

import { COLORS } from '../../../utils/constants'; 

import BankAccounts from '../bankAccount/BankAccounts';
import Transactions from '../transactions';
import PersonalDetails from './PersonalDetails';
import IDVerification from './IDVerification';
import TwoFactor from '../twoFactor';
import AccountSettingsDrawer from '../../../components/common/AccountSettingsDrawer';

const useStyles = makeStyles(theme =>({
    root: {
        display: 'grid',
        gridTemplateColumns: '1fr 4fr',
        padding: [[theme.spacing(15), theme.spacing(10), 0, theme.spacing(10)]],
        gap: theme.spacing(5),

        [theme.breakpoints.down('md')]: {
            gridTemplateColumns: '1fr',
            padding: [[theme.spacing(10), theme.spacing(1), 0, theme.spacing(1)]]
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
        padding: theme.spacing(4, 0),

        [theme.breakpoints.down('md')]: {
            display: 'none',
        }
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

export const TabPanel = (props) => {
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

export const a11yProps = (index) => {
    return {
        id: `fund-tabs-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const LinkTab = (props) => {
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

let setTabValue;
let setOpenDrawer;
let isDrawerOpen;

export const handleChange = (event, newValue) => {
    setTabValue(newValue);
    return newValue;
};

export const toggleDrawer = () => {
    setOpenDrawer(!isDrawerOpen);
};

const Profile = (props) => {
    const history = useHistory();

    const classes = useStyles();
    const location = useLocation();
    const { countries, documents } = useSelector(state => state);
    const { customerId, profile } = useSelector(state => state.customer);
    const { accounts } = useSelector(state => state.bankAccounts);

    const { getAccounts, getDocuments, getCountries, getCustomerInformation, handleSetTitle, logout } = props;

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [value, setValue] = useState(0);
    setTabValue = setValue;
    setOpenDrawer = setDrawerOpen;
    isDrawerOpen = drawerOpen;

    const tablList = [
        { icon: <Account className={classes.icon} />, text: 'Profile' },
        { icon: <LockOutline className={classes.icon} />, text: 'Authentication' },
        { icon: <BagChecked className={classes.icon} />, text: 'Bank Account' },
        { icon: <History className={classes.icon} />, text: 'Transaction History' },
        { icon: <CardAccountDetailsOutline className={classes.icon} />, text: 'ID Verification' },
        // { icon: <KeyVariant className={classes.icon} />, text: 'Set PIN' },
    ];

    useEffect(() => {
        handleSetTitle('Account Setup');
        if (accounts.length === 0) {
            getAccounts(customerId);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const { state } = location;
        if (state) {
            if (state.eu || state.otherId) {
                setValue(3);
            } else if (state.mfa) {
                setValue(1);
            } else if (state.verifyPhone) {
                setValue(0);
            }
        }   
    }, [location]);
    
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

    const verifyIdentity = () => setValue(3);

    return (
        <>
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
                        {tablList.map((tab, index) => (
                            <LinkTab 
                                key={index}
                                label={
                                    <>
                                        {tab.icon}&nbsp;&nbsp;&nbsp;
                                        <Typography variant="subtitle1" component="p" className={classes.tabLabel}>{tab.text}</Typography>
                                    </>
                                } 
                                {...a11yProps(index)} 
                                classes={{ selected: classes.selectedTab }}
                                disableRipple
                                disableFocusRipple
                            />    
                        ))}
                        <LinkTab 
                            label={
                                <>
                                    <Logout />&nbsp;&nbsp;&nbsp;
                                    <Typography variant="subtitle1" component="p" className={classes.tabLabel}>Logout</Typography>
                                </>
                            } 
                            disableRipple
                            disableFocusRipple
                            onClick={() => logout(history)}
                        />
                    </Tabs>
                </div>
                <div>
                    <TabPanel value={value} index={0}>  
                        <PersonalDetails verifyIdentity={verifyIdentity} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>  
                        <TwoFactor />
                    </TabPanel>
                    <TabPanel value={value} index={2}>  
                        <BankAccounts />
                    </TabPanel>
                    <TabPanel value={value} index={3}>  
                        <Transactions />
                    </TabPanel>
                    <TabPanel value={value} index={4}>  
                        <IDVerification />
                    </TabPanel>
                </div>
            </section>
            <AccountSettingsDrawer toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />
        </>
    );
}

Profile.propTypes = {
    getAccounts: PropTypes.func.isRequired,
    getCountries: PropTypes.func.isRequired,
    getCustomerInformation: PropTypes.func.isRequired,
    getDocuments: PropTypes.func.isRequired,
    handleSetTitle: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
};

export default connect(undefined, { getAccounts, getCountries, getCustomerInformation, getDocuments, logout })(Profile);