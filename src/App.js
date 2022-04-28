import { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core';

import { 
	ABOUT_US,
	ADMIN_DASHBOARD,
	ADMIN_HOME,
	ADMIN_LOGIN,
	CUSTOMERS,
	LOGIN, 
	DEPOSITS,
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
	FORGOT_PASSWORD,
	RESET_PASSWORD,
	TERMS,
	FAQS,
	PRIVACY_POLICY,
	VERIFY_EMAIL,
	PENDING_VERIFICATION,
	WALLETS,
	FUND_WALLET,
	CONTACT_US,
	USER_AGREEMENT,
	ADD_USERNAME,
	LISTINGS,
	EDIT_LISTING,
	TRANSACTION_STATUS,
	WITHDRAWALS,
	VERIFF,
	TRANSACTIONS,
	BANK_ACCOUNTS,
	PROFILE,
	ID_VERIFICATION,
	TWO_FACTOR,
	PIN
} from './routes';

import FallBack from './components/common/FallBack';
import VeriffVerify from './pages/dashboard/profile/Veriff';

const ScrollToTop = lazy(() => import('./components/layout/ScrollToTop'));
const AdminRoute = lazy(() => import('./components/common/AdminRoute'));
const PrivateRoute = lazy(() => import('./components/common/PrivateRoute'));
// const Private404 = lazy(() => import('./elements/common/Private404'));

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
const EditListing = lazy(() => import('./pages/dashboard/listings/EditListing'));
const MakeListing = lazy(() => import('./pages/dashboard/listings/MakeListing'));
const UserDetails = lazy(() => import('./pages/dashboard/listings/UserDetails'));

const Profile = lazy(() => import('./pages/dashboard/profile'));

const IdVerification = lazy(() => import('./pages/dashboard/idVerification'));

const TwoFactor = lazy(() => import('./pages/dashboard/twoFactor'));

const Pin = lazy(() => import('./pages/dashboard/pin'));

const Notifications = lazy(() => import('./pages/dashboard/notifications'));

const TransactionStatus = lazy(() => import('./pages/dashboard/transactions/TransactionStatus'));
const Transactions = lazy(() => import('./pages/dashboard/transactions'));

const BankAccounts = lazy(() => import('./pages/dashboard/bankAccount'));

const Wallet = lazy(() => import('./pages/dashboard/wallet'));
const FundWallet = lazy(() => import('./pages/dashboard/wallet/FundWallet'));

const AdminLogin = lazy(() => import('./pages/auth/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/adminDashboard'));
const AdminHome = lazy(() => import('./pages/adminDashboard/home/Home'));
const Customers = lazy(() => import('./pages/adminDashboard/customers/'));
const Listings = lazy(() => import('./pages/adminDashboard/listings/'));
const Deposits = lazy(() => import('./pages/adminDashboard/deposits/'));
const Withdrawals = lazy(() => import('./pages/adminDashboard/withdrawals/'));
const Customer = lazy(() => import('./pages/adminDashboard/customer/'));

const PageNotFound = lazy(() => import('./pages/PageNotFound'));

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

		secondary: {
			main: '#EB5757'
		},

		danger: {
			main: 'red'
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

const App = () => {
	const [title, setTitle] = useState('');

	const handleSetTitle = (title) => setTitle(title);

	return (
		<ThemeProvider theme={theme}> 
			<Router>
				<Suspense fallback={<FallBack />}>
					<ScrollToTop>
						<Routes>
							<Route index path="/" element={<Home />} />
							<Route path={ADD_USERNAME} element={<AddUsername />} />
							<Route path={LOGIN} element={<Login />} />
							<Route path={SIGN_UP} element={<CreateAccount />} />
							<Route path={PENDING_VERIFICATION} element={<PendingVerification />} />
							<Route path={VERIFY_EMAIL} element={<VerifyEmail />} />
							<Route path={SIGNUP_SUCCESS} element={<SignUpSuccess />} />
							<Route path={SIGNUP_FAILURE} element={<SignUpFailure />} />
							<Route path={SETUP_2FA} element={<QrCode />} />
							<Route path={VERIFY_2FA} element={<VerifyQrCode />} />
							<Route path={FORGOT_PASSWORD} element={<ForgotPassword />} />
							<Route path={RESET_PASSWORD} element={<ResetPassword />} />
							<Route path={ABOUT_US} element={<AboutUs />} />
							<Route path={CONTACT_US} element={<ContactUs />} />
							<Route path={TERMS} element={<TermsAndConditions />} />
							<Route path={FAQS} element={<FAQs />} />
							<Route path={PRIVACY_POLICY} element={<PrivacyPolicy />} />
							<Route path={DISCLAIMER} element={<Disclaimer />} />
							<Route path={DISCLAIMER} element={<Disclaimer />} />
							<Route path={USER_AGREEMENT} element={<UserAgreement />} />
							
							<Route path={DASHBOARD} element={<PrivateRoute><Dashboard title={title} /></PrivateRoute>}>
								<Route index path={`${DASHBOARD_HOME}`} element={<AllListings handleSetTitle={handleSetTitle} />} />
								<Route path={`${EDIT_LISTING}`} element={<EditListing handleSetTitle={handleSetTitle} />} />
								<Route path={`${MAKE_LISTING}`} element={<MakeListing handleSetTitle={handleSetTitle} />} />
								<Route path={`${USER_DETAILS}/:id`} element={<UserDetails handleSetTitle={handleSetTitle} />} />
								<Route path={`${PROFILE}`} element={<Profile handleSetTitle={handleSetTitle} />} />
								<Route path={`${ID_VERIFICATION}`} element={<IdVerification handleSetTitle={handleSetTitle} />} />
								<Route path={`${TWO_FACTOR}`} element={<TwoFactor handleSetTitle={handleSetTitle} />} />
								<Route path={`${BANK_ACCOUNTS}`} element={<BankAccounts handleSetTitle={handleSetTitle} />} />
								<Route path={`${NOTIFICATIONS}`} element={<Notifications handleSetTitle={handleSetTitle} />} />
								<Route path={`${TRANSACTIONS}`} element={<Transactions handleSetTitle={handleSetTitle} />} />
								<Route path={`${TRANSACTION_STATUS}`} element={<TransactionStatus handleSetTitle={handleSetTitle} />} />
								<Route path={`${WALLETS}`} element={<Wallet handleSetTitle={handleSetTitle} />} />
								<Route path={`${FUND_WALLET}`} element={<FundWallet handleSetTitle={handleSetTitle} />} />
								<Route path={`${VERIFF}`} element={<VeriffVerify handleSetTitle={handleSetTitle} />} />
								<Route path={`${PIN}`} element={<Pin handleSetTitle={handleSetTitle} />} />
							</Route>
							
							<Route path={ADMIN_LOGIN} element={<AdminLogin />} />
							<Route path={ADMIN_DASHBOARD} element={<AdminRoute><AdminDashboard title={title} /></AdminRoute>}>
								<Route path={`${ADMIN_HOME}`} element={<AdminHome handleSetTitle={handleSetTitle} />} />
								<Route path={`${CUSTOMERS}`} element={<Customers handleSetTitle={handleSetTitle} />} />
								<Route path={`${LISTINGS}`} element={<Listings handleSetTitle={handleSetTitle} />} />
								<Route path={`${DEPOSITS}`} element={<Deposits handleSetTitle={handleSetTitle} />} />
								<Route path={`${CUSTOMERS}/:id`} element={<Customer handleSetTitle={handleSetTitle} />} />
								<Route path={`${WITHDRAWALS}`} element={<Withdrawals handleSetTitle={handleSetTitle} />} />
							</Route>
							<Route path="*" element={<PageNotFound />} />
						</Routes>
					</ScrollToTop>
				</Suspense>
			</Router>
		</ThemeProvider>
	);
}

export default App;