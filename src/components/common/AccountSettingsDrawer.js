import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Divider,
    Drawer,
    Tabs,
    Typography
} from '@material-ui/core';
import { Account, BagChecked, CardAccountDetailsOutline, LockOutline } from 'mdi-material-ui';

import { COLORS } from '../../utils/constants';

import { a11yProps, LinkTab, handleChange } from '../../pages/dashboard/profile';

const useStyles = makeStyles(theme => ({
    drawer: {
        // backgroundColor: theme.palette.primary.main,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: theme.spacing(5),
        width: '60%',

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

const AccountSettingsDrawer = ({ toggleDrawer, drawerOpen }) => {
    const classes = useStyles();

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
            </section>
        </Drawer>
    );
}

export default AccountSettingsDrawer;