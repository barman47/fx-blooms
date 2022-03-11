import { Box, Button, IconButton, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Close } from 'mdi-material-ui';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'grid',
        gridTemplateColumns: '2fr 0.5fr 0.1fr',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(1)
    },

    iconContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },

    text: {
        marginLeft: theme.spacing(2), 

        '& p:first-child': {
            color: theme.palette.primary.main,
            fontWeight: 600,
            marginBottom: theme.spacing(1),
        },

        '& p:last-child': {
            fontWeight: 300,
            [theme.breakpoints.down('sm')]: {
                fontSize: theme.spacing(1.1)
            }
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
    },

    closeButton: {
        alignSelf: 'flex-start',
        cursor: 'pointer'
    }
}));

const Notification = ({ title, message, buttonText, buttonAction, buttonDisabled, icon, iconColor, iconBackgroundColor }) => {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Box component="div" className={classes.iconContainer}>
                <IconButton disabled style={{ backgroundColor: iconBackgroundColor, color: iconColor }}>
                    {icon}
                </IconButton>
                <Box component="div" className={classes.text}>
                    <Typography variant="body1" component="p">{title}</Typography>
                    <Typography variant="body1" component="p">{message}</Typography>
                </Box>
            </Box>
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
            <Close className={classes.closeButton} />
        </Paper>
    );
};

Notification.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    buttonText: PropTypes.string,
    buttonAction: PropTypes.func,
    buttonDisabled: PropTypes.bool,
    iconColor: PropTypes.string.isRequired,
    iconBackgroundColor: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired
    // link: PropTypes.string
};

export default Notification;