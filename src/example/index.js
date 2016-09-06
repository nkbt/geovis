import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';

import './reset.css';
import '../static/geovis.css';

import {App} from '../App';

import {attacks} from '../attacks/reducer';
import {controls} from '../controls/reducer';


const rootReducer = combineReducers({attacks, controls});
const middleware = process.env.NODE_ENV === 'production' ?
  undefined :
  applyMiddleware(
    require('redux-logger')({
      level: 'info',
      collapsed: true,
      timestamp: false,
      duration: true
    })
  );
const store = createStore(rootReducer, {}, middleware);


const appRoot = document.createElement('div');
appRoot.id = 'app';
document.body.appendChild(appRoot);
ReactDOM.render(<Provider store={store}><App /></Provider>, appRoot);
