import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { LOGIN } from '../../routes';

const PrivateRoute = ({ component: Component, isAuthenticated, twoFactorEnabled, ...rest }) => (
    <Route 
        {...rest}
        render={props => isAuthenticated === true && twoFactorEnabled === true ? (
            <Component {...props} />
        ) : (
            <Redirect to={LOGIN} />
        )}
    />
);

PrivateRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    twoFactorEnabled: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.customer.isAuthenticated,
    twoFactorEnabled: state.customer.isAuthenticated
});

export default connect(mapStateToProps)(PrivateRoute);