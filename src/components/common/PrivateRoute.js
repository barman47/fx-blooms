import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { LOGIN } from '../../routes';

import { AUTH_TOKEN } from '../../utils/constants';

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem(AUTH_TOKEN);
    const { isAuthenticated } = useSelector(state => state.customer);
    return isAuthenticated || token ? children : <Navigate to={LOGIN} state={{ from: location }} replace />
};

export default PrivateRoute;