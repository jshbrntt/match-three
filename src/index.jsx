require('./manifest.json');
require('./index.scss');
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import UI from './ui/ui.jsx'
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<UI name="Joshua"/>, document.querySelector('.ui'));
// import M3Engine from './m3/m3engine';
// var m3engine = new M3Engine();
// console.warn = () => {};
// import GoogleSignIn from './core/util/google-signin';
// window.onSignIn = GoogleSignIn.onSignIn;
