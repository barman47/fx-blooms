import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, makeStyles } from '@material-ui/core';

import VerifyPhoneModal from './VerifyPhoneModal';
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
    const { isPhoneNumberVerified } = useSelector(state => state.customer);

    const verifyPhoneModal = useRef();

    useEffect(() => {
        handleSetTitle('Set Pin'); // Make this dynamic to change dependinng on whether PIN is being set or changed
        checkPhoneNumber();
        // eslint-disable-next-line
    }, []);

    const checkPhoneNumber = () => {
        if (!isPhoneNumberVerified) {
            verifyPhoneModal.current.openModal();
        }
    };

    return (
        <>
            <VerifyPhoneModal ref={verifyPhoneModal} />
            <Box component="section" className={classes.root}>
                <SetPin />
            </Box>
        </>
    );
};

export default Pin;