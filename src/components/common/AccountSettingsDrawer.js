import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    Badge,
    Divider,
    Drawer,
    Tabs,
    Typography
} from '@material-ui/core';
import { Account, BagChecked, CardAccountDetailsOutline, History, LockOutline, Logout } from 'mdi-material-ui';

import { logout } from '../../actions/customer';
import { COLORS } from '../../utils/constants';

import { a11yProps, LinkTab, handleChange } from '../../pages/dashboard/profile';

const useStyles = makeStyles(theme => ({
    drawer: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: theme.spacing(5),
        width: '70%',

        '& .MuiTab-wrapper': {
            
            flexDirection: 'row',
            justifyContent: 'flex-start',
        }
    },

    header: {
        textAlign: 'center',
        marginBottom: theme.spacing(3),

        '& h6': {
            marginBottom: theme.spacing(2),
            textAlign: 'center',
        }
    },

    tab: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    selectedTab: {
        backgroundColor: theme.palette.primary.main,
        border: 'none !important',
        color: COLORS.offWhite,

        '& .MuiTab-wrapper': {
            color: COLORS.offWhite,
        }
    },
}));

const AccountSettingsDrawer = ({ toggleDrawer, drawerOpen, logout }) => {
    const classes = useStyles();
    const history = useHistory();

    const [value, setValue] = useState(0);

    const closeDrawer = () => {
        setTimeout(() => {
            toggleDrawer();
        }, 600);
    };

    return (
        <Drawer PaperProps={{ className: classes.drawer }} anchor="left" open={drawerOpen} onClose={toggleDrawer}>
            <section className={classes.root}>
                <div className={classes.header}>
                    <Typography variant="h6">Account Settings</Typography>
                    <Divider />
                </div>
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
                        // variant="scrollable"
                        onClick={closeDrawer}
                    >
                        <LinkTab 
                            label={
                                <div className={classes.tab}>
                                    <Account className={classes.icon} />&nbsp;&nbsp;&nbsp;
                                    <Typography variant="subtitle1" component="p" className={classes.tabLabel}>Profile</Typography>
                                </div>
                            } 
                            {...a11yProps(0)} 
                            classes={{ selected: classes.selectedTab }}
                            disableRipple
                            disableFocusRipple
                            onClick={() => {
                                setValue(0);
                            }}
                        />
                        <LinkTab 
                            label={
                                <div className={classes.tab}>
                                    <LockOutline className={classes.icon} />&nbsp;&nbsp;&nbsp;
                                    <Typography variant="subtitle1" component="p" className={classes.tabLabel}>2FA Setup</Typography>
                                </div>
                            } 
                            {...a11yProps(1)} 
                            classes={{ selected: classes.selectedTab }}
                            disableRipple
                            disableFocusRipple
                            onClick={() => {
                                setValue(1);
                            }}
                        />
                        <LinkTab 
                            label={
                                <div className={classes.tab}>
                                    <BagChecked className={classes.icon} />&nbsp;&nbsp;&nbsp;
                                    <Typography variant="subtitle1" component="p" className={classes.tabLabel}>Bank Account</Typography>
                                </div>
                            } 
                            {...a11yProps(2)} 
                            classes={{ selected: classes.selectedTab }}
                            disableRipple
                            disableFocusRipple
                            onClick={() => {
                                setValue(2);
                            }}
                        />
                        <LinkTab 
                            label={
                                <div className={classes.tab}>
                                    <CardAccountDetailsOutline className={classes.icon} />&nbsp;&nbsp;&nbsp;
                                    <Typography variant="subtitle1" component="p" className={classes.tabLabel}>ID Verification</Typography>
                                </div>
                            } 
                            {...a11yProps(3)} 
                            classes={{ selected: classes.selectedTab }}
                            disableRipple
                            disableFocusRipple
                            onClick={() => {
                                setValue(3);
                            }}
                        />
                        <LinkTab 
                            label={
                                <div className={classes.tab}>
                                    <Badge color="secondary" badgeContent="New">
                                        <History className={classes.icon} />&nbsp;&nbsp;&nbsp;
                                        <Typography variant="subtitle1" component="p" className={classes.tabLabel}>Transaction History</Typography>
                                    </Badge>
                                </div>
                            } 
                            {...a11yProps(4)} 
                            classes={{ selected: classes.selectedTab }}
                            disableRipple
                            disableFocusRipple
                            onClick={() => {
                                setValue(4);
                            }}
                        />
                        <LinkTab 
                            label={
                                <div className={classes.tab}>
                                    <Logout className={classes.icon} />&nbsp;&nbsp;&nbsp;
                                    <Typography variant="subtitle1" component="p" className={classes.tabLabel}>Logout</Typography>
                                </div>
                            } 
                            {...a11yProps(5)} 
                            disableRipple
                            disableFocusRipple
                            onClick={() => {
                                logout(history);
                            }}
                        />
                    </Tabs>
                </div>
            </section>
        </Drawer>
    );
}

AccountSettingsDrawer.propTypes = {
    logout: PropTypes.func.isRequired
};

export default connect(undefined, { logout })(AccountSettingsDrawer);