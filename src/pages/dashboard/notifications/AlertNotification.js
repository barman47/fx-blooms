import { Box, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { ClockOutline } from 'mdi-material-ui';

import { COLORS } from '../../../utils/constants';
import { convertToLocalTime } from '../../../utils/getTime';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.lightTeal,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: '5fr 1fr',
        gap: theme.spacing(2),
        alignItems: 'center',
        padding: theme.spacing(2),

        [theme.breakpoints.down('md')]: {
            gridTemplateColumns: '1fr',
        },

        '& p': {
            color: theme.palette.primary.main
        }
    },

    button: {
        fontSize: theme.spacing(1.3),
        textTransform: 'uppercase',
        marginTop: theme.spacing(2),

        [theme.breakpoints.down('md')]: {
            justifySelf: 'flex-start'
        },

        [theme.breakpoints.down('sm')]: {
            width: '100%'
        },
    }
}));

const AlertNotification = ({ message, buttonText, buttonAction, buttonDisabled }) => {
    const classes = useStyles();

    return (
        <Box component="div" className={classes.root}>
            <Typography variant="body1" component="p">{message}</Typography>
            {buttonText && buttonAction && 
                <Button 
                    elevation={3}
                    variant="contained" 
                    color="primary" 
                    onClick={buttonAction}
                    classes={{ root: classes.button }}
                    disabled={buttonDisabled ? true : false}
                    >
                    {buttonText}
                </Button>
            }
        </Box>
    );
};

AlertNotification.propTypes = {
    message: PropTypes.string.isRequired,
    buttonText: PropTypes.string,
    buttonAction: PropTypes.func,
    buttonDisabled: PropTypes.bool,
    date: PropTypes.string
};

export default AlertNotification;