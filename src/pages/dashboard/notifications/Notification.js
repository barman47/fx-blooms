import { Link } from '@material-ui/core';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import { COLORS } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.lightTeal,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        width: '100%',

        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%'
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

    button: {
        marginTop: theme.spacing(2),

        [theme.breakpoints.down('sm')]: {
            width: '100%'
        },
    }
}));

const Notification = ({ title, message, buttonText, buttonAction, link }) => {
    const classes = useStyles();

    return (
        <section className={classes.root}>
            <div>
                <Typography variant="body1" component="p">{title}</Typography>
                <Typography variant="body1" component="p">{message}</Typography>
            </div>
            {buttonText && buttonAction && 
                <Button 
                    underline="none" 
                    to={link} 
                    component={Link} 
                    variant="contained" 
                    color="primary" 
                    onClick={buttonAction}
                    classes={{ root: classes.button }}
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
    link: PropTypes.string
};

export default Notification;