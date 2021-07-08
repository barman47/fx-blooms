import { useEffect } from 'react';
// import { useHistory, useLocation, Link as RouterLink } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import {
    AppBar,
    Avatar,
    Grid,
    Toolbar,
    Typography
} from '@material-ui/core';

import avatar from '../../assets/img/avatar.jpg';
import logo from '../../assets/img/logo.svg';

import { getCustomers } from '../../actions/customer';
import { COLORS } from '../../utils/constants';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: COLORS.white,
        paddingLeft: theme.spacing(15),
        paddingRight: theme.spacing(15),

        [theme.breakpoints.down('md')]: {
            paddingLeft: theme.spacing(5),
            paddingRight: theme.spacing(5),
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

const AdminDashboard = ({ children, title, getCustomers }) => {
    const classes = useStyles();
    const { admin } = useSelector(state => state);
    const { count } = useSelector(state => state.customers);
    // const history = useHistory();
    // const location = useLocation();

    useEffect(() => {
        if (count === 0) {
            getCustomers();
        }
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Helmet><title>{`${title} | FXBlooms.com`}</title></Helmet>
            <AppBar 
                position="fixed"
                elevation={0}
                classes={{ root: classes.root}}
                // className={clsx(classes.appBar, {
                //     [classes.appBarShift]: open
                // })}
            >
                <Toolbar style={{ padding: 0 }}>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <Grid item>
                            <img src={logo} alt="FXBlooms Logo" />
                        </Grid>
                        <Grid item>
                            <Grid container direction="row" alignItems="center" spacing={2}>
                                <Grid item>
                                    <Typography variant="h6" className={classes.name}>{`${admin.firstName} ${admin.lastName}`}</Typography>
                                    <Typography variant="subtitle2" className={classes.email}>{admin.email}</Typography>
                                </Grid>
                                <Grid item>
                                    <Avatar src={avatar} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
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
    getCustomers: PropTypes.func.isRequired
};

export default connect(undefined, { getCustomers })(AdminDashboard);