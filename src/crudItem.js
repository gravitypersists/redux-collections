import { combineReducers } from 'redux';

import actionTypesFor from './actionTypesFor';

let currentClientID = 0;

export default function crudItem(forType) {
  const actions = actionTypesFor(forType);

  const statusReducer = (state = 'success', action = {}) => {
    switch (action.type) {
      case actions.pendUpdate:
        return 'updating';
      case actions.update:
        return 'success';
      case actions.failedToUpdate:
        return 'error'
      case actions.pendDeletion:
        return 'deleting';
      case actions.delete:
        return 'success'
      case actions.failedToDelete:
        return 'error'
      default:
        return state;
    }
  }

  const errorReducer = (state = null, action = {}) => {
    switch (action.type) {
      case actions.pendUpdate:
        return null;
      case actions.update:
        return null;
      case actions.failedToUpdate:
        return action.error;
      default:
        return state;
    }
  }

  const dataReducer = (state = {}, action = {}) => {
    switch (action.type) {
      case actions.update:
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
