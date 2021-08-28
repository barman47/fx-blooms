import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, isAuthenticated, twoFactorEnabled, ...rest }) => (
    <Route 
        {...rest}
        render={props => isAuthenticated === true && twoFactorEnabled === true ? (
            <Component {...props} />
        ) : (
            <Redirect to="https://wp.fxblooms.com" />
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