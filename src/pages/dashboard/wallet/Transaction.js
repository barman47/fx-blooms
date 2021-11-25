import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { COLORS } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
    transaction: {
        backgroundColor: COLORS.lightTeal,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(1),
        padding: theme.spacing(2),

        '& header': {
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            justifyItems: 'center',
            margin: '0 !important',

            '& p': {
                color: COLORS.offBlack,
                fontWeight: 300
            }
        },

        '& div': {
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            justifyItems: 'center',

            '& h6': {
                fontSize: theme.spacing(1.7),
                fontWeight: 500,
                margin: 0
            }
        }
    },
     
}));

const Transaction = ({ date, time, type, bank, amount, walletId }) => {
    const classes = useStyles();

    return (
        <section className={classes.transaction}>
            <header>
                <Typography variant="body2" component="p">Date</Typography>
                <Typography variant="body2" component="p">Time</Typography>
                <Typography variant="body2" component="p">Transaction Type</Typography>
                <Typography variant="body2" component="p">Bank</Typography>
                <Typography variant="body2" component="p">Amount</Typography>
                <Typography variant="body2" component="p">Wallet ID</Typography>
            </header>
            <div>
                <Typography variant="h6">{date}</Typography>
                <Typography variant="h6">{time}</Typography>
                <Typography variant="h6">{type}</Typography>
                <Typography variant="h6">{bank}</Typography>
                <Typography variant="h6">{amount}</Typography>
                <Typography variant="h6">{walletId}</Typography>
            </div>
        </section>
    );
};

Transaction.propTypes = {
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    bank: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    walletId: PropTypes.string.isRequired
};

export default Transaction;