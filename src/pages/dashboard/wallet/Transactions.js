import { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { 
    Button,
    ButtonGroup,
    Typography 
} from '@material-ui/core';
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

const FILTERS = {
    HISTORY: 'HISTORY',
    FUNDING: 'FUNDING',
    WITHDRAWAL: 'WITHDRAWAL'
};

const Transactions = ({ getWalletTransactions }) => {
    const classes = useStyles();
    
    const { wallet } = useSelector(state => state.wallets);

    const [filter, setFilter] = useState(FILTERS.HISTORY);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getWalletTransactions(wallet.id);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        // setLoading(true);
        handleFilter(filter);
    }, [filter]);

    const handleFilter = (filter) => {
        switch (filter) {
            case FILTERS.HISTORY:
                // Get wallet history
                break;

            case FILTERS.FUNDING:
                break;

            case FILTERS.WITHDRAWAL:
                break;

            default:
                break;
        }
    };

    return (
        <section className={classes.root}>
            <Typography variant="h6" className={classes.header}>Transaction History</Typography>
            <ButtonGroup disableElevation className={classes.filterButtons}>
                <Button
                    color="primary"
                    size="small"
                    disableRipple
                    disableFocusRipple
                    onClick={() => setFilter(FILTERS.HISTORY)}
                    variant={filter === FILTERS.HISTORY ? 'contained' : 'outlined'}
                    disabled={loading ? true : false}
                >
                    History
                </Button>
                <Button
                    color="primary"
                    size="small"
                    disableRipple
                    disableFocusRipple
                    onClick={() => setFilter(FILTERS.FUNDING)}
                    variant={filter === FILTERS.FUNDING ? 'contained' : 'outlined'}
                    disabled={loading ? true : false}
                >
                    Funding
                </Button>
                <Button
                    color="primary"
                    size="small"
                    disableRipple
                    disableFocusRipple
                    onClick={() => setFilter(FILTERS.WITHDRAWAL)}
                    variant={filter === FILTERS.WITHDRAWAL ? 'contained' : 'outlined'}
                    disabled={loading ? true : false}
                >
                    Withdrawal
                </Button>
            </ButtonGroup>
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