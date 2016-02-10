import { combineReducers } from 'redux';

import actionTypesFor from './actionTypesFor';

let currentClientID = 0;

export default function crudItem(forType) {
  const actions = actionTypesFor(forType);

  const statusReducer = (state = 'success', action = {}) => {
    switch (action.type) {
      default:
        return state;
    }
  }

  const dataReducer = (state = {}, action = {}) => {
    switch (action.type) {
      case actions.updateSuccess:
        return action.update;
      default:
        return state;
    }
  }

  return combineReducers({
    status: statusReducer,
    data: dataReducer,
    cid: (s = currentClientID++) => s,
    __cruddy: (s = true) => s
  });
}
