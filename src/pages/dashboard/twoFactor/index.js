import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { SET_2FA_MSG } from '../../../actions/types';

import DisableTwoFactor from './DisableTwoFactor';
import QrCode from './QrCode';
import VerifyQrCode from './VerifyQrCode';
import SuccessModal from '../../../components/common/SuccessModal';

const useStyles = makeStyles(theme => ({

}));

const Index = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { hasSetup2FA, twoFactorEnabled } = useSelector(state => state.customer);
    const {  msg } = useSelector(state => state.twoFactor);
    
    const [showVerifyQrCode, setShowVerifyQrCode] = useState(false);

    const successModal = useRef();

    useEffect(() => {
        if (msg) {
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [msg]);

    const dismissSuccessModal = () => {
        setShowVerifyQrCode(false);
        dispatch({
            type: SET_2FA_MSG,
            payload: null
        });
    };

    const toggleShowVerifyQrCode = () => {
        setShowVerifyQrCode(!showVerifyQrCode)
    };

    return (
        <Box component="section" className={classes.root}>  
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
            {!hasSetup2FA ? 
                <>
                    {showVerifyQrCode ? <VerifyQrCode /> : <QrCode toggleShowVerifyQrCode={toggleShowVerifyQrCode} showVerifyQrCode={showVerifyQrCode} />}
                </>
                :
                twoFactorEnabled ?
                <DisableTwoFactor />
                :
                <>
                    {showVerifyQrCode ? <VerifyQrCode /> : <QrCode toggleShowVerifyQrCode={toggleShowVerifyQrCode} showVerifyQrCode={showVerifyQrCode} />}
                </>
            }
        </Box>
    );
};

export default Index;