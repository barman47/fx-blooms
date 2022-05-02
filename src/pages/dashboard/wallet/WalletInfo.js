import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Button, Divider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { ArrowBottomLeftThinCircleOutline, ArrowTopRightThinCircleOutline } from 'mdi-material-ui';

import { COLORS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';
import { FUND_WALLET } from '../../../routes';


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
        alignItems: 'center',

        [theme.breakpoints.down('sm')]: {
            display: 'grid',
            gridTemplateColumns: '1fr 0.2fr 1fr'
        }
    },

    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: '0 auto',
        width: theme.spacing(40),

        [theme.breakpoints.down('sm')]: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
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
        textTransform: 'uppercase'
    },

    label: {
        color: COLORS.offBlack,
        fontWeight: 600,
        textTransform: 'uppercase'
    },
}));

const WalletInfo = ({ toggleWithdrawalDrawer }) => {
    const classes = useStyles();

    const { wallet } = useSelector(state => state.wallets);

    return (
        <Box component="section" className={classes.root} >
            <Box component="div" className={classes.balance}>
                <Box component="div">
                    <Typography variant="h6" className={classes.title}>Available Balance</Typography>
                    <Typography variant="h6" className={classes.label}>{formatNumber(wallet?.balance?.available, 2)}</Typography>
                </Box>
                <Divider orientation="vertical" flexItem light />
                <Box component="div">
                    <Typography variant="h6" className={classes.title}>Escrowed Balance</Typography>
                    <Typography variant="h6" className={classes.label}>{formatNumber(wallet?.balance?.lien, 2)}</Typography>
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
                >
                    Add Fund
                </Button>
                <Button 
                    component={Link}
                    to={FUND_WALLET}
                    variant="outlined" 
                    color="primary" 
                    disableFocusRipple
                    disableRipple
                    startIcon={<ArrowTopRightThinCircleOutline style={{ backgroundColor: '#FF7880', borderRadius: '50%', color: COLORS.offWhite }} />}
                    className={classes.button}
                >
                    Withdraw
                </Button>
            </Box>
        </Box>
    );
};

WalletInfo.propTypes = {
    toggleWithdrawalDrawer: PropTypes.func.isRequired
};

export default WalletInfo;