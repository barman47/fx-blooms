import { Box, makeStyles } from '@material-ui/core';
import { useEffect } from 'react';

import SetPin from './SetPin';

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(35),
        paddingRight: theme.spacing(35),

        [theme.breakpoints.down('md')]: {
            paddingLeft: theme.spacing(20),
            paddingRight: theme.spacing(20),
        },

        [theme.breakpoints.down('sm')]: {
            padding: 0
        },
    },
}));

const Pin = ({ handleSetTitle }) => {
    const classes = useStyles();

    useEffect(() => {
        handleSetTitle('Set Pin'); // Make this dynamic to change dependinng on whether PIN is being set or changed
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Box component="section" className={classes.root}>
                <SetPin />
            </Box>
        </>
    );
};

export default Pin;