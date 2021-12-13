import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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

        '& header': {
            marginBottom: theme.spacing(2),

            '& h6': {
                color: COLORS.offBlack,
                fontWeight: '600',
                margin: 0,
            }
        }
    },
    transactions: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(1.5),
    }
     
}));

const Transactions = () => {
    const classes = useStyles();

    return (
        <section className={classes.root}>
            <header>
                <Typography variant="h6" className={classes.header}>Transaction History</Typography>
                <Typography variant="body2" component="p" className={classes.header}>Here are the recent transactions on your wallets</Typography>
            </header>
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

export default Transactions;