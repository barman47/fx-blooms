import { useState } from 'react';
import { Button, IconButton, Paper, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { EyeOutline, EyeOffOutline } from 'mdi-material-ui';
import PropTypes from 'prop-types';

import { COLORS } from '../../../utils/constants';
import { Information } from 'mdi-material-ui';

const useStyles = makeStyles(theme => ({
    wallet: {
        boxShadow: '1px 14px 30px -16px rgba(30, 98, 98, 1)',
        padding: theme.spacing(2),
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(2),
        height: 'initial',

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1)
        },

        '& small': {
            color: COLORS.darkGrey,
            fontWeight: 300
        },
        
        '& header': {
            // border: '1px solid red',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',

            '& h6': {
                margin: 0
            }
        },

        '& main': {
            backgroundColor: COLORS.lightTeal,
            border: `2px dashed ${theme.palette.primary.main}`,
            borderRadius: theme.shape.borderRadius,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: theme.spacing(2),
        },

        '& footer': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        }
    },

    walletIdContainer: {
        display: 'flex',
        flexDirection: 'row',

        '& div:nth-child(2)': {
            display: 'flex',
            flexDirection: 'column',

            '& p': {
                color: theme.palette.primary.main,
            }
        }
    },

    eyeIcon: {
        color: theme.palette.primary.main
    }
}));

const Wallet = ({ type, id, balance, toggleWalletWithdrawal, toggleWalletFund, showWalletInfoModal }) => {
    const classes = useStyles();

    const [isShowingBalance, setIsShowingBalance] = useState(false);

    const toggleShowBalance = () => setIsShowingBalance(!isShowingBalance);

    return (
        <Paper className={classes.wallet}>
            <header>
                <Typography variant="h6">{type} Wallet</Typography>
                <div className={classes.walletIdContainer}>
                    <Information style={{ cursor: 'pointer' }} onClick={showWalletInfoModal} />
                    <div>
                        <Typography variant="subtitle2" component="small">Wallet ID</Typography>
                        <Typography variant="subtitle1" component="p">{id}</Typography>
                    </div>
                </div>
            </header>
            <main>
                <div>
                    <Typography variant="h5">{isShowingBalance ? `${type}${balance}` : 'XXXXXX'}</Typography>
                    <Typography variant="subtitle2" component="small">Lien Balance {isShowingBalance ? '#500.00' : 'XXXXXX'}</Typography>
                </div>
                <IconButton>
                    {isShowingBalance ? 
                        <Tooltip title="Hide balance" arrow>
                            <EyeOffOutline className={classes.eyeIcon} onClick={toggleShowBalance} /> 
                        </Tooltip>
                        : 
                        <Tooltip title="Show balance" arrow>
                            <EyeOutline className={classes.eyeIcon} onClick={toggleShowBalance} />
                        </Tooltip>
                    }
                </IconButton>
            </main>
            <footer>
                <Button variant="text" color="primary" onClick={toggleWalletFund}>Fund Wallet</Button>
                <Button variant="text" color="primary" onClick={toggleWalletWithdrawal}>Withdraw from Wallet</Button>
            </footer>
        </Paper>
    );
};

Wallet.propTypes = {
    type: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
    toggleWalletWithdrawal: PropTypes.func.isRequired,
    toggleWalletFund: PropTypes.func.isRequired,
    showWalletInfoModal: PropTypes.func.isRequired
};

export default Wallet;