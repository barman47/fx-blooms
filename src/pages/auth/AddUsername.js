import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink, useNavigate, useLocation} from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { 
    Button, 
    Collapse,
    Grid, 
    IconButton,
    TextField, 
    Typography 
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { CheckCircleOutline, Close } from 'mdi-material-ui';
import PropTypes from 'prop-types';

import Spinner from '../../components/common/Spinner';

import { addUsername } from '../../actions/customer';
import { GET_ERRORS } from '../../actions/types';

import { COLORS } from '../../utils/constants';
import { LOGIN } from '../../routes';

import logo from '../../assets/img/logo.svg';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        padding: [[theme.spacing(5), theme.spacing(10)]],

        [theme.breakpoints.down('sm')]: {
            alignItems: 'center',
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },

    logo: {
        alignSelf: 'flex-start'
    },

    formContainer: {
        alignSelf: 'center',
        justifySelf: 'center',
        paddingTop: theme.spacing(3),
        width: '45%',

        [theme.breakpoints.down('md')]: {
            width: '70%'
        },

        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
    
    form: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(5),

        [theme.breakpoints.down('sm')]: {
            padding: [[theme.spacing(4), theme.spacing(2)]]
        }
    },

    icon: {
        color: theme.palette.primary.main,
        fontSize: theme.spacing(10),
    }
}));

const AddUsername = ({ addUsername }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const errorsState = useSelector(state => state.errors);

    const [Username, setUsername] = useState('');

    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!location?.state?.addUsername) {
            return navigate(LOGIN);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (errorsState?.msg) {
            setErrors({ ...errorsState });
            setOpen(true);
            setLoading(false);
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        }
    }, [dispatch, errorsState, errors]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
    
        const Validator = await import('validator');
        if (Validator.isEmpty(Username)) {
            return setErrors({ Username: 'Username is required!' });
        }

        setErrors({});
        setLoading(true);
        addUsername(Username, navigate);
    };   

    return (
        <>
            <Helmet>
                <title>Add Username | FXBLOOMS.com</title>
            </Helmet>
            {loading && <Spinner />}
            <section className={classes.root}>
                <RouterLink to="/">
                    <img src={logo} className={classes.logo} alt="FX Blooms Logo" />
                </RouterLink>
                <div className={classes.formContainer}>
                    {(errors.msg || errors.message) && 
                        <Collapse in={open}>
                            <Alert 
                                severity="error"
                                action={
                                    <IconButton 
                                        color="inherit" 
                                        size="small"
                                        onClick={() => {
                                            setOpen(false);
                                            setErrors({});
                                            dispatch({ type: GET_ERRORS, payload: {} })}
                                        }
                                    >
                                        <Close />
                                    </IconButton>
                                }
                            >
                                {errors.msg || errors.message}
                            </Alert>
                        </Collapse>
                    }
                    <form onSubmit={handleFormSubmit} className={classes.form} noValidate>
                        <Grid container direction="column" spacing={4}>
                            <Grid item xs={12} style={{ alignSelf: 'center' }}>
                                <CheckCircleOutline className={classes.icon} />
                            </Grid>
                            <Grid item xs={12} style={{ alignSelf: 'center' }}>
                                <Typography variant="h6">Account Successfully Created</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Kindly provide a username.</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Username</Typography>
                                <TextField 
                                    value={Username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Username"
                                    helperText={errors.Username}
                                    fullWidth
                                    required
                                    error={errors.Username ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12} style={{ alignSelf: 'center' }}>
                                <Button 
                                    className={classes.button}
                                    variant="contained" 
                                    color="primary"
                                    type="submit"
                                >
                                    Proceed to dashboard
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </section>
        </>
    );
};

AddUsername.propTypes = {
    addUsername: PropTypes.func.isRequired
};

export default connect(undefined, { addUsername })(AddUsername);