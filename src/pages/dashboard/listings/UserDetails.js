import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button, Divider, Grid, TextField, Typography, useMediaQuery} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { COLORS } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
    root: {
        // border: '1px solid red',
        paddingLeft: theme.spacing(4),
        paddingTop: theme.spacing(2),

        [theme.breakpoints.down('md')]: {
            paddingRight: theme.spacing(4)
        },

        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },

    content: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        marginTop: theme.spacing(5),

        '& h6': {
            color: theme.palette.primary.main,
            marginLeft: theme.spacing(4),
            marginTop: theme.spacing(2)
        }
    },

    detail: {
        // border: '1px solid green',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        rowGap: theme.spacing(2),
        paddingLeft: theme.spacing(4),
        marginBottom: theme.spacing(3)
    },

    title: {
        fontWeight: 300
    },

    text: {
        fontWeight: 500
    },

    reportContainer: {
        marginTop: theme.spacing(5),

        '& h5': {
            marginBottom: theme.spacing(2)
        }
    }
}));

const UserDetails = () => {
    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('md'));
    const [Message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    return (
        <>
            <Helmet><title>User Details | FXBlooms.com</title></Helmet>
            <section className={classes.root}>
                <Typography variant="h5">User Details</Typography>
                <Grid container direction="column">
                    <Grid item xs={12} lg={7} className={classes.content}>
                        <Typography variant="h6">Personal Details</Typography>
                        <br /><Divider /><br />
                        <div className={classes.detail}>
                            <Typography variant="span" className={classes.title}>Username</Typography>
                            <Typography variant="span" className={classes.title}>Phone Number</Typography>
                            <Typography variant="span" className={classes.text}>barman47</Typography>
                            <Typography variant="span" className={classes.text}>+2348147233059</Typography>
                        </div>
                        <div className={classes.detail}>
                            <Typography variant="span" className={classes.title}>City</Typography>
                            <Typography variant="span" className={classes.title}>Country</Typography>
                            <Typography variant="span" className={classes.text}>Lagos</Typography>
                            <Typography variant="span" className={classes.text}>Nigeria</Typography>
                        </div>
                        <div className={classes.detail}>
                            <Typography variant="span" className={classes.title}>Successful Transactions</Typography>
                            <Typography variant="span" className={classes.title}>Listings</Typography>
                            <Typography variant="span" className={classes.text}>100</Typography>
                            <Typography variant="span" className={classes.text}>200</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} lg={7} className={classes.reportContainer}>
                        <Typography variant="h5">Report this User</Typography>
                        <form noValidate>
                            <Grid container direction="row" spacing={2}>
                                <Grid item xs={12} xl={9}>
                                    <TextField 
                                        className={classes.input}
                                        value={Message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        type="text"
                                        variant="outlined" 
                                        label="Message" 
                                        placeholder="Enter Message"
                                        helperText={errors.Message || errors.message}
                                        fullWidth
                                        multiline
                                        rows={matches ? 4 : 1}
                                        required
                                        error={errors.Message || errors.message ? true : false}
                                    />
                                </Grid>
                                <Grid item xs={12} xl={3}>
                                    <Button 
                                        className={classes.button}
                                        variant="contained" 
                                        color="primary"
                                        type="submit"
                                        fullWidth
                                    >
                                        Report
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </section>
        </>
    );
}

export default UserDetails;
