import PropTypes from 'prop-types';
import { IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DeleteForever } from 'mdi-material-ui';

import { COLORS } from '../../../utils/constants'; 

const useStyles = makeStyles(theme =>({
    root: {
        backgroundColor: COLORS.lightTeal,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gap: theme.spacing(1),
        gridTemplateColumns: '1.3fr 1fr 0.7fr 0.5fr 0.5fr',
        alignItems: 'center',
        padding: [[theme.spacing(2), 0, theme.spacing(2), theme.spacing(2)]],

        [theme.breakpoints.down('sm')]: {
            alignItems: 'flex-start',
            gap: theme.spacing(0.5),
            height: 'initial',
            padding: [[theme.spacing(0.5), 0, theme.spacing(0.5), theme.spacing(0.5)]],
            width: '100%'
        },

        '& small': {
            fontWeight: 300,

            [theme.breakpoints.down('sm')]: {
                fontSize: theme.spacing(0.8)
            },
        },

        '& p': {
            [theme.breakpoints.down('sm')]: {
                fontSize: theme.spacing(0.9)
            },
        }
    },

    icon: {
        color: theme.palette.error.main,
        [theme.breakpoints.down('sm')]: {
            fontSize: theme.spacing(1.5)
        },
    }
}));

const BankAccount = ({ bankName, accountName, sortCode, currency }) => {
    const classes = useStyles();

    return (
        <section className={classes.root}>
            
            <Typography variant="subtitle2" component="small">Bank Name</Typography>
            <Typography variant="subtitle2" component="small">Account Name</Typography>
            <Typography variant="subtitle2" component="small">Sort Code</Typography>
            <Typography variant="subtitle2" component="small">Currency</Typography>
            <Typography variant="subtitle2" component="small"></Typography>
            <Typography variant="subtitle1" component="p">{bankName}</Typography>
            <Typography variant="subtitle1" component="p">{accountName}</Typography>
            <Typography variant="subtitle1" component="p">{sortCode}</Typography>
            <Typography variant="subtitle1" component="p">{currency}</Typography>
            <IconButton disableRipple style={{ justifySelf: 'center' }}>
                <DeleteForever className={classes.icon} />
            </IconButton>
        </section>
    );
}

BankAccount.propTypes = {
    bankName: PropTypes.string.isRequired, 
    accountName: PropTypes.string.isRequired, 
    sortCode: PropTypes.string.isRequired, 
    currency: PropTypes.string.isRequired
};

export default BankAccount;