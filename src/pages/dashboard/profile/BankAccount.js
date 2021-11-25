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
        gridTemplateColumns: '1.3fr 1fr 0.7fr 0.5fr 0.5fr',
        padding: [[theme.spacing(2), 0, theme.spacing(2), theme.spacing(2)]],

        '& div': {
            '& small': {
                fontWeight: 300
            }
        }
    },

    icon: {
        color: theme.palette.error.main,
    }
}));

const BankAccount = ({ bankName, accountName, sortCode, currency }) => {
    const classes = useStyles();

    return (
        <section className={classes.root}>
            <div>
                <Typography variant="subtitle2" component="small">Bank Name</Typography>
                <Typography variant="subtitle1" component="p">{bankName}</Typography>
            </div>
            <div>
                <Typography variant="subtitle2" component="small">Account Name</Typography>
                <Typography variant="subtitle1" component="p">{accountName}</Typography>
            </div>
            <div>
                <Typography variant="subtitle2" component="small">Sort Code</Typography>
                <Typography variant="subtitle1" component="p">{sortCode}</Typography>
            </div>
            <div>
                <Typography variant="subtitle2" component="small">Currency</Typography>
                <Typography variant="subtitle1" component="p">{currency}</Typography>
            </div>
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