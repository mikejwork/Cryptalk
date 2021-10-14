/*
  Author: Michael
  Description:
    Intitial starting point for the app
  Related PBIs: nil
*/

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Amplify, { Storage } from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);
Storage.configure({ level: 'public' });

ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  document.getElementById('root')
);
