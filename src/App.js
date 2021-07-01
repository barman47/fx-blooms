import { useEffect } from 'react';
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

import Messages from './pages/dashboard/messages/Messages';

// import setAuthToken from './utils/setAuthToken';
// import isTokenExpired from './utils/tokenExpired';

import { getMe } from './actions/customer';

import { 
	LOGIN, 
	SIGN_UP, 
	CREATE_ACCOUNT, 
	MAKE_LISTING,
	MESSAGES,
	DASHBOARD,
	DASHBOARD_HOME, 
	EDIT_LISTING,
	USER_DETAILS
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
										<Dashboard>
											<Route path={`${DASHBOARD}${DASHBOARD_HOME}`} exact component={AllListings} />
											<Route path={`${DASHBOARD}${MAKE_LISTING}`} exact component={MakeListing} />
											<Route path={`${DASHBOARD}${EDIT_LISTING}`} exact component={EditListing} />
											<Route path={`${DASHBOARD}${MESSAGES}`} exact component={Messages} />
											<Route path={`${DASHBOARD}${USER_DETAILS}`} exact component={UserDetails} />
										</Dashboard>
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