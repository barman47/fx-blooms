import { useNavigate } from 'react-router-dom';
import { Box, Button, Divider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { ArrowLeftRight, ArrowBottomLeftThinCircleOutline, ArrowTopRightThinCircleOutline } from 'mdi-material-ui';

import { COLORS } from '../../../utils/constants';
import { MAKE_LISTING } from '../../../routes';


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
        justifyContent: 'space-evenly',

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

const WalletInfo = ({ availableBalance, escrowedBalance, toggleFundDrawer, toggleWithdrawalDrawer }) => {
    const classes = useStyles();
    const navigate = useNavigate();

    return (
        <Box component="section" className={classes.root} >
            <Box component="div" className={classes.balance}>
                <Box component="div">
                    <Typography variant="h6" className={classes.title}>Available Balance</Typography>
                    <Typography variant="h6" className={classes.label}>{availableBalance}</Typography>
                </Box>
                <Divider orientation="vertical" flexItem light />
                <Box component="div">
                    <Typography variant="h6" className={classes.title}>Escrowed Balance</Typography>
                    <Typography variant="h6" className={classes.label}>{escrowedBalance}</Typography>
                </Box>
            </Box>
            <Box component="section" className={classes.buttonContainer}>
                <Button 
                    variant="outlined" 
                    color="primary" 
                    disableFocusRipple
                    disableRipple
                    startIcon={<ArrowBottomLeftThinCircleOutline style={{ backgroundColor: '#00A389', borderRadius: '50%', color: COLORS.offWhite }} />}
                    onClick={toggleFundDrawer}
                    className={classes.button}
                >
                    Add Fund
                </Button>
                <Button 
                    variant="outlined" 
                    color="primary" 
                    disableFocusRipple
                    disableRipple
                    startIcon={<ArrowTopRightThinCircleOutline style={{ backgroundColor: '#FF7880', borderRadius: '50%', color: COLORS.offWhite }} />}
                    onClick={toggleWithdrawalDrawer}
                    className={classes.button}
                >
                    Withdraw
                </Button>
                <Button 
                    variant="outlined" 
                    color="primary"
                    disableFocusRipple
                    disableRipple
                    startIcon={<ArrowLeftRight style={{ backgroundColor: COLORS.primary, borderRadius: '50%', color: COLORS.offWhite }} />}
                    onClick={() => navigate(MAKE_LISTING)}
                    className={classes.button}
                >
                    Make a Listing
                </Button>
            </Box>
        </Box>
    );
};

WalletInfo.propTypes = {
    availableBalance: PropTypes.string.isRequired,
    escrowedBalance: PropTypes.string.isRequired,
    toggleFundDrawer: PropTypes.func.isRequired,
    toggleWithdrawalDrawer: PropTypes.func.isRequired
};

export default WalletInfo;