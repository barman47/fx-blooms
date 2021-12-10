import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS, NOTIFICATION_TYPES } from '../../../utils/constants';

import Notification from './Notification';
import SendEurDrawer from './SendEurDrawer';
import { DASHBOARD, PROFILE } from '../../../routes';

const useStyles = makeStyles(theme => ({
    root: {
        marginBottom: theme.spacing(8),
        marginTop: theme.spacing(8),
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),

        [theme.breakpoints.down('md')]: {
            marginBottom: theme.spacing(3),
            // paddingLeft: theme.spacing(5),
            // paddingRight: theme.spacing(5),
        },

        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },

        '& h6': {
            color: COLORS.offBlack,
            fontWeight: '600',
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(2),
        },

        '& div:nth-child(3)': {
            display: 'grid',
            gridTemplateColumns: '3fr 1fr',
            gap: theme.spacing(3),
            maxWidth: '100%',

            [theme.breakpoints.down('md')]: {
                display: 'flex',
                flexDirection: 'column-reverse'
            },

            '& aside': {
                backgroundColor: COLORS.lightTeal,
                borderRadius: theme.shape.borderRadius,
                marginTop: theme.spacing(2),
                padding: theme.spacing(2),
                alignSelf: 'flex-start',

                [theme.breakpoints.down('md')]: {
                    width: '100%'
                },

                '& h6': {
                    color: theme.palette.primary.main,
                    margin: 0,
                    marginBottom: theme.spacing(2),
                },

                '& p': {
                    color: COLORS.offBlack,
                    fontWeight: '400',
                    margin: 0,
                    marginBottom: theme.spacing(2),
                }
            }
        }
    },

    notifications: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(4),
        marginTop: theme.spacing(2),
        maxWidth: '100%',
    }
}));

const Index = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const { notifications } = useSelector(state => state.notifications);
    const { handleSetTitle } = props;

    const [sendEurDrawerOpen, setSendEurDrawerOpen] = useState('');
    
    useEffect(() => {
        handleSetTitle('Notifications');
        // eslint-disable-next-line
    }, []);

    const toggleSendEurDrawer = () => setSendEurDrawerOpen(!sendEurDrawerOpen);

    const getButtonText = (type) => {
        switch (type) {
            case NOTIFICATION_TYPES.ACCOUNT_SETUP:
                return 'Set Up Account';

            default:
                return;
        }
    };

    const gotoAccountSetup = () => history.push(`${DASHBOARD}${PROFILE}`);

    const getButtonAction = (type) => {
        switch (type) {
            case NOTIFICATION_TYPES.ACCOUNT_SETUP:
                return gotoAccountSetup;

            default:
                return;
        }
    };

    return (
        <>
            {sendEurDrawerOpen && <SendEurDrawer toggleDrawer={toggleSendEurDrawer} drawerOpen={sendEurDrawerOpen} />}
            <section className={classes.root}>
                <Typography variant="h6">Notifications</Typography>
                <Typography variant="body2" component="p">View notifications below</Typography>
                <div>
                    <section className={classes.notifications}>
                        {notifications.map((notification, index) => (
                            <Notification 
                                key={index}
                                title={notification.title}
                                message={notification.message}
                                buttonText={() => getButtonText(notification.type)}
                                buttonAction={() => getButtonAction(notification.type)}
                            />
                        ))}
                    </section>
                    <aside>
                        <Typography variant="h6">Attention</Typography>
                        <Typography variant="body2" component="p">Make sure you confirm all payments in your banking app.</Typography>
                        <Typography variant="body2" component="p">Do not rely on transaction receipts or any other form of confirmation.</Typography>
                    </aside>
                </div>
            </section>
        </>
    );
};

export default Index;
