import img from '../../assets/img/loader.svg';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',

        '& img': {
            [theme.breakpoints.down('sm')]: {
                width: '25%',
            }
        }
    }
}));

const FallBack = () => {
    const classes = useStyles();

    return (
        <Box component="div" className={classes.root}>
            <img src={img} alt="Loading . . ." />
        </Box>
    );
};

export default FallBack;