/*
  Author: Michael
  Description:
    Contains the router for the app, all pages navigation and contexts.
  Related PBIs: nil
*/

import React, { useRef } from "react";
import AuthContextProvider from "./contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';
import Profile from './components/Profile/Profile/Profile';
import PrivacyPolicy from './components/Legal/PrivacyPolicy';
import Channels from './components/Channels/Channels/Channels';
import Navigation from './components/Navigation/Navigation/Navigation';
import TermsAndConditions from './components/Legal/TermsAndConditions';
import Notification from './components/Wrappers/Notifications/Notifications';
import Authentication from './components/Authentication/Authentication/Authentication';

import SocketHandler from './socket/SocketHandler';

function App() {
  const notificationRef = useRef(null)
  return (
    <>
      <Router>
        <Notification ref={notificationRef}/>
        <AuthContextProvider notificationRef={notificationRef}>
          <Navigation/>
          <SocketHandler>
            <Switch>
              <Route exact path="/"><Home/></Route>
              <Route exact path="/authentication"><Authentication/></Route>
              <Route exact path="/profile"><Profile/></Route>
              <Route exact path="/channels"><Channels/></Route>
              <Route exact path="/privacy"><PrivacyPolicy padding={true}/></Route>
              <Route exact path="/terms"><TermsAndConditions padding={true}/></Route>
            </Switch>
          </SocketHandler>
        </AuthContextProvider>
      </Router>
      <Footer/>
    </>
  );
}

export default App;
