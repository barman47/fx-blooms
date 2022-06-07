import { useState } from 'react';
// import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { WITHDRAWALS } from '../../routes';

const PaymentRoute = ({ children }) => {
    const [test] = useState(true)
    const location = useLocation();
    // const { isAuthenticated } = useSelector(state => state.admin);
    return test ? children : <Navigate to={WITHDRAWALS} state={{ from: location }} replace />
};

export default PaymentRoute;