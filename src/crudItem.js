import { combineReducers } from 'redux';

import actionTypesFor from './actionTypesFor';

let currentClientID = 0;

export default function crudItem(forType) {
  const actions = actionTypesFor(forType);

  const statusReducer = (state = 'success', action = {}) => {
    switch (action.type) {
      case actions.updateStart:
        return 'updating';
      case actions.updateSuccess:
        return 'success';
      case actions.updateFailed:
        return 'error'
      case actions.deleteStart:
        return 'deleting';
      case actions.deleteSuccess:
        return 'success'
      case actions.deleteFailed:
        return 'error'
      default:
        return state;
    }
  }

  const errorReducer = (state = null, action = {}) => {
    switch (action.type) {
      case actions.updateStart:
        return null;
      case actions.updateSuccess:
        return null;
      case actions.updateFailed:
        return action.error;
      default:
        return state;
    }
  }

  const dataReducer = (state = {}, action = {}) => {
    switch (action.type) {
      case actions.updateSuccess:
        if (action.noArgs) return state;
        return action.update;
      default:
        return state;
    }
  }

  return combineReducers({
    status: statusReducer,
    error: errorReducer,
    data: dataReducer,
    cid: (s = currentClientID++) => s,
    __cruddy: (s = true) => s
  });
}
