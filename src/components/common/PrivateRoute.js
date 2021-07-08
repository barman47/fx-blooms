import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
    <Route 
        {...rest}
        render={props => isAuthenticated === true ? (
            <Component {...props} />
        ) : (
            <Redirect to="/" />
        )}
    />
);

PrivateRoute.propTypes = {
    isAuthenticated: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.customer.isAuthenticated
});

export default connect(mapStateToProps)(PrivateRoute);