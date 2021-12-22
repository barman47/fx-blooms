import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SET_2FA_MSG } from '../../../actions/types';

import DisableTwoFactor from './DisableTwoFactor';
import QrCode from './QrCode';
import VerifyQrCode from './VerifyQrCode';
import SuccessModal from '../../../components/common/SuccessModal';

const Index = () => {
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
        console.log('toggling showVerifyQrCode');
        setShowVerifyQrCode(!showVerifyQrCode)
    };

    return (
        <>  
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
            {/* {!hasSetup2FA && <QrCode />}
            {hasSetup2FA && twoFactorEnabled
                ?
                <DisableTwoFactor />
                :
                <>
                    {showVerifyQrCode ? <VerifyQrCode /> : <QrCode toggleShowVerifyQrCode={toggleShowVerifyQrCode} showVerifyQrCode={showVerifyQrCode} />}
                </>

            } */}
        </>
    );
};

export default Index;