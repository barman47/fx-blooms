import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import PropTypes from 'prop-types';

import ScrollToTop from './components/layout/ScrollToTop';
import AdminRoute from './components/common/AdminRoute';
import PrivateRoute from './components/common/PrivateRoute';

import Home from './pages/home';
// import Landing from './pages/landing/Landing';

import Login from './pages/auth/Login';
import CreateAccount from './pages/auth/CreateAccount';
import CreateProfile from './pages/auth/CreateProfile';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import QrCode from './pages/auth/QrCode';
import VerifyQrCode from './pages/auth/VerifyQrCode';

import Faqs from './pages/faqs';
import PrivacyPolicy from './pages/privacyPolicy';
import TermsAndConditions from './pages/termsAndConditions';

import Dashboard from './pages/dashboard';

import AllListings from './pages/dashboard/listings/AllListings';
import EditListing from './pages/dashboard/listings/EditListing';
import MakeListing from './pages/dashboard/listings/MakeListing';
import UserDetails from './pages/dashboard/listings/UserDetails';

import Profile from './pages/dashboard/profile';

import Messages from './pages/dashboard/messages';
import MobileConversation from './pages/dashboard/messages/MobileConversation';

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
	SETUP_2FA,
	VERIFY_2FA,
	CREATE_PROFILE, 
	MAKE_LISTING,
	MESSAGES,
	DASHBOARD,
	DASHBOARD_HOME, 
	EDIT_LISTING,
	USER_DETAILS,
	PROFILE,
	FORGOT_PASSWORD,
	RESET_PASSWORD,
	TERMS,
	FAQS,
	PRIVACY_POLICY,
	MOBILE_CONVERSATION
} from './routes';

// import reIssueToken from './utils/reIssueToken';

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
						<Route path={SIGN_UP} exact component={CreateAccount} />
						<Route path={SETUP_2FA} exact component={QrCode} />
						<Route path={VERIFY_2FA} exact component={VerifyQrCode} />
						<Route path={CREATE_PROFILE} exact component={CreateProfile} />
						<Route path={FORGOT_PASSWORD} exact component={ForgotPassword} />
						<Route path={RESET_PASSWORD} exact component={ResetPassword} />
						<Route path={TERMS} exact component={TermsAndConditions} />
						<Route path={FAQS} exact component={Faqs} />
						<Route path={PRIVACY_POLICY} exact component={PrivacyPolicy} />
						<PrivateRoute path={DASHBOARD}>
							<Dashboard title={title}>
								<PrivateRoute path={`${DASHBOARD}${DASHBOARD_HOME}`} exact component={() => <AllListings handleSetTitle={handleSetTitle} />} />
								<PrivateRoute path={`${DASHBOARD}${MAKE_LISTING}`} exact component={() => <MakeListing handleSetTitle={handleSetTitle} />} />
								<PrivateRoute path={`${DASHBOARD}${EDIT_LISTING}`} exact component={() => <EditListing handleSetTitle={handleSetTitle} />} />
								<PrivateRoute path={`${DASHBOARD}${MESSAGES}`} exact component={() => <Messages handleSetTitle={handleSetTitle} />} />
								<PrivateRoute path={`${DASHBOARD}${USER_DETAILS}/:id`} exact component={() => <UserDetails handleSetTitle={handleSetTitle} />} />
								<PrivateRoute path={`${DASHBOARD}${PROFILE}`} exact component={() => <Profile handleSetTitle={handleSetTitle} />} />
								<PrivateRoute path={`${DASHBOARD}${MOBILE_CONVERSATION}`} exact component={() => <MobileConversation handleSetTitle={handleSetTitle} />} />
							</Dashboard>
						</PrivateRoute>
						<Route path={ADMIN_LOGIN} exact component={AdminLogin} />
						<AdminRoute path={ADMIN_DASHBOARD}>
							<AdminDashboard title={title}>
								<AdminRoute path={`${ADMIN_DASHBOARD}${ADMIN_HOME}`} exact component={() => <AdminHome handleSetTitle={handleSetTitle} />} />
								<AdminRoute path={`${ADMIN_DASHBOARD}${CUSTOMERS}`} exact component={() => <Customers handleSetTitle={handleSetTitle} />} />
								<AdminRoute path={`${ADMIN_DASHBOARD}${CUSTOMERS}/:id`} exact component={() => <Customer handleSetTitle={handleSetTitle} />} />
							</AdminDashboard>
						</AdminRoute>
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