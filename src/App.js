import { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core';

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
	USER_AGREEMENT,
	ADD_USERNAME
} from './routes';

import FallBack from './components/common/FallBack';

const ScrollToTop = lazy(() => import('./components/layout/ScrollToTop'));
const AdminRoute = lazy(() => import('./components/common/AdminRoute'));
const PrivateRoute = lazy(() => import('./components/common/PrivateRoute'));
// const Private404 = lazy(() => import('./components/common/Private404'));

const Home = lazy(() => import('./pages/home'));
// import Landing from './pages/landing/Landing';

const AddUsername = lazy(() => import('./pages/auth/AddUsername'));
const Login = lazy(() => import('./pages/auth/Login'));
const CreateAccount = lazy(() => import('./pages/auth/CreateAccount'));
const SignUpSuccess = lazy(() => import('./pages/auth/SignUpSuccess'));
const SignUpFailure = lazy(() => import('./pages/auth/SignUpFailure'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const QrCode = lazy(() => import('./pages/auth/QrCode'));
const VerifyQrCode = lazy(() => import('./pages/auth/VerifyQrCode'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const PendingVerification = lazy(() => import('./pages/auth/PendingVerification'));

const AboutUs = lazy(() => import('./pages/aboutUs/AboutUs'));
const ContactUs = lazy(() => import('./pages/contactUs/ContactUs'));
const FAQs = lazy(() => import('./pages/faqs/FAQs'));
const PrivacyPolicy = lazy(() => import('./pages/privacyPolicy/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/termsAndConditions/TermsAndConditions'));
const Disclaimer = lazy(() => import('./pages/disclaimer/Disclaimer'));
const UserAgreement = lazy(() => import('./pages/userAgreement/UserAgreement'));

const Dashboard = lazy(() => import('./pages/dashboard'));

const AllListings = lazy(() => import('./pages/dashboard/listings/AllListings'));
const MakeListing = lazy(() => import('./pages/dashboard/listings/MakeListing'));
const UserDetails = lazy(() => import('./pages/dashboard/listings/UserDetails'));

const Profile = lazy(() => import('./pages/dashboard/profile'));

const Notifications = lazy(() => import('./pages/dashboard/notifications'));

const Wallet = lazy(() => import('./pages/dashboard/wallet'));

// import setAuthToken from './utils/setAuthToken';
// import isTokenExpired from './utils/tokenExpired';

const AdminLogin = lazy(() => import('./pages/auth/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/adminDashboard'));
const AdminHome = lazy(() => import('./pages/adminDashboard/home/Home'));
const Customers = lazy(() => import('./pages/adminDashboard/customers/'));
const Customer = lazy(() => import('./pages/adminDashboard/customer/'));

const PageNotFound = lazy(() => import('./pages/PageNotFound'));


// import { getMe } from './actions/customer';

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
			// light: '#338080',
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

function App() {
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
				<Suspense fallback={<FallBack />}>
					<ScrollToTop>
						<Switch>
							<Route path="/" exact component={Home} />
							<Route path={ADD_USERNAME} exact component={AddUsername} />
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
									<PrivateRoute path={`${DASHBOARD_HOME}`} exact component={() => <AllListings handleSetTitle={handleSetTitle} />} />
									<PrivateRoute path={`${MAKE_LISTING}`} exact component={() => <MakeListing handleSetTitle={handleSetTitle} />} />
									<PrivateRoute path={`${USER_DETAILS}/:id`} exact component={() => <UserDetails handleSetTitle={handleSetTitle} />} />
									<PrivateRoute path={`${PROFILE}`} exact component={() => <Profile handleSetTitle={handleSetTitle} />} />
									<PrivateRoute path={`${NOTIFICATIONS}`} exact component={() => <Notifications handleSetTitle={handleSetTitle} />} />
									<PrivateRoute path={`${WALLET}`} exact component={() => <Wallet handleSetTitle={handleSetTitle} />} />
								</Dashboard>
							</PrivateRoute>
							<Route path={ADMIN_LOGIN} exact component={AdminLogin} />
							<AdminRoute path={ADMIN_DASHBOARD}>
								<AdminDashboard title={title}>
									<AdminRoute path={`${ADMIN_HOME}`} exact component={() => <AdminHome handleSetTitle={handleSetTitle} />} />
									<AdminRoute path={`${CUSTOMERS}`} exact component={() => <Customers handleSetTitle={handleSetTitle} />} />
									<AdminRoute path={`${CUSTOMERS}/:id`} exact component={() => <Customer handleSetTitle={handleSetTitle} />} />
									{/* <AdminRoute exact component={() => <Private404 handleSetTitle={handleSetTitle} />} /> */}
								</AdminDashboard>
							</AdminRoute>
							<Route component={PageNotFound} exact />
						</Switch>
					</ScrollToTop>
				</Suspense>
			</Router>
		</ThemeProvider>
	);
}

// App.propTypes = {
// 	getMe: PropTypes.func.isRequired
// };

export default App;
// export default connect(undefined, { getMe })(App);