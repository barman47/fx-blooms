import { useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS } from '../../../utils/constants';

import Transactions from './Transactions';
import Wallets from './Wallets';

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
        }
    },

    header: {
        color: COLORS.offBlack,
        fontWeight: '600',
        marginTop: theme.spacing(10)
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

const Index = ({ handleSetTitle }) => {
    const classes = useStyles();
    useEffect(() => {
        handleSetTitle('Wallet');
        // eslint-disable-next-line
    }, []);

    return (
        <section className={classes.root}>
            <Typography variant="h6" className={classes.header}>Wallet</Typography>
            <Typography variant="body2" component="p">Here are your wallets</Typography>
            <div className={classes.container}>
                <Wallets />
                <Transactions />
            </div>
        </section>
    );
};

export default Index;