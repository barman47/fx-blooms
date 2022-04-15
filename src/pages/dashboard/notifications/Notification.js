import { Box, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ClockOutline } from 'mdi-material-ui';

import { COLORS } from '../../../utils/constants';

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

        '& div:first-child': {
            '& p': {
                margin: 0,
            },

            '& p:first-child': {
                color: theme.palette.primary.main,
                fontWeight: 600,
                marginBottom: theme.spacing(1),
            },

            '& p:last-child': {
                fontWeight: 300
            }
        }
    },

    timeStampContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: theme.spacing(1),

        '& small': {
            color: COLORS.offBlack,
            fontWeight: 700
        },
    },

    clockIcon: {
        color: COLORS.offBlack,
        marginRight: theme.spacing(1)
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

const Notification = ({ title, message, buttonText, buttonAction, buttonDisabled, date }) => {
    const classes = useStyles();

    return (
        <section className={classes.root}>
            <div>
                <Typography variant="body1" component="p">{title}</Typography>
                <Box component="div" className={classes.timeStampContainer}>
                    <ClockOutline className={classes.clockIcon} />
                    <Typography variant="subtitle2" component="small">
                        {moment(date).fromNow()}
                    </Typography>
                </Box>
                <Typography variant="body1" component="p">{message}</Typography>
            </div>
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
        </section>
    );
};

Notification.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    buttonText: PropTypes.string,
    buttonAction: PropTypes.func,
    buttonDisabled: PropTypes.bool,
    date: PropTypes.string
};

export default Notification;