import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import {
    AppBar,
    Avatar,
    Toolbar,
    Typography
} from '@material-ui/core';
import { Account } from 'mdi-material-ui';

import logo from '../../assets/img/logo.svg';

import { getStats, logout } from '../../actions/admin';
import { COLORS, LOGOUT } from '../../utils/constants';

import SessionModal from './SessionModal';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: COLORS.white,
        paddingLeft: theme.spacing(15),
        paddingRight: theme.spacing(15),

        [theme.breakpoints.down('md')]: {
            paddingLeft: theme.spacing(5),
            paddingRight: theme.spacing(5),
        },

        [theme.breakpoints.down('md')]: {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
        }
    },

    gridContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },

    logo: {
        [theme.breakpoints.down('sm')]: {
            width: '40%'
        }
    },

    content: {
        marginTop: theme.spacing(10),
        paddingLeft: theme.spacing(15),
        paddingRight: theme.spacing(15),

        [theme.breakpoints.down('md')]: {
            paddingLeft: theme.spacing(5),
            paddingRight: theme.spacing(5),
        },

        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
        }
    },

    avatarContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

        '& div:first-child': {
            marginRight: theme.spacing(2)
        }
    },

    name: {
        color: COLORS.offBlack,
        fontSize: theme.spacing(2),
        textAlign: 'right'
    },

    email: {
        color: COLORS.grey,
        fontSize: theme.spacing(1.7),
        fontWeight: 300,
        lineHeight: 0.8,
        textAlign: 'right'
    }
}));

const AdminDashboard = ({ children, title, getStats, logout }) => {
    const classes = useStyles();
    const history = useHistory();
    const { admin } = useSelector(state => state);

    useEffect(() => {
        checkSession();
        getStats();
        // eslint-disable-next-line
    }, []);

    const checkSession = () => {
        if (sessionStorage.getItem(LOGOUT)) {
            sessionStorage.removeItem(LOGOUT);
            logout(history);
        }
    };

    return (
        <>
            <Helmet><title>{`${title} | FXBLOOMS.com`}</title></Helmet>
            <SessionModal />
            <AppBar 
                position="fixed"
                elevation={0}
                classes={{ root: classes.root}}
                // className={clsx(classes.appBar, {
                //     [classes.appBarShift]: open
                // })}
            >
                <Toolbar style={{ padding: 0 }}>
                    <section className={classes.gridContainer}>
                        <img src={logo} alt="FXBLOOMS Logo" className={classes.logo} />
                        <div className={classes.avatarContainer}>
                            <div>
                                <Typography variant="h6" className={classes.name}>{`${admin.firstName} ${admin.lastName}`}</Typography>
                                <Typography variant="subtitle2" className={classes.email}>{admin.email}</Typography>
                            </div>
                            <Avatar>
                                <Account />
                            </Avatar>
                        </div>
                    </section>
                </Toolbar>
            </AppBar>
            <section className={classes.content}>
                {children}
            </section>
        </>
    );
};

AdminDashboard.propTypes = {
    title: PropTypes.string.isRequired,
    getStats: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
};

export default connect(undefined, { getStats, logout })(AdminDashboard);