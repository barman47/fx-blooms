import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { COLORS } from '../../../utils/constants';


const useStyles = makeStyles(theme => ({
    wallet: {
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(1),
        width: '100px',

        '& img': {
            width: '40%',
        },

        '& h5': {
            fontWeight: '600',

            [theme.breakpoints.down('sm')]: {
                fontSize: theme.spacing(1.2)
            }
        },

        [theme.breakpoints.down('sm')]: {
            width: '50px',
        }
    }
}));

const Wallet = ({ type, flag, active, handleOnclick }) => {
    const classes = useStyles();

    return (
        <Box 
            component="section" 
            className={classes.wallet} 
            style={{ backgroundColor: active ? COLORS.primary : COLORS.lightTeal }}
            onClick={handleOnclick}
        >
            <img src={flag} alt={type} />
            <Typography variant="h5" style={{ color: active ? COLORS.offWhite : 'initial' }}>{type}</Typography>
        </Box>
    );
};

Wallet.propTypes = {
    active: PropTypes.bool.isRequired,
    flag: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    handleOnclick: PropTypes.func.isRequired
};

export default Wallet;