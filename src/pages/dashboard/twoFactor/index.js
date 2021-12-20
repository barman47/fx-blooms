import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import QrCode from './QrCode';
import DisableTwoFactor from './DisableTwoFactor';
import { SET_2FA_MSG } from '../../../actions/types';

import SuccessModal from '../../../components/common/SuccessModal';

const Index = () => {
    const dispatch = useDispatch();
    const { hasSetup2FA, msg, twoFactorEnabled } = useSelector(state => state.customer);

    const successModal = useRef();

    useEffect(() => {
        if (msg) {
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [msg]);

    const dismissSuccessModal = () => {
        dispatch({
            type: SET_2FA_MSG,
            payload: null
        });
    };
    return (
        <>  
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
            {hasSetup2FA ? 
                <QrCode />
                :
                twoFactorEnabled ?
                <DisableTwoFactor />
                :
                <QrCode />
            }
        </>
    );
};

export default Index;