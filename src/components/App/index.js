import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import "./app.css";
import Box from '@material-ui/core/Box';
import Copyright from '../Copyright';
import CarDetail from '../CarDetail';
import CheckoutPage from '../CheckoutPage';



// color codes:
//  #A2CEBD light green
//  #6D7A71 dark green

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#A2CEBD',
      contrastText: '#fff',
    },
    secondary: { main: '#6D7A71' },
    error: {
      main: '#dc3122'
    }
  },
});

const App = () => {
  const classes = useStyles();

  return <Router><ThemeProvider theme={theme}>
    <div className={classes.root}>

      <Navigation theme={theme}/>


      <Route exact path={ROUTES.LANDING} component={LandingPage}/>
      <Route path={ROUTES.SIGN_UP} component={SignUpPage}/>
      <Route path={ROUTES.SIGN_IN} component={SignInPage}/>
      <Route
        path={ROUTES.PASSWORD_FORGET}
        component={PasswordForgetPage}
      />
      <Route path={ROUTES.CHECKOUT} component={CheckoutPage}/>
      <Route path={ROUTES.CAR_DETAILS} component={CarDetail}/>
      <Route path={ROUTES.HOME} component={HomePage}/>
      <Route path={ROUTES.ACCOUNT} component={AccountPage}/>
      <Route path={ROUTES.ADMIN} component={AdminPage}/>

      <Box mt={5}>
        <Copyright />
      </Box>
    </div>
  </ThemeProvider>
  </Router>;
};

export default withAuthentication(App);
