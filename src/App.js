import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

import ScrollToTop from './components/layout/ScrollToTop';

import Home from './pages/home';

import Login from './pages/auth/Login';
import CreateProfile from './pages/auth/CreateProfile';
import CreateAccount from './pages/auth/CreateAccount';

import Dashboard from './pages/dashboard';

import AllListings from './pages/dashboard/listings/AllListings';
import CreateListing from './pages/dashboard/listings/Create';
import Messages from './pages/dashboard/messages/Messages';

import { 
	LOGIN, 
	SIGN_UP, 
	CREATE_ACCOUNT, 
	CREATE_LISTING,
	MESSAGES,
	DASHBOARD,
	DASHBOARD_HOME 
} from './routes';

import { store } from './store';

const theme = createMuiTheme({
	overrides: {
		MuiButton: {
		  	root: {
				borderRadius: '5px',
				boxShadow: 'none',
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
		fontWeightBold: 600,

		button: {
			borderRadius: '25px'
		}
	}
});

function App() {
	return (
		<Provider store={store}>
			{/* <PersistGate loading={null} persistor={persistor}> */}
				{/* <Beforeunload onBeforeunload={clearPersistedState}> */}
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
											<Route path={`${DASHBOARD}${CREATE_LISTING}`} exact component={CreateListing} />
											<Route path={`${DASHBOARD}${MESSAGES}`} exact component={Messages} />
										</Dashboard>
									</Route>
								</ScrollToTop>
							</Switch>
						</Router>
					</ThemeProvider>
					{/* </Beforeunload> */}
			{/* </PersistGate> */}
		</Provider>
	);
}

export default App;
