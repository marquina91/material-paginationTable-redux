import { createStore as _createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createMiddleware from './middleware/clientMiddleware';
import createReducers from './modules/reducer';

export function inject(store, name, asyncReducer) {
  if (store.asyncReducers[name]) return;
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(combineReducers(createReducers(store.asyncReducers)));
}

function getMissingReducers(reducers, data) {
  if (!data) return {};
  return Object.keys(data).reduce(
    (prev, next) => (reducers[next] ? prev : { ...prev, [next]: (state = {}) => state }),
    {}
  );
}

export default function createStore(history, data, client) {
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = routerMiddleware(history);
  let middleware;

  if (typeof client !== "undefined") {
    middleware = [createMiddleware(client), reduxRouterMiddleware];
  } else {
    middleware = reduxRouterMiddleware;
  }

  let enhancers = [applyMiddleware(...middleware)];
  if (__CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('../containers/common/DevTools/DevTools');
    enhancers = [
      ...enhancers,
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    ];
  }

  const finalCreateStore = compose(...enhancers)(_createStore);
  const missingReducers = getMissingReducers(createReducers(), data);
  const store = finalCreateStore(combineReducers(createReducers(missingReducers)), data);

  store.asyncReducers = {};
  store.inject = inject.bind(null, store);

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules/reducer', () => {
      const reducer = require('./modules/reducer');
      store.replaceReducer(combineReducers((reducer.default || reducer)(store.asyncReducers)));
    });
  }

  return store;
}
