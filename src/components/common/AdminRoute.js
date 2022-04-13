import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { ADMIN_LOGIN } from '../../routes';

const AdminRoute = ({ children }) => {
    const location = useLocation();
    const { isAuthenticated } = useSelector(state => state.admin);
    return isAuthenticated ? children : <Navigate to={ADMIN_LOGIN} state={{ from: location }} replace />
};

export default AdminRoute;