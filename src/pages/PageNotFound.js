import { Link } from 'react-router-dom';

import { Button, Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';


import { COLORS } from '../utils/constants';
import logo from '../assets/img/logo.svg';

const useStyle = makeStyles(theme => ({
    logo: {
        marginLeft: theme.spacing(10),
        marginTop: theme.spacing(2),

        [theme.breakpoints.down('sm')]: {
            margin: `${theme.spacing(2)} auto`,
            width: 'initial'
        }
    },

    root: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: [[0, theme.spacing(5), theme.spacing(5), theme.spacing(5)]],

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2)
        },

        '& h4': {
            color: COLORS.offBlack,
            fontWeight: 500,
            marginBottom: theme.spacing(3)
        },

        '& p': {
            color: COLORS.offBlack,
            marginBottom: theme.spacing(3),
            fontWeight: 300
        }
    }
}));

const PageNotFound = () => {
    const classes = useStyle();

    return (
        <>
            <Link to="/" className={classes.link}>
                <img src={logo} alt="FXBLOOMS Logo" className={classes.logo} />
            </Link>
            <Box component="section" className={classes.root}>
                
                <Typography variant="h4">PAGE NOT FOUND</Typography>
                <Typography variant="subtitle2" component="p">Sorry, the content you're looking for doesn't exist.<br />It was either removed or you mistyped the link.</Typography>
                <Button variant="contained" component={Link} color="primary" to="/" size="large">Take Me Home</Button>
            </Box>
                
        </>  
    );
};

export default PageNotFound;