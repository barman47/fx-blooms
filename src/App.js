import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/home';
import Login from './pages/auth/Login';
import CreateProfile from './pages/auth/CreateProfile';
import CreateAccount from './pages/auth/CreateAccount';

import { LOGIN, SIGN_UP, CREATE_ACCOUNT } from './routes';

const theme = createMuiTheme({
	overrides: {
		MuiButton: {
		  	root: {
				borderRadius: '6px',
				boxShadow: 'none',
				paddingBottom: '14px',
				paddingTop: '14px',
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
		<ThemeProvider theme={theme}>
			<Router>
				<Switch>
					<ScrollToTop>
						<Route path="/" exact component={Home} />
						<Route path={LOGIN} exact component={Login} />
						<Route path={SIGN_UP} exact component={CreateProfile} />
						<Route path={CREATE_ACCOUNT} exact component={CreateAccount} />
					</ScrollToTop>
				</Switch>
			</Router>
		</ThemeProvider>
	);
}

export default App;
