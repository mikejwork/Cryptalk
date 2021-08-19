import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AuthContextProvider from "./contexts/AuthContext";

import Amplify from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);

ReactDOM.render(
  <React.StrictMode>
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
