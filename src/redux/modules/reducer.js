import { combineReducers } from 'redux';
import multireducer from 'multireducer';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-connect';

import api from './api';

export default function createReducers(asyncReducers) {
  return {
  	routing: routerReducer,
	  reduxAsyncConnect,
	  api,
		...asyncReducers
  }
};

