/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './redux/create';
import {Provider} from 'react-redux';
import { createHistory } from 'history';
import { Router, useRouterHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect } from 'redux-connect';
import apiClient from './helpers/apiClient';

import getRoutes from './routes';
import config from '../src/config';
import react16polyfills from './lib/react16polyfills'

const client = apiClient();
const dest = document.getElementById('content');
const browserHistory = useRouterHistory(createHistory)({
  basename: '/' + config.projectName
})
const store = createStore(browserHistory, window.__data ,  {client});
const history = syncHistoryWithStore(browserHistory, store);

const component = (
  <Router render={(props) =>
        <ReduxAsyncConnect 
          {...props}
           helpers={{
            client
          }}
          filter={item => !item.deferred} />
      } history={history}>
    {getRoutes(store)}
  </Router>
);

react16polyfills((err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  ReactDOM.hydrate(
    <Provider store={store} key="provider">
      {component}
    </Provider>,
    dest
  );
});

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes ) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
  const DevTools = require('./containers/DevTools/DevTools');
  ReactDOM.hydrate(
    <Provider store={store} key="provider">
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    dest
  );
}
