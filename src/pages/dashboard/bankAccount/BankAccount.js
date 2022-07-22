import PropTypes from 'prop-types';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DeleteForever, FileEdit } from 'mdi-material-ui';
import clsx from 'clsx';

import { COLORS } from '../../../utils/constants'; 

const useStyles = makeStyles(theme =>({
    root: {
        backgroundColor: COLORS.lightTeal,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gap: theme.spacing(1),
        gridTemplateColumns: '1.3fr 1.3fr 1.3fr 1.3fr 0.7fr 0.5fr 0.1fr',
        padding: [[theme.spacing(2), 0, theme.spacing(2), theme.spacing(2)]],

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1)
        },

        '& small': {
            fontWeight: 300,

            [theme.breakpoints.down('md')]: {
                fontSize: theme.spacing(1.2)
            },

            [theme.breakpoints.down('sm')]: {
                fontSize: theme.spacing(0.8)
            },
        },

        '& p': {
            [theme.breakpoints.down('md')]: {
                fontSize: theme.spacing(1.4)
            },

            [theme.breakpoints.down('sm')]: {
                fontSize: theme.spacing(0.9)
            },
        }
    },

    iconContainer: {
        display: 'flex',
        flexDirection: 'row',
    },

    deleteIcon: {
        color: theme.palette.error.main,
        [theme.breakpoints.down('sm')]: {
            fontSize: theme.spacing(1.5)
        },
    },

    editIcon: {
        color: theme.palette.primary.main,
        [theme.breakpoints.down('sm')]: {
            fontSize: theme.spacing(1.5)
        }
    }
}));

const BankAccount = ({ bankName, accountName, accountNumber, currency, alias, handleDeleteAccount, handleEditAccount }) => {
    const classes = useStyles();

    return (
        <>
            <section className={classes.root}>
                <div className={classes.item}>
                    <Typography variant="subtitle2" component="small">Bank Name</Typography>
                    <Typography variant="subtitle1" component="p">{bankName}</Typography>
                </div>
                <div className={classes.item}>
                    <Typography variant="subtitle2" component="small">Account Name</Typography>
                    <Typography variant="subtitle1" component="p">{accountName}</Typography>
                </div>
                <div className={classes.item}>
                    <Typography variant="subtitle2" component="small">{currency === 'NGN' ? 'Account Number' : 'IBAN'}</Typography>
                    <Typography variant="subtitle1" component="p">{accountNumber}</Typography>
                </div>
                <div className={classes.item}>
                    <Typography variant="subtitle2" component="small">Alias</Typography>
                    <Typography variant="subtitle1" component="p">{alias || 'N/A'}</Typography>
                </div>
                <div className={classes.item}>
                    <Typography variant="subtitle2" component="small">Currency</Typography>
                    <Typography variant="subtitle1" component="p">{currency}</Typography>
                </div>
                <div className={clsx(classes.iconContainer, classes.item)}>
                    <Tooltip title="Delete Account" placement="top">
                        <IconButton disableRipple style={{ justifySelf: 'center' }} onClick={handleDeleteAccount}>
                            <DeleteForever className={classes.deleteIcon} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Account" placement="top">
                        <IconButton disableRipple style={{ justifySelf: 'center' }} onClick={handleEditAccount}>
                            <FileEdit className={classes.editIcon} />
                        </IconButton>
                    </Tooltip>
                </div>
            </section>
        </>
    );
}

BankAccount.propTypes = {
    accountID: PropTypes.string, 
    bankName: PropTypes.string.isRequired, 
    accountName: PropTypes.string.isRequired,
    accountNumber: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    alias: PropTypes.string.isRequired,
    handleDeleteAccount: PropTypes.func.isRequired
};

export default BankAccount;