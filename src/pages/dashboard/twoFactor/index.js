import { connect, useSelector } from 'react-redux';

import QrCode from './QrCode';
import DisableTwoFactor from './DisableTwoFactor';

const Index = () => {
    const { twoFactorEnabled } = useSelector(state => state.customer);
    return (
        <>
            {twoFactorEnabled ? <DisableTwoFactor /> : <QrCode />}
        </>
    );
};

export default Index;