import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import config from '../src/config';
import favicon from 'serve-favicon';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import createStore from '../src/redux/create';
import authCheckMiddleware from './middleware/authChecksMiddleware';
import middleware from './middleware/serverMiddleware';
import Html from '../src/helpers/Html';
import PrettyError from 'pretty-error';
import http from 'http';
import apiClient from '../src/helpers/apiClient';
import auth from 'http-auth';

import { match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';
import {Provider} from 'react-redux';
import getRoutes from '../src/routes';
import authRoutes from './routes/auth.js';
import indexRoutes from './routes/index.js';

var passport = require('passport');
require('./passport/auth.js')(passport);
var session  = require('express-session');
var cookieParser = require('cookie-parser')

const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort;
const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);
const staticFolder = 'static';
var basicAuth = require('basic-auth-connect');

app.use(compression());
app.set('etag', false);
app.use(Express.static(path.join(__dirname, '..', staticFolder),{ etag: false }));
app.use(Express.static(path.join(__dirname, '..', 'src', 'lib')));

app.use(session({ 
  secret: 'Marquina',
  saveUninitialized: true,
  cookie: { } //  secure: true  necesitariamos seguridad del proxy
  })
); 

app.use(passport.initialize());
app.use(passport.session()); 

app.use('/', indexRoutes);
app.use('/auth', authRoutes);

//MIDDLEWARES
app.use(middleware.addTrailingSlash(config.baseUrl)); 
app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }

  const providers = {
    client: apiClient(req)
  };
  
  const basename = '/' + config.projectName;
  const location = req.url.replace(basename, '')
  //console.log("location y basename --> " + location + " ------ " + basename)
  const memoryHistory = createMemoryHistory({ entries: [location], basename })
  const userData = req.user;

  const store = createStore(memoryHistory, { language: {lang: 'es', nextLang: 'es' }}, providers );
  const history = syncHistoryWithStore(memoryHistory, store);
  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(
        <Html
          assets={webpackIsomorphicTools.assets()}
          store={store}
          baseUrl={config.baseUrl}
          host={config.host}
        />
      )
    );
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  match({ history, routes: getRoutes(), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {

      loadOnServer({
        ...renderProps,
        store,
        helpers: { ...providers },
        filter: item => !item.deferred
      }).then(() => {
        const component = (
          <Provider store={store} userData = {userData} key="provider">
              <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );

        const is404 = renderProps.routes.find(r => r.status === 404) !== undefined;
        if (is404) {
          res.status(404).send('Not found');
        } else {
          const renderedComponentName = renderProps.components[1].displayName.replace(/Connect\(|\)/g, '').toLowerCase();
          global.navigator = {userAgent: req.headers['user-agent']};

          res.status(200).send('<!doctype html>\n' +
            ReactDOM.renderToString(
              <Html
                assets={webpackIsomorphicTools.assets()}
                component={component}
                store={store}
                bodyClass={renderedComponentName}
                baseUrl={config.baseUrl}
                host={config.host}
              />
            )
          );
        }
      });
    } else {
      res.status(404).send('Not found');
    }
  });
});

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    console.info('==> 💻  Open %s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
