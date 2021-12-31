import { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core';

import ScrollToTop from './components/layout/ScrollToTop';
import AdminRoute from './components/common/AdminRoute';
import PrivateRoute from './components/common/PrivateRoute';

import Home from './pages/home';
// import Landing from './pages/landing/Landing';

import Login from './pages/auth/Login';
import CreateAccount from './pages/auth/CreateAccount';
import SignUpSuccess from './pages/auth/SignUpSuccess';
import SignUpFailure from './pages/auth/SignUpFailure';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import QrCode from './pages/auth/QrCode';
import VerifyQrCode from './pages/auth/VerifyQrCode';
import VerifyEmail from './pages/auth/VerifyEmail';
import PendingVerification from './pages/auth/PendingVerification';

import AboutUs from './pages/aboutUs/AboutUs';
import ContactUs from './pages/contactUs/ContactUs';
import FAQs from './pages/faqs/FAQs';
import PrivacyPolicy from './pages/privacyPolicy/PrivacyPolicy';
import TermsAndConditions from './pages/termsAndConditions/TermsAndConditions';
import Disclaimer from './pages/disclaimer/Disclaimer';
import UserAgreement from './pages/userAgreement/UserAgreement';

import Dashboard from './pages/dashboard';

import AllListings from './pages/dashboard/listings/AllListings';
import MakeListing from './pages/dashboard/listings/MakeListing';
import UserDetails from './pages/dashboard/listings/UserDetails';

import Profile from './pages/dashboard/profile';

import Notifications from './pages/dashboard/notifications';

import Wallet from './pages/dashboard/wallet';

// import setAuthToken from './utils/setAuthToken';
// import isTokenExpired from './utils/tokenExpired';

import AdminLogin from './pages/auth/AdminLogin';
import AdminDashboard from './pages/adminDashboard';
import AdminHome from './pages/adminDashboard/home/Home';
import Customers from './pages/adminDashboard/customers/';
import Customer from './pages/adminDashboard/customer/';

import PageNotFound from './pages/PageNotFound';

// import { getMe } from './actions/customer';

import { 
	ABOUT_US,
	ADMIN_DASHBOARD,
	ADMIN_HOME,
	ADMIN_LOGIN,
	CUSTOMERS,
	LOGIN, 
	SIGN_UP, 
	SETUP_2FA,
	VERIFY_2FA,
	SIGNUP_SUCCESS,
	SIGNUP_FAILURE,
	MAKE_LISTING,
	NOTIFICATIONS,
	DASHBOARD,
	DASHBOARD_HOME, 
	DISCLAIMER,
	USER_DETAILS,
	PROFILE,
	FORGOT_PASSWORD,
	RESET_PASSWORD,
	TERMS,
	FAQS,
	PRIVACY_POLICY,
	VERIFY_EMAIL,
	PENDING_VERIFICATION,
	WALLET,
	CONTACT_US,
	USER_AGREEMENT
} from './routes';

// import reIssueToken from './utils/reIssueToken';

const theme = createTheme({
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


	// useEffect(() => {
	// 	// isTokenExpired();
	// 	if (localStorage.FXBloomsAuthToken) {
	// 		// const token = isTokenExpired(localStorage.FXBloomsAuthToken);
	// 		// // Set auth token header auth
	// 		// setAuthToken(localStorage.FXBloomsAuthToken);
	// 		// props.getMe(history);
	// 	}
	// 	// eslint-disable-next-line
	// }, []);

	const handleSetTitle = (title) => setTitle(title);

	return (
		<ThemeProvider theme={theme}>
			<Router>
				<ScrollToTop>
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path={LOGIN} exact component={Login} />
						<Route path={SIGN_UP} exact component={CreateAccount} />
						<Route path={PENDING_VERIFICATION} exact component={PendingVerification} />
						<Route path={VERIFY_EMAIL} exact component={VerifyEmail} />
						<Route path={SIGNUP_SUCCESS} exact component={SignUpSuccess} />
						<Route path={SIGNUP_FAILURE} exact component={SignUpFailure} />
						<Route path={SETUP_2FA} exact component={QrCode} />
						<Route path={VERIFY_2FA} exact component={VerifyQrCode} />
						<Route path={FORGOT_PASSWORD} exact component={ForgotPassword} />
						<Route path={RESET_PASSWORD} exact component={ResetPassword} />
						<Route path={ABOUT_US} exact component={AboutUs} />
						<Route path={CONTACT_US} exact component={ContactUs} />
						<Route path={TERMS} exact component={TermsAndConditions} />
						<Route path={FAQS} exact component={FAQs} />
						<Route path={PRIVACY_POLICY} exact component={PrivacyPolicy} />
						<Route path={DISCLAIMER} exact component={Disclaimer} />
						<Route path={DISCLAIMER} exact component={Disclaimer} />
						<Route path={USER_AGREEMENT} exact component={UserAgreement} />
						<PrivateRoute path={DASHBOARD}>
							<Dashboard title={title}>
								<PrivateRoute path={`${DASHBOARD}${DASHBOARD_HOME}`} exact component={() => <AllListings handleSetTitle={handleSetTitle} />} />
								<PrivateRoute path={`${DASHBOARD}${MAKE_LISTING}`} exact component={() => <MakeListing handleSetTitle={handleSetTitle} />} />
								<PrivateRoute path={`${DASHBOARD}${USER_DETAILS}/:id`} exact component={() => <UserDetails handleSetTitle={handleSetTitle} />} />
								<PrivateRoute path={`${DASHBOARD}${PROFILE}`} exact component={() => <Profile handleSetTitle={handleSetTitle} />} />
								<PrivateRoute path={`${DASHBOARD}${NOTIFICATIONS}`} exact component={() => <Notifications handleSetTitle={handleSetTitle} />} />
								<PrivateRoute path={`${DASHBOARD}${WALLET}`} exact component={() => <Wallet handleSetTitle={handleSetTitle} />} />
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
						<Route component={PageNotFound} exact />
					</Switch>
				</ScrollToTop>
			</Router>
		</ThemeProvider>
	);
}

// App.propTypes = {
// 	getMe: PropTypes.func.isRequired
// };

export default App;
// export default connect(undefined, { getMe })(App);