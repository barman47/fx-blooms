import { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS } from '../../../utils/constants';

import Notification from './Notification';

const useStyles = makeStyles(theme => ({
    root: {
        marginBottom: theme.spacing(8),
        marginTop: theme.spacing(8),
        paddingLeft: theme.spacing(10),
        paddingRight: theme.spacing(10),

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

    const { handleSetTitle } = props;
    
    useEffect(() => {
        handleSetTitle('Notifications');
        // eslint-disable-next-line
    }, []);

    return (
        <section className={classes.root}>
            <Typography variant="h6">Notifications</Typography>
            <Typography variant="body2" component="p">View notifications below</Typography>
            <div>
                <section className={classes.notifications}>
                    <Notification 
                        title="Account Setup Pending"
                        message="You are yet to fully set up your account. Click Set Up Account to proceed"
                        buttonText="Set Up Account"
                        link="/dashboard/account-setup"
                        buttonAction={() => {}}
                    />
                    <Notification 
                        title="Withdrawal Request Processing"
                        message="Your withdrawal request of N500,000 to your bank account is currently being processed."
                    />
                    <Notification 
                        title="Credit (Withdrawal)"
                        message="FXBLOOMS has successfully sent N500,000 to your bank account"
                    />
                    <Notification 
                        title="Debit (Exchange)"
                        message="We have successfully sent walecalfos a sum of N500,000 from your EUR wallet."
                        buttonText="View Wallet Balance"
                        link="/dashboard/account-setup"
                        buttonAction={() => {}}
                    />
                    <Notification 
                        title="Wallet Fund"
                        message="Your EUR has been successfully funded with the sum of N500,000"
                        buttonText="View Wallet Balance"
                        link="/dashboard/account-setup"
                        buttonAction={() => {}}
                    />
                    <Notification 
                        title="Credit (Withdrawal)"
                        message="walecalfos has made a payment of N500,000 to your GTBank | 8849958473"
                        buttonText="Payment Confirmed"
                        link="/dashboard/account-setup"
                        buttonAction={() => {}}
                    />
                </section>
                <aside>
                    <Typography variant="h6">Attention</Typography>
                    <Typography variant="body2" component="p">Make sure you confirm all payments in your banking app.</Typography>
                    <Typography variant="body2" component="p">Do not rely on transaction receipts or any other form of confirmation.</Typography>
                </aside>
            </div>
        </section>
    );
};

export default Index;
