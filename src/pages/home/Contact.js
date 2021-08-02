import { useState } from 'react';
import { Button, Grid, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Instagram, Linkedin, Twitter, Telegram } from 'mdi-material-ui';
import { COLORS } from '../../utils/constants';
import { CONTACT_US } from '../../routes';

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

    title: {
        color: theme.palette.primary.main,
        fontWeight: 600,

        [theme.breakpoints.down('sm')]: {
            textAlign: 'center'
        },
    },

    social: {
        backgroundColor: COLORS.white,
        borderRadius: '25px',
        display: 'inline-block',
        marginTop: theme.spacing(5),
        padding: [[theme.spacing(1), theme.spacing(2)]],
        width: 'initial', 

        [theme.breakpoints.down('md')]: {
            margin: [[theme.spacing(1), 0]]
        },

        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.spacing(4),
            width: '90%'
        },

        '& a': {
            marginRight: theme.spacing(4),

            '&:last-child': {
                marginRight: 0
            }
        }
    },

    icon: {
        color: theme.palette.primary.main
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

    const [errors, setErrors] = useState({});

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrors({});
    };

    return (
        <section className={classes.root} id={CONTACT_US}>
            <Grid container direction="row">
                <Grid item xs={12} md={12} lg={4}>
                    <Typography variant="subtitle1" component="p" className={classes.title}>Connect with us on social media</Typography>
                    <br />
                    <div className={classes.social}>
                        <a href="https://www.instagram/fxblooms" target="_blank" rel="noreferrer">
                            <Instagram className={classes.icon} />
                        </a>
                    
                        <a href="https://www.linkedin.com/company/fxblooms/" target="_blank" rel="noreferrer">
                            <Linkedin className={classes.icon} />
                        </a>
                        <a href="https://google.com" target="_blank" rel="noreferrer">
                            <Twitter className={classes.icon} />
                        </a>
                        <a href="https://google.com" target="_blank" rel="noreferrer">
                            <Telegram className={classes.icon} />
                        </a>
                    </div>
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    <Typography variant="subtitle1" component="p" className={classes.title}>Send us a mail</Typography>
                    <br />
                    <form onSubmit={handleFormSubmit}>
                        <Grid container direction="row" spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span">Full name</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter full name"
                                    helperText={errors.name}
                                    fullWidth
                                    required
                                    error={errors.name ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span">Phone number</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter phone number"
                                    helperText={errors.phone}
                                    fullWidth
                                    required
                                    error={errors.phone ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span">Email address</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter email address"
                                    helperText={errors.email}
                                    fullWidth
                                    required
                                    error={errors.email ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" component="span">Subject</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value.toUpperCase())}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter subject"
                                    helperText={errors.subject}
                                    fullWidth
                                    required
                                    error={errors.subject ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" component="span">Message</Typography>
                                <TextField 
                                    className={classes.input}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter message"
                                    helperText={errors.message}
                                    rows={1}
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
                                    type="submit"
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