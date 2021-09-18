import React from "react";
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

// # Dashboard `/dashboard`
import Dashboard from './components/Dashboard'

// # Global `/`
import Navigation from './components/Navigation'
import Footer from './components/Footer/Footer'
import PrivacyPolicy from './components/Legal/PrivacyPolicy';
import TermsAndConditions from './components/Legal/TermsAndConditions';

function App() {
  return (
    <>
      <Router>
        <AuthContextProvider>
          <Navigation/>
          <Switch>
            <Route exact path="/"><Home/></Route>
            <Route exact path="/authentication"><Authentication/></Route>
            <Route exact path="/dashboard"><Dashboard/></Route>
            <Route exact path="/profile"><Profile/></Route>
            <Route exact path="/channels"><Channels/></Route>
            <Route exact path="/channels/edit/:channelID"><EditChannel/></Route>
            <Route exact path="/privacy"><PrivacyPolicy/></Route>
            <Route exact path="/terms"><TermsAndConditions/></Route>
          </Switch>
        </AuthContextProvider>
      </Router>
      <Footer/>
    </>
  );
}

export default App;
