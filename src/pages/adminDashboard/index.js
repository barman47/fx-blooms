// import { useSelector } from 'react-redux';
// import { useHistory, useLocation, Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import {
    AppBar,
    Avatar,
    Grid,
    Toolbar,
    Typography
} from '@material-ui/core';

import avatar from '../../assets/img/avatar.jpg';
import logo from '../../assets/img/logo.svg';

import { COLORS } from '../../utils/constants';

const useStyles = makeStyles((theme) => ({
    root: {
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

const AdminDashboard = ({ children }) => {
    const classes = useStyles();
    // const history = useHistory();
    // const location = useLocation();

    return (
        <>
            <AppBar 
                position="fixed"
                color="white"
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
                                    <Typography variant="h6" className={classes.name}>Wale Calfos</Typography>
                                    <Typography variant="subtitle2" className={classes.email}>nomsouzoanya@yahoo.co.uk</Typography>
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
}

export default AdminDashboard;