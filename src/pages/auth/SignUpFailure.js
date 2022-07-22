import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
    Container,
    Button,
    Typography 
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import { COLORS } from '../../utils/constants';

import logo from '../../assets/img/logo.svg';

const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: theme.spacing(5),
        
        [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing(2)
        }
    },
    
    content: {
        backgroundColor: COLORS.lightTeal,
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(3),
        justifyContent: 'center',
        fontWeight: 300,
        margin: [[theme.spacing(5), 'auto', 0, 'auto']],
        padding: [[theme.spacing(7), theme.spacing(3)]],
        textAlign: 'center',
        width: '50%',

        [theme.breakpoints.down('md')]: {
            width: '70%'
        },

        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(2),
            padding: [[theme.spacing(3), theme.spacing(1)]],
            width: '95%'
        },

        '& p': {
            fontWeight: 300
        }
    },

    link: {
        color: theme.palette.primary.main,
        fontWeight: 500,
    }
}));

const SignUpFailure = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    return (
        <>
            <Helmet><title>Signup Successful | FXBLOOMS.com</title></Helmet>
            <Container className={classes.root}>
                <Link to="/" className={classes.logo}>
                    <img src={logo} className={classes.logo} alt="FXBLOOMS Logo" />
                </Link>
                <div className={classes.content}>
                    <Typography variant="h5">Sign Up Failed</Typography>
                    <Typography variant="subtitle1" component="p">Sign up was unsuccessful. Please try again.</Typography>
                    <Button color="primary" onClick={() => navigate(-1)}>Try Again</Button>
                </div>
            </Container>
        </>
    );
};

export default SignUpFailure;