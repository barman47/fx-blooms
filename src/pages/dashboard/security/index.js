import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Tab, Tabs, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CardAccountDetailsOutline, LockOutline } from 'mdi-material-ui';

import { getCountries } from '../../../actions/countries'; 
import { getCustomerInformation } from '../../../actions/customer'; 
import { getDocuments } from '../../../actions/documents'; 

import { COLORS } from '../../../utils/constants'; 

import IDVerification from './IDVerification';
import TwoFactor from '../twoFactor';
import AccountSettingsDrawer from '../../../components/common/AccountSettingsDrawer';

const useStyles = makeStyles(theme =>({
    root: {
        display: 'grid',
        gridTemplateColumns: '1fr 4fr',
        padding: [[0, theme.spacing(5), 0, theme.spacing(5)]],
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
            to="#"
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
    const classes = useStyles();
    const location = useLocation();
    const { documents } = useSelector(state => state);

    const { getDocuments, handleSetTitle } = props;

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [value, setValue] = useState(0);
    setTabValue = setValue;
    setOpenDrawer = setDrawerOpen;
    isDrawerOpen = drawerOpen;

    const tablList = [
        { icon: <LockOutline className={classes.icon} />, text: 'Authentication' },
        { icon: <CardAccountDetailsOutline className={classes.icon} />, text: 'ID Verification' }
    ];

    useEffect(() => {
        handleSetTitle('Security');
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const { state } = location;
        if (state) {
            if (state.eu || state.otherId) {
                setValue(1);
            } else if (state.mfa) {
                setValue(0);
            }
        }   
    }, [location]);
    
    useEffect(() => {
        if (documents.length === 0) {
            getDocuments();
        }
        // eslint-disable-next-line
    }, []);

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
                    </Tabs>
                </div>
                <div>
                    <TabPanel value={value} index={0}>  
                        <TwoFactor />
                    </TabPanel>
                    <TabPanel value={value} index={1}>  
                        <IDVerification />
                    </TabPanel>
                </div>
            </section>
            <AccountSettingsDrawer toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />
        </>
    );
}

Profile.propTypes = {
    getCountries: PropTypes.func.isRequired,
    getCustomerInformation: PropTypes.func.isRequired,
    getDocuments: PropTypes.func.isRequired,
    handleSetTitle: PropTypes.func.isRequired
};

export default connect(undefined, { getCountries, getCustomerInformation, getDocuments })(Profile);