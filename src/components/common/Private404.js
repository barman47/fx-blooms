import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
    Box,
    Button,
    Typography
} from '@material-ui/core';

import { COLORS } from '../../utils/constants';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '85vh',

        '& h4': {
            fontWeight: 500,
            marginBottom: theme.spacing(3)
        },

        '& h6': {
            color: COLORS.offBlack,
            fontWeight: 300,
            marginBottom: theme.spacing(3),

            [theme.breakpoints.down('sm')]: {
                textAlign: 'center'
            }
        }
    }
}));

const Private404 = (props) => {
    const classes = useStyles();

    const { handleSetTitle } = props;

    useEffect(() => {
        handleSetTitle('Page Not Found');
        // eslint-disable-next-line
    }, []);

    return (
        <Box component="div" className={classes.root}>
            <Typography variant="h4" color="primary">Page Not Found</Typography>
            <Typography variant="h6">You seem lost. The page you are looking for does not exist.</Typography>
            <Button variant="contained" color="primary" component={RouterLink} to="/">Take Me Home</Button>
        </Box>
    );
}

export default Private404;