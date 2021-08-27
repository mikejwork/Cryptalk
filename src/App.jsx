import React from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

import AuthContextProvider from "./contexts/AuthContext";

import Home from './components/Home'
import Login from './components/Login'
import Footer from './components/Footer'
import Profile from './components/Profile'
import Channels from './components/Channels'
import Navigation from './components/Navigation'

import {PolicyPage} from './components/Agreements/PrivacyPolicy';
import {TermsPage} from './components/Agreements/Terms';

function App() {
  return (
      <Router>
        <AuthContextProvider>
          <Navigation/>
          <Switch>

            <Route exact path="/"> <Home/> </Route>
            <Route exact path="/authentication"> <Login/> </Route>
            <Route exact path="/channels"> <Channels/> </Route>
            <Route exact path="/profile"> <Profile/> </Route>
            <Route exact path="/privacy"> <PolicyPage/> </Route>
            <Route exact path="/terms"> <TermsPage/> </Route>

          </Switch>
          <Footer/>
        </AuthContextProvider>
      </Router>
  );
}

export default App;
