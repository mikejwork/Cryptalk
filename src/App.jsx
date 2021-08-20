import React from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

import Home from './components/Home'
import Login from './components/Login'
import Profile from './components/Profile'
import Channels from './components/Channels'
import Navigation from './components/Navigation'

function App() {
  return (
      <Router>
          <Navigation/>
          <Switch>
            <Route exact path="/">
              <Home/>
            </Route>

            <Route exact path="/authentication">
              <Login/>
            </Route>

            <Route exact path="/channels">
              <Channels/>
            </Route>

            <Route exact path="/profile">
              <Profile/>
            </Route>
          </Switch>
      </Router>
  );
}

export default App;
