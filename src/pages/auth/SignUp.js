import { Helmet } from 'react-helmet';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { LOGIN } from '../../routes';
import { COLORS } from '../../utils/constants';

import logo from '../../assets/img/logo.svg';
import img from '../../assets/img/sign-up.svg';

const useStyles = makeStyles(theme => ({
    aside: {
        backgroundColor: COLORS.lightTeal,
        height: '100vh',
        padding: [[theme.spacing(4), theme.spacing(2)]],

        '& div': {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'space-evenly',

            '& span': {
                width: '60%'
            }
            
        },

        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },

    logo: {
        // width: '50%'
    },

    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        height: '100vh',
        paddingLeft: theme.spacing(5)
    },

    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'none'
        }
    }
}));

const SignUp = (e) => {
    const classes = useStyles();

    return (
        <>
            <Helmet><title>Create Accoung | FXBlooms.com</title></Helmet>
            <section>
                <Grid container direction="row">
                    <Grid item xs={5} md={12} lg={5} className={classes.aside}>
                        <div>
                            <RouterLink to="/">
                                <img src={logo} className={classes.logo} alt="FX Blooms logo" />
                            </RouterLink>
                            <img src={img} alt="FX Blooms logo" />
                            <Typography variant="subtitle2" component="span">Thanks for visiting FXBlooms!</Typography>
                            <Typography variant="subtitle2" component="span">Our aim is to make P2P foreign currency exchange much less stressful, safer and faster.</Typography>
                            <Typography variant="subtitle2" component="span">Create an account today to see a list of available offerings.</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={7} md={12} lg={5} className={classes.formContainer}>
                        <div>
                            <Typography variant="h4">Create Account</Typography>
                            <Typography variant="subtitle2" component="span">Complete the form below to create an account.</Typography>
                        </div>
                        <form action="">
                            <Grid container direction="row" spacing={5}>
                                <Grid item xs={7} lg={12}>
                                    <TextField 
                                        className={classes.input}
                                        // value={email}
                                        // onChange={(e) => setEmail(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Email Address"
                                        label="Email Address" 
                                        // helperText={errors.email}
                                        fullWidth
                                        required
                                        // error={errors.email ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={7} lg={12}>
                                    <TextField 
                                        className={classes.input}
                                        // value={username}
                                        // onChange={(e) => setUsername(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Username"
                                        label="Username" 
                                        // helperText={errors.username}
                                        fullWidth
                                        required
                                        // error={errors.username ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={7} lg={12}>
                                    <TextField 
                                        className={classes.input}
                                        // value={password}
                                        // onChange={(e) => setPassword(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Password"
                                        label="Password" 
                                        // helperText={errors.password}
                                        fullWidth
                                        required
                                        // error={errors.password ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={7} lg={12}>
                                    <TextField 
                                        className={classes.input}
                                        // value={confirmPassword}
                                        // onChange={(e) => setConfirmPassword(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        placeholder="Confirm Password"
                                        label="Confirm Password" 
                                        // helperText={errors.confirmPassword}
                                        fullWidth
                                        required
                                        // error={errors.confirmPassword ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={7} lg={12}>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        fullWidth
                                    >
                                        Proceed
                                    </Button>
                                </Grid>
                                <Grid item xs={7} lg={12}>
                                    <Typography variant="subtitle1" component="p" style={{ fontWeight: 300 }}>
                                        Already have an account? <RouterLink to={LOGIN} className={classes.link}>Sign In</RouterLink>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </section>
        </>
    );
};

export default SignUp;