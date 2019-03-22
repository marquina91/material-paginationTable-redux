import config from '../../config';
import axios from 'axios';

const GET_DATA_SUCCESS = 'api/GET_DATA_SUCCESS';
const ERROR_LOADING_DATA = 'api/ERROR_LOADING_DATA';
const LOADING_DATA = 'api/LOADING_DATA';
const SET_DATA_PROVIDER = 'api/SET_DATA_PROVIDER';
const SET_DELETE_DATA_PROVIDER = 'api/SET_DELETE_DATA_PROVIDER';
const SET_DATA_ELEMENT_PROVIDER = 'api/SET_DATA_ELEMENT_PROVIDER';
const ADD_DATA_ELEMENT_PROVIDER = 'api/ADD_DATA_ELEMENT_PROVIDER';

const initialState = {
  order: 'asc',
  totalDataProvider: 0,
  orderBy: 'id',
  selected: [],
  data: [],
  loading: false,
  page: 1,
  totalPages: 0,
  rowsPerPage: 5,
  lastId: [],
  diff: 0,
  error: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case GET_DATA_SUCCESS:
      return {
        ...state,
        data: [
          ...state.data,
          ...action.result.data
        ],
        totalDataProvider: action.result.total + state.diff,
        totalPages: action.result.total_pages,
        page: action.result.page,
        loading: false,
        error: null
      };
    case ERROR_LOADING_DATA:
      return {
        ...state,
        data: [
          ...state.data
        ],
        error: action.error
      };
    case SET_DATA_PROVIDER:
      return {
        ...state,
        data: action.newState
      }; 
    case SET_DELETE_DATA_PROVIDER:
      return {
        ...state,
        data: action.newState.data,
        diff: state.diff - action.newState.num,
        totalDataProvider: state.totalDataProvider - action.newState.num,
      }; 
    case SET_DATA_ELEMENT_PROVIDER:
      return {
        ...state,
        data: state.data.map(
           (dat, i) => i === action.newState.index ? action.newState.element : dat
       )
      };
    case ADD_DATA_ELEMENT_PROVIDER:
      return {
        ...state,
        data: [
          ...state.data,
          action.newState
        ],
        diff: state.diff + 1,
        totalDataProvider: state.totalDataProvider + 1,
      };
    default:
      return state;
  }
};

export function getInitialData( perPage , page ) {
  return {
    types: [LOADING_DATA, GET_DATA_SUCCESS, ERROR_LOADING_DATA],
    promise: ({ client }) => {
       return client.get("https://reqres.in/api/users?per_page=" + perPage + "&page=" + page)
    }
  };
}

export function getNextPage( perPage , page ) {
  return {
    types: [LOADING_DATA, GET_DATA_SUCCESS, ERROR_LOADING_DATA],
    promise: ({ client }) => {
       return client.get("https://reqres.in/api/users?per_page=" + perPage + "&page=" + page)
    }
  };
}

export function setData( newDataProvider ) {
  return {
    type: SET_DATA_PROVIDER,
    newState: newDataProvider
  };
}
export function setDataDelete( newDataProvider , num ) {
  return {
    type: SET_DELETE_DATA_PROVIDER,
    newState: { data: newDataProvider , num: num}
  };
}

export function editDataProvider( newObject , indexToReplace ) {
  return {
    type: SET_DATA_ELEMENT_PROVIDER,
    newState: {element: newObject, index: indexToReplace}
  };
}
export function addDataProvider( newObject ) {
  return {
    type: ADD_DATA_ELEMENT_PROVIDER,
    newState: newObject
  };
}