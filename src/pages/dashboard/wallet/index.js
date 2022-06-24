import { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { getWallets } from '../../../actions/wallets';

import { COLORS } from '../../../utils/constants';

import Transactions from './Transactions';
import WalletInfo from './WalletInfo';

const useStyles = makeStyles(theme => ({
    root: {
        marginBottom: theme.spacing(8),
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),

        [theme.breakpoints.down('md')]: {
            marginBottom: theme.spacing(3)
        },

        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        }
    },

    header: {
        color: COLORS.offBlack,
        fontWeight: '600'
    },

    container: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: theme.spacing(5),

        [theme.breakpoints.down('md')]: {
            gridTemplateColumns: '1fr',
        }
    }
}));

const Index = ({ getWallets, handleSetTitle }) => {
    const classes = useStyles();
    const { customerId } = useSelector(state => state.customer);
    useEffect(() => {
        getWallets(customerId);
        handleSetTitle('Wallets');
        // eslint-disable-next-line
    }, []);

    return (
        <section className={classes.root}>
            <Typography variant="h6" className={classes.header}>Wallet</Typography>
            <Typography variant="body2" component="p">Here are your wallets</Typography>
            <WalletInfo />
            <Transactions />
        </section>
    );
};

Index.propTypes = {
    getWallets: PropTypes.func.isRequired,
    handleSetTitle: PropTypes.func.isRequired
};

export default connect(undefined, { getWallets })(Index);