import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { LOGIN } from '../../routes';

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const { isAuthenticated } = useSelector(state => state.customer);
    return isAuthenticated ? children : <Navigate to={LOGIN} state={{ from: location }} replace />
};

export default PrivateRoute;