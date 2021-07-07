// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid,
    Link,
    Typography
} from '@material-ui/core';

import { COLORS } from '../../../utils/constants';
import { ADMIN_DASHBOARD, CUSTOMERS } from '../../../routes';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(5),
    },

    header: {
        '& h5': {
            fontWeight: 600,

            [theme.breakpoints.down('md')]: {
                fontSize: theme.spacing(2.5)
            }
        },

        '& span': {
            fontWeight: 300
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
    },

    content: {
        

        '& div': {
            backgroundColor: COLORS.lightTeal,
            borderRadius: theme.shape.borderRadius,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: theme.spacing(25),
            padding: [[theme.spacing(2)]]
        }
    }
}));

const Home = () => {
    const classes = useStyles();

    return (
        <>
            <Grid container direction="column" spacing={10} className={classes.root}>
                <Grid item xs={12} md={6} lg={5} className={classes.header}>
                    <Typography variant="h5">Welcome to FXBlooms Admin</Typography>
                    <Typography variant="subtitle2" component="span">What would you like to do today?</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={5} className={classes.content}>
                    <div>
                        {/* <Typography variant="subtitle2" component="span" color="primary"> */}
                            <Link to={`${ADMIN_DASHBOARD}${CUSTOMERS}`} component={RouterLink} underline="none" color="primary">
                                Customers
                            </Link>
                        {/* </Typography> */}
                        <section>
                            <Typography variant="h2" component="span">27,829</Typography>
                            <br />
                            <Typography variant="subtitle2" component="span">Total</Typography>
                        </section>
                    </div>
                </Grid>
            </Grid>
        </>
    );
}

export default Home;