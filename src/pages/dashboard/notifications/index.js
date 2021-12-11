import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS } from '../../../utils/constants';

import { completeTransaction } from '../../../actions/listings';

import Notification from './Notification';
import SendEurDrawer from './SendEurDrawer';
import { DASHBOARD, PROFILE } from '../../../routes';
import { SET_ACCOUNT } from '../../../actions/types';
import isEmpty from '../../../utils/isEmpty';
import { getAccount } from '../../../actions/bankAccounts';

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

const Index = ({ completeTransaction, getAccount, handleSetTitle }) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { account } = useSelector(state => state.bankAccounts);
    const { bids } = useSelector(state => state.notifications);

    const [sendEurDrawerOpen, setSendEurDrawerOpen] = useState(false);
    
    useEffect(() => {
        handleSetTitle('Notifications');
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!sendEurDrawerOpen) {
            dispatch({
                type: SET_ACCOUNT,
                payload: {}
            });
        }
    }, [dispatch, sendEurDrawerOpen]);

    // Open Send Eur Drawer Once Buyer Account is Available
    useEffect(() => {
        if (!isEmpty(account)) {
            setSendEurDrawerOpen(true);
        }
    }, [account]);

    const handlePaymentReceived = (id) => {
        const data = {
            transactionSessionId: id,
            message: '',
            rating: 0,
            receivedExpectedFunds: true
        };
        completeTransaction(data);
    };

    const getBuyerAccount = (accountId, id) => {
        toggleSendEurDrawer();
        getAccount(accountId);
        handlePaymentReceived(id);
    };

    const toggleSendEurDrawer = () => setSendEurDrawerOpen(!sendEurDrawerOpen);
    const gotoAccountSetup = () => history.push(`${DASHBOARD}${PROFILE}`);

    return (
        <>
            {sendEurDrawerOpen && <SendEurDrawer toggleDrawer={toggleSendEurDrawer} drawerOpen={sendEurDrawerOpen} />}
            <section className={classes.root}>
                <Typography variant="h6">Notifications</Typography>
                <Typography variant="body2" component="p">View notifications below</Typography>
                <div>
                    <section className={classes.notifications}>
                        <Notification 
                            title="Account Setup Pending"
                            message="You are yet to fully setup your account. Click Set Up Account to proceed."
                            buttonText="Set Up Account"
                            buttonAction={gotoAccountSetup}
                        />
                        {bids.map((bid, index) => (
                            <Notification 
                                key={index}
                                title="Credit (Exchange)"
                                message={bid.message}
                                buttonText="Payment Confirmed"
                                buttonAction={() => getBuyerAccount(bid.buyersAccountId, bid.id)}
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

Index.propTypes = {
    completeTransaction: PropTypes.func.isRequired,
    getAccount: PropTypes.func.isRequired
};

export default connect(undefined, { completeTransaction, getAccount })(Index);
