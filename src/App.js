import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import PropTypes from 'prop-types';

import ScrollToTop from './components/layout/ScrollToTop';

import Home from './pages/home';
// import Landing from './pages/landing/Landing';

import Login from './pages/auth/Login';
import CreateProfile from './pages/auth/CreateProfile';
import CreateAccount from './pages/auth/CreateAccount';

import Dashboard from './pages/dashboard';

import AllListings from './pages/dashboard/listings/AllListings';
import EditListing from './pages/dashboard/listings/EditListing';
import MakeListing from './pages/dashboard/listings/MakeListing';
import UserDetails from './pages/dashboard/listings/UserDetails';

import Profile from './pages/dashboard/profile';

import Messages from './pages/dashboard/messages/Messages';

// import setAuthToken from './utils/setAuthToken';
// import isTokenExpired from './utils/tokenExpired';

import AdminLogin from './pages/auth/AdminLogin';
import AdminDashboard from './pages/adminDashboard';
import AdminHome from './pages/adminDashboard/home/Home';
import Customers from './pages/adminDashboard/customers/';
import Customer from './pages/adminDashboard/customer/';

import { getMe } from './actions/customer';

import { 
	ADMIN_DASHBOARD,
	ADMIN_HOME,
	ADMIN_LOGIN,
	CUSTOMERS,
	LOGIN, 
	SIGN_UP, 
	CREATE_ACCOUNT, 
	MAKE_LISTING,
	MESSAGES,
	DASHBOARD,
	DASHBOARD_HOME, 
	EDIT_LISTING,
	USER_DETAILS,
	PROFILE
} from './routes';

import reIssueToken from './utils/reIssueToken';

const theme = createMuiTheme({
	overrides: {
		MuiButton: {
		  	root: {
				borderRadius: '5px',
				boxShadow: 'none !important',
				paddingBottom: '14px',
				paddingTop: '14px',
				textTransform: 'capitalize'
		  	},
		},
	},
	palette: {
		primary: {
			// light: '#df3c3a',
			main: '#1e6262',
			// dark: '#990300'
		},

		text: {
			// primary: '#f8f8f8',
			// secondary: '#f8f8f8'
		}
	},

	breakpoints: {
		values: {
			xs: 0,
			sm: 480,
			md: 768,
			lg: 1024,
			xl: 1920
		}
	},

	typography: {
		fontFamily: "'BR Firma', sans-serif",
		fontWeightLight: 300,
		fontWeightRegular: 400,
		fontWeightMedium: 500,
		fontWeightBold: 600
	}
});

function App(props) {
// 	const history = useHistory();
const [title, setTitle] = useState('');


	useEffect(() => {
		// isTokenExpired();
		if (localStorage.FXBloomsAuthToken) {
			// const token = isTokenExpired(localStorage.FXBloomsAuthToken);
			// // Set auth token header auth
			// setAuthToken(localStorage.FXBloomsAuthToken);
			// props.getMe(history);
			reIssueToken();
		}
		// eslint-disable-next-line
	}, []);

	const handleSetTitle = (title) => setTitle(title);

	return (
		<ThemeProvider theme={theme}>
			<Router>
				<Switch>
					<ScrollToTop>
						<Route path="/" exact component={Home} />
						<Route path={LOGIN} exact component={Login} />
						<Route path={SIGN_UP} exact component={CreateProfile} />
						<Route path={CREATE_ACCOUNT} exact component={CreateAccount} />
						<Route path={DASHBOARD}>
							<Dashboard title={title}>
								<Route path={`${DASHBOARD}${DASHBOARD_HOME}`} exact component={() => <AllListings handleSetTitle={handleSetTitle} />} />
								<Route path={`${DASHBOARD}${MAKE_LISTING}`} exact component={() => <MakeListing handleSetTitle={handleSetTitle} />} />
								<Route path={`${DASHBOARD}${EDIT_LISTING}`} exact component={() => <EditListing handleSetTitle={handleSetTitle} />} />
								<Route path={`${DASHBOARD}${MESSAGES}`} exact component={() => <Messages handleSetTitle={handleSetTitle} />} />
								<Route path={`${DASHBOARD}${USER_DETAILS}`} exact component={() => <UserDetails handleSetTitle={handleSetTitle} />} />
								<Route path={`${DASHBOARD}${PROFILE}`} exact component={() => <Profile handleSetTitle={handleSetTitle} />} />
							</Dashboard>
						</Route>
						<Route path={ADMIN_LOGIN} exact component={AdminLogin} />
						<Route path={ADMIN_DASHBOARD}>
							<AdminDashboard title={title}>
								<Route path={`${ADMIN_DASHBOARD}${ADMIN_HOME}`} exact component={() => <AdminHome handleSetTitle={handleSetTitle} />} />
								<Route path={`${ADMIN_DASHBOARD}${CUSTOMERS}`} exact component={() => <Customers handleSetTitle={handleSetTitle} />} />
								<Route path={`${ADMIN_DASHBOARD}${CUSTOMERS}/:id`} exact component={() => <Customer handleSetTitle={handleSetTitle} />} />
							</AdminDashboard>
						</Route>
					</ScrollToTop>
				</Switch>
			</Router>
		</ThemeProvider>
	);
}

App.propTypes = {
	getMe: PropTypes.func.isRequired
};

export default connect(undefined, { getMe })(App);