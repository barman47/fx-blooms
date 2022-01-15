import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid,
    Link,
    Typography
} from '@material-ui/core';

import { COLORS } from '../../../utils/constants';
import { CUSTOMERS } from '../../../routes';

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
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: theme.spacing(25),
            padding: [[theme.spacing(2)]]
        }
    }
}));

const Home = (props) => {
    const classes = useStyles();
    const history = useHistory();

    const { totalCustomers } = useSelector(state => state.stats);

    const { handleSetTitle } = props;

    useEffect(() => {
        handleSetTitle('Admin Home');
        // eslint-disable-next-line
    }, []);

    const goToDashboard = () => history.push(`${CUSTOMERS}`);

    return (
        <>
            <Grid container direction="column" spacing={10} className={classes.root}>
                <Grid item xs={12} md={6} lg={5} className={classes.header}>
                    <Typography variant="h5">Welcome to FXBLOOMS Admin</Typography>
                    <Typography variant="subtitle2" component="span">What would you like to do today?</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={5} className={classes.content}>
                    <div onClick={goToDashboard}>
                        {/* <Typography variant="subtitle2" component="span" color="primary"> */}
                            <Link to={CUSTOMERS} component={RouterLink} underline="none" color="primary">
                                Customers
                            </Link>
                        {/* </Typography> */}
                        <section>
                            <Typography variant="h2" component="span">{totalCustomers}</Typography>
                            <br />
                            <Typography variant="subtitle2" component="span">Total</Typography>
                        </section>
                    </div>
                </Grid>
            </Grid>
        </>
    );
}

Home.propTypes = {
    handleSetTitle:PropTypes.func.isRequired
};

export default Home;