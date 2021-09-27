import React, { useRef } from "react";
import AuthContextProvider from "./contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

// # Homepage `/`
import Home from './components/Home/Home'

// # Authentication `/authentication`
import Authentication from './components/Authentication/Authentication'

// # Profile `/profile`
import Profile from './components/Profile/Profile'

// # Channels `/channels`
import Channels from './components/Channels/Channels'
import EditChannel from './components/Channels/EditChannel/EditChannel'

// # Global `/`
import Navigation from './components/Navigation/Navigation/Navigation'
import Footer from './components/Footer/Footer'
import PrivacyPolicy from './components/Legal/PrivacyPolicy';
import TermsAndConditions from './components/Legal/TermsAndConditions';

import Notification from './components/Wrappers/Notifications/Notifications'

function App() {
  // notifications
  const notificationRef = useRef(null)
  return (
    <>
      <Router>
        <Notification ref={notificationRef}/>
        <AuthContextProvider notificationRef={notificationRef}>
          <Navigation/>
          <Switch>
            <Route exact path="/"><Home/></Route>
            <Route exact path="/authentication"><Authentication/></Route>
            <Route exact path="/profile"><Profile/></Route>
            <Route exact path="/channels"><Channels/></Route>
            <Route exact path="/channels/edit/:channelID"><EditChannel/></Route>
            <Route exact path="/privacy"><PrivacyPolicy padding={true}/></Route>
            <Route exact path="/terms"><TermsAndConditions padding={true}/></Route>
          </Switch>
        </AuthContextProvider>
      </Router>
      <Footer/>
    </>
  );
}

export default App;
