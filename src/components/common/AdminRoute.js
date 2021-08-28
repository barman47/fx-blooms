import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const AdminRoute = ({ component: Component, isAuthenticated, ...rest }) => (
    <Route 
        {...rest}
        render={props => isAuthenticated ? (
            <Component {...props} />
        ) : (
            <Redirect to="https://wp.fxblooms.com" />
        )}
    />
);

AdminRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.admin.isAuthenticated
});

export default connect(mapStateToProps)(AdminRoute);