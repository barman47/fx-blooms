import { useState } from 'react';
import { Button, Grid, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS } from '../../utils/constants';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.lightTeal,
        color: COLORS.offBlack,
        marginTop: theme.spacing(8),
        padding: [[theme.spacing(5), theme.spacing(10)]],

        '& h3': {
            fontWeight: 800,
            fontStyle: 'italic',
            marginBottom: theme.spacing(3)
        },

        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },

    input: {
        backgroundColor: 'transparent',
        '&:focus': {
            backgroundColor: 'transparent'
        }
    },

    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
}));

const Contact = () => {
    const classes = useStyles();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    // eslint-disable-next-line
    const [errors, setErrors] = useState({});

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
    };

    return (
        <section className={classes.root}>
            <Grid container direction="row">
                <Grid item xs={12} md={12} lg={6}>
                    <Typography variant="h3">Contact Us</Typography>
                    <Typography variant="subtitle2" component="span">Send us a mail</Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    <form onSubmit={handleFormSubmit}>
                        <Grid container direction="row" spacing={4}>
                            <Grid item xs={12} md={6}>
                                <TextField 
                                    className={classes.input}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    variant="filled" 
                                    label="Name" 
                                    helperText={errors.name || "e.g. John Doe"}
                                    fullWidth
                                    required
                                    error={errors.name ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField 
                                    className={classes.input}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="text"
                                    variant="filled" 
                                    label="Email Address" 
                                    helperText={errors.email || "e.g. john@gmail.com"}
                                    fullWidth
                                    required
                                    error={errors.email ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField 
                                    className={classes.input}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    type="text"
                                    variant="filled" 
                                    label="Phone Number" 
                                    helperText={errors.phone || "e.g. (+234) 801 234 5678"}
                                    fullWidth
                                    required
                                    error={errors.phone ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField 
                                    className={classes.input}
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value.toUpperCase())}
                                    type="text"
                                    variant="filled" 
                                    label="Subject" 
                                    helperText={errors.subject}
                                    fullWidth
                                    required
                                    error={errors.subject ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField 
                                    className={classes.input}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    type="text"
                                    variant="filled" 
                                    label="Message" 
                                    helperText={errors.message}
                                    rows={5}
                                    fullWidth
                                    required
                                    multiline
                                    error={errors.message ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12} className={classes.buttonContainer}>
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                >
                                    Send Message
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </section>
    );
};

export default Contact;