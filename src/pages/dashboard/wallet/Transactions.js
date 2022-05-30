import { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { getWalletTransactions } from '../../../actions/wallets';

import { COLORS } from '../../../utils/constants';

import Transaction from './Transaction';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(2),

        [theme.breakpoints.down('md')]: {
            display: 'none'
        },

        '& h6': {
            color: COLORS.offBlack,
            fontWeight: '600',
            margin: theme.spacing(2, 0, 1, 0),
            textAlign: 'center'
        }
    },
    transactions: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(1.5),
    }
     
}));

const Transactions = ({ getWalletTransactions }) => {
    const classes = useStyles();
    
    const { wallet } = useSelector(state => state.wallets);

    useEffect(() => {
        getWalletTransactions(wallet.id);
        // eslint-disable-next-line
    }, []);

    return (
        <section className={classes.root}>
            <Typography variant="h6" className={classes.header}>Transaction History</Typography>
            <div className={classes.transactions}>
                <Transaction 
                    date="19/09/2021"
                    time="10:34 PM"
                    type="Fund"
                    bank="Revolute"
                    amount={1000}
                    walletId="854584594"
                />
                <Transaction 
                    date="19/09/2021"
                    time="10:34 PM"
                    type="Fund"
                    bank="Revolute"
                    amount={1000}
                    walletId="854584594"
                />
                <Transaction 
                    date="19/09/2021"
                    time="10:34 PM"
                    type="Fund"
                    bank="Revolute"
                    amount={1000}
                    walletId="854584594"
                />
                <Transaction 
                    date="19/09/2021"
                    time="10:34 PM"
                    type="Fund"
                    bank="Revolute"
                    amount={1000}
                    walletId="854584594"
                />
                <Transaction 
                    date="19/09/2021"
                    time="10:34 PM"
                    type="Fund"
                    bank="Revolute"
                    amount={1000}
                    walletId="854584594"
                />
                <Transaction 
                    date="19/09/2021"
                    time="10:34 PM"
                    type="Fund"
                    bank="Revolute"
                    amount={1000}
                    walletId="854584594"
                />
                <Transaction 
                    date="19/09/2021"
                    time="10:34 PM"
                    type="Fund"
                    bank="Revolute"
                    amount={1000}
                    walletId="854584594"
                />
                <Transaction 
                    date="19/09/2021"
                    time="10:34 PM"
                    type="Fund"
                    bank="Revolute"
                    amount={1000}
                    walletId="854584594"
                />
                <Transaction 
                    date="19/09/2021"
                    time="10:34 PM"
                    type="Fund"
                    bank="Revolute"
                    amount={1000}
                    walletId="854584594"
                />
                <Transaction 
                    date="19/09/2021"
                    time="10:34 PM"
                    type="Fund"
                    bank="Revolute"
                    amount={1000}
                    walletId="854584594"
                />
            </div>
        </section>
    );
};

Transactions.propTypes = {
    getWalletTransactions: PropTypes.func.isRequired
};

export default connect(undefined, { getWalletTransactions })(Transactions);