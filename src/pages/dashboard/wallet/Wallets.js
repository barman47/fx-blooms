import { useRef, useState } from 'react';
// import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
// import { Plus } from 'mdi-material-ui';

import { COLORS } from '../../../utils/constants';

import Wallet from './Wallet';
import WalletInfoModal from './WalletInfoModal';
import FundWalletDrawer from './FundWalletDrawer';
import WalletWithdrawalDrawer from './WalletWithdrawalDrawer';

const useStyles = makeStyles(theme => ({
    wallets: {
        backgroundColor: COLORS.lightTeal,
        display: 'grid',
        borderRadius: theme.shape.borderRadius,
        gridTemplateColumns: '1fr',
        alignSelf: 'flex-start',
        padding: theme.spacing(4),
        rowGap: theme.spacing(3),
        marginTop: theme.spacing(4),
        minHeight: 0,
        minWidth: 0,

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2)
        }
    }
}));

const Wallets = () => {
    const classes = useStyles();

    const [fundDrawerOpen, setFundDrawerOpen] = useState(false);
    const [withdrawalDrawerOpen, setWithdrawalDrawerOpen] = useState(false);
    
    const walletInfoModal = useRef();

    const toggleFundDrawer = () => {
        setFundDrawerOpen(!fundDrawerOpen);
    };

    const toggleWithdrawalDrawer = () => {
        setWithdrawalDrawerOpen(!withdrawalDrawerOpen);
    };

    return (
        <section className={classes.wallets}>
            <Wallet 
                id="dsdsds"
                type="EUR"
                balance={1000}
                toggleWalletWithdrawal={toggleWithdrawalDrawer}
                toggleWalletFund={toggleFundDrawer}
                showWalletInfoModal={() => walletInfoModal.current.openModal()}
            />
            <Wallet 
                id="dsdsds"
                type="NGN"
                balance={1000}
                toggleWalletWithdrawal={toggleWithdrawalDrawer}
                toggleWalletFund={toggleFundDrawer}
                showWalletInfoModal={() => walletInfoModal.current.openModal()}
            />
            {/* <Button variant="outlined" color="primary" startIcon={<Plus />}>Create a New Wallet</Button> */}
            {fundDrawerOpen && <FundWalletDrawer toggleDrawer={toggleFundDrawer} drawerOpen={fundDrawerOpen} />}
            {withdrawalDrawerOpen && <WalletWithdrawalDrawer toggleDrawer={toggleWithdrawalDrawer} drawerOpen={withdrawalDrawerOpen} />}
            <WalletInfoModal ref={walletInfoModal} />
        </section>
    );
};

export default Wallets;