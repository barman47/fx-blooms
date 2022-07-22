import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Button, Divider, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ArrowBottomLeftThinCircleOutline, ArrowTopRightThinCircleOutline } from 'mdi-material-ui';

import { COLORS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';
import { FUND_WALLET, REQUEST_WITHDRAWAL } from '../../../routes';
import CreateWalletModal from './CreateWalletModal';
import isEmpty from '../../../utils/isEmpty';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: '1fr',
        justifyContent: 'center',
        gap: theme.spacing(2),
        marginTop: theme.spacing(3),
        padding: theme.spacing(2, 0),

        [theme.breakpoints.down('sm')]: {
            marginTop: '0'
        }
    },

    balance: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },

    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: '0 auto',
        width: theme.spacing(40),

        [theme.breakpoints.down('sm')]: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: theme.spacing(1)
        }
    },

    button: {
        [theme.breakpoints.down('sm')]: {

        }
    },

    title: {
        color: COLORS.darkGrey,
        fontWeight: 300,
        textTransform: 'uppercase',

        [theme.breakpoints.down('sm')]: {
            fontSize: theme.spacing(1.5)
        }
    },

    label: {
        color: COLORS.offBlack,
        fontWeight: 600,
        textTransform: 'uppercase'
    },
}));

const WalletInfo = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    const { wallet, wallets } = useSelector(state => state.wallets);

    const [showCreateWalletModal, setShowCreateWalletModal] = useState(false);

    const toggleCreateWalletDrawer = () => setShowCreateWalletModal(!showCreateWalletModal);

    const handleAddFund = (e, url) => {
        e.preventDefault();
        if (wallets.length === 0) {
            return toggleCreateWalletDrawer();
        }
        navigate(url);
    };

    const handleWithdraw = (e, url) => {
        e.preventDefault();
        if (wallets.length === 0) {
            return toggleCreateWalletDrawer();
        }
        navigate(url);
    };

    return (
        <>
            {showCreateWalletModal && <CreateWalletModal open={showCreateWalletModal} toggleCreateWalletDrawer={toggleCreateWalletDrawer} />}
            {!isEmpty(wallet) && 
                <Box component="section" className={classes.root} >
                    <Box component="div" className={classes.balance}>
                        <Box component="div">
                            <Typography variant="h6" className={classes.title}>Available Balance</Typography>
                            <Typography variant="h6" className={classes.label}>{`${wallet.currency.value}${formatNumber(wallet.balance.available, 2)}`}</Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem light />
                        <Box component="div">
                            <Typography variant="h6" className={classes.title}>Escrowed Balance</Typography>
                            <Typography variant="h6" className={classes.label}>{`${wallet.currency.value}${formatNumber(wallet.balance.lien, 2)}`}</Typography>
                        </Box>
                    </Box>   
                    <Box component="section" className={classes.buttonContainer}>
                        <Button 
                            to={FUND_WALLET}
                            underline="none"
                            component={Link}
                            variant="outlined" 
                            color="primary" 
                            disableFocusRipple
                            disableRipple
                            startIcon={<ArrowBottomLeftThinCircleOutline style={{ backgroundColor: '#00A389', borderRadius: '50%', color: COLORS.offWhite }} />}
                            className={classes.button}
                            onClick={(e) => handleAddFund(e, FUND_WALLET)}
                        >
                            Add Fund
                        </Button>
                        <Button 
                            component={Link}
                            to={REQUEST_WITHDRAWAL}
                            variant="outlined" 
                            color="primary" 
                            disableFocusRipple
                            disableRipple
                            startIcon={<ArrowTopRightThinCircleOutline style={{ backgroundColor: '#FF7880', borderRadius: '50%', color: COLORS.offWhite }} />}
                            className={classes.button}
                            onClick={(e) => handleWithdraw(e, REQUEST_WITHDRAWAL)}
                        >
                            Withdraw
                        </Button>
                    </Box>
                </Box>
            }
        </>
    );
};

export default WalletInfo;