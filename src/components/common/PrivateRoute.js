import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import { LOGIN } from '../../routes';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated } = useSelector(state => state.customer);

    return (
        <Route 
            {...rest}
            render={props => isAuthenticated === true ? (
                <Component {...props} />
            ) : (
                <Redirect to={LOGIN} />
            )}
        />
    );
};

export default PrivateRoute;