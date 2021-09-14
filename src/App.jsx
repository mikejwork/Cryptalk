import React from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

import AuthContextProvider from "./contexts/AuthContext";

import Home from './components/Home'
import Login from './components/Login'
import Footer from './components/Footer'
import Profile from './components/Profile'
import Channels from './components/Channels/Channels'
import ChannelSettings from './components/Channels/ChannelsSettings'
import Dashboard from './components/Dashboard'
import Navigation from './components/Navigation'

import {PrivacyPolicyPage} from './components/Legal/PrivacyPolicy';
import {TermsAndConditionsPage} from './components/Legal/TermsAndConditions';
import PasswordRecovery from "./components/Password-Recovery";

function App() {
  return (
      <Router>
        <AuthContextProvider>
          <Navigation/>
          <Switch>
            <Route exact path="/"><Home/></Route>
            <Route exact path="/authentication"><Login/></Route>
            <Route exact path="/privacy"><PrivacyPolicyPage/></Route>
            <Route exact path="/terms"><TermsAndConditionsPage/></Route>
            <Route exact path="/dashboard"><Dashboard/></Route>
            <Route exact path="/profile"><Profile/></Route>
            <Route exact path="/channels"><Channels/></Route>
            <Route exact path="/channels/edit/:channelID"><ChannelSettings/></Route>
            <Route exact path="/recover"> <PasswordRecovery/> </Route>
          </Switch>
          <Footer/>
        </AuthContextProvider>
      </Router>
  );
}

export default App;
