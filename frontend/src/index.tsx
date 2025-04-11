import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import 'babel-polyfill';
import { PersistGate } from 'redux-persist/integration/react'

import configureStore from '@app/store/store';
import App from './app';

const { store, persistor } = configureStore();

window.global = window;

export default store;

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </Router>,
  document.getElementById('root'),
);
