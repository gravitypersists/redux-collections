import { combineReducers } from 'redux';
import { find, uniqBy } from 'lodash';

import actionTypesFor from './actionTypesFor';
import crudItemFor from './crudItem';

export default function crudCollection(forType, options = {}) {
  const crudItem = crudItemFor(forType)

  const unique = (items) => {
    return options.uniqueBy ? uniqBy(items, (i) => i.data[options.uniqueBy]) : items;
  }

  const mergeNew = (oldItems, newItems) => {
    return [...newItems.map(s => ({ data: s })), ...oldItems.reverse()];
  }

  const actions = actionTypesFor(forType);

  const statusReducer = (state = 'success', action = {}) => {
    switch (action.type) {
      case actions.fetchStart:
        return 'pending';
      case actions.fetchSuccess:
        return 'success';
      case actions.fetchFailed:
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
      case actions.fetchFailed:
        return action.string;
      default:
        return state;
    }
  }

  const itemsReducer = (state = [], action = {}) => {
    switch (action.type) {

      case actions.fetchSuccess:
        return unique(mergeNew(state, action.items)).reverse().map(s => crudItem(s, action));

      case actions.createSuccess:
        return unique(mergeNew(state, action.items)).reverse().map(s => crudItem(s, action));

      case actions.deleteSuccess:
        return state.filter(s => {
          const filterOut = (options.uniqueBy) ? s.data[options.uniqueBy] : s.cid;
          return action.items.indexOf(filterOut) === -1
        });

      case actions.updateSuccess:
        if (action.items.length === 0) return state;
        const cruddy = action.items[0].__cruddy;
        return state.map(s => {
          if (cruddy) {
            const itemUpdate = find(action.items, { cid: s.cid });
            if (!itemUpdate) return s;
            return crudItem(s, { ...action, update: itemUpdate.data });
          } else {
            const dataUpdate = find(action.items, (i) => i[options.uniqueBy]);
            if (!dataUpdate) return s;
            return crudItem(s, { ...action, update: dataUpdate });
          }
        });

      default:
        return state.map(s => crudItem(s, action));

    }
  }

  return combineReducers({
    status: statusReducer,
    error: errorReducer,
    items: itemsReducer
  });
}
