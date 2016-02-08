import { combineReducers } from 'redux';
import _ from 'lodash'; // redux is already using

import actionTypesFor from 'utils/actionTypesFor';
import crudItem from 'utils/crudItem';

export default function crudCollection(forType) {
  const actions = actionTypesFor(forType);

  const statusReducer = (state = 'success', action = {}) => {
    switch (action.type) {
    case actions.fetchStart:
      return 'pending';
    case actions.fetchSuccess:
      return 'success';
    case actions.fetchError:
      return 'error';
    default:
      return state;
    }
  }

  const errorReducer = (state = null, action = {}) => {
    switch (action.type) {
    case actions.fetchStart:
      return null;
    case actions.fetchSuccess:
      return null;
    case actions.fetchError:
      return action.error;
    default:
      return state;
    }
  }

  const itemsReducer = (state = [], action = {}) => {
    switch (action.type) {
    case actions.fetchSuccess:
      return action.items.map(s => crudItem(forType)({ data: s }, action));
    case actions.createSuccess:
      const mergedItems = [...state, ...action.items.map(s => ({ data: s }))]
      return mergedItems.map(s => crudItem(forType)(s, action));
    case actions.deleteSuccess:
      // TODO: id => cid
      return state.filter(s => action.items.indexOf(s.data.id) === -1);
    case actions.updateSuccess:
      return state.map(s => {
        const update = _.find(action.items, { cid: s.cid });
        return (update) ? crudItem(forType)(s, { ...action, ...update.update }) : s;
      });
    default:
      return state.map(s => crudItem(forType)(s, action));
    }
  }

  return combineReducers({
    status: statusReducer,
    error: errorReducer,
    items: itemsReducer
  });
}
