import { useDispatch } from 'react-redux';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { Close } from 'mdi-material-ui';

import { COLORS } from '../../../utils/constants';
import { REMOVE_ALERT_NOTIFICATION } from '../../../actions/types';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.lightTeal,
        display: 'flex',
        flexDirecton: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(0.5, 2),

        [theme.breakpoints.down('md')]: {
            marginTop: theme.spacing(8),
            gridTemplateColumns: '1fr'
        },

        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(7.5)

        },

        '& div:first-child': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',

            [theme.breakpoints.down('sm')]: {
                display: 'grid',
                gridTemplateColumns: '1fr 0.5fr 0.2fr'
            },
        },

        '& p': {
            color: theme.palette.primary.main,

            [theme.breakpoints.down('sm')]: {
                fontSize: theme.spacing(1.1)
            }
        }
    },

    button: {
        fontSize: theme.spacing(1.3),
        marginLeft: theme.spacing(2),
        textTransform: 'uppercase',

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
    const dispatch = useDispatch();

    const removeAlertNotification = () => dispatch({ type: REMOVE_ALERT_NOTIFICATION });

    return (
        <Box component="div" className={classes.root}>
            <Box component="div">
                <Typography variant="body1" component="p">{message}</Typography>
                {buttonText && buttonAction && 
                    <Button 
                        disableElevation
                        size="small"
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
            <IconButton
                disableRipple
                disableFocusRipple
                disableTouchRipple
                onClick={removeAlertNotification}
            >
                <Close />
            </IconButton>
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