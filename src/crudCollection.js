import { combineReducers } from 'redux';
import { find, uniqBy } from 'lodash';

import actionTypesFor from './actionTypesFor';
import crudItemFor from './crudItem';

export default function crudCollection(forType, options = {}) {
  const crudItem = crudItemFor(forType)

  const unique = (items) => {
    return !options.uniqueBy ? items :
      uniqBy(items, (i) => i.data ? i.data[options.uniqueBy] : i[options.uniqueBy]);
  }

  const mergeNew = (oldItems, newItems) => {
    return [...newItems.map(s => ({ data: s })).reverse(), ...oldItems.reverse()];
  }

  const actions = actionTypesFor(forType);

  const statusReducer = (state = 'none', action = {}) => {
    switch (action.type) {
      case actions.pend:
        return 'pending';
      case actions.add:
      case actions.replace:
        return 'success';
      case actions.failedToAdd:
        return 'error';
      default:
        return state;
    }
  }

  const validReducer = (state = false, action = {}) => {
    switch (action.type) {
      case actions.add:
      case actions.replace:
        return true;
      case actions.invalidate:
        return false;
      default:
        return state;
    }
  }

  const errorReducer = (state = null, action = {}) => {
    switch (action.type) {
      case actions.pend:
        return null;
      case actions.add:
      case actions.replace:
        return null;
      case actions.failedToAdd:
        return action.error;
      default:
        return state;
    }
  }

  const creatingReducer = (state = 'success', action = {}) => {
    switch (action.type) {
      case actions.pendCreation:
        return 'pending';
      case actions.create:
        return 'success';
      case actions.failedToCreate:
        return 'error';
      default:
        return state;
    }
  }

  const failedCreationsReducer = (state = [], action = {}) => {
    switch (action.type) {
      case actions.failedToCreate:
        return [...state, ...action.items.map(i => ({ data: i, error: action.error }))]
      default:
        return state.map(s => crudItem(s, action));
    }
  }

  const itemsReducer = (state = [], action = {}) => {
    switch (action.type) {

      case actions.add:
      case actions.create:
        return unique(mergeNew(state, action.items)).reverse().map(s => crudItem(s, action));

      case actions.replace:
        const newItems = unique(action.items.map(s => ({ data: s })))
        return newItems.map(s => crudItem(s, action));

      case actions.pendDeletion:
        return state.map(s => {
          const filterOut = (options.uniqueBy) ? s.data[options.uniqueBy] : s.cid;
          return (action.items.indexOf(filterOut) === -1) ? s : crudItem(s, action)
        })

      case actions.delete:
        return state.filter(s => {
          const filterOut = (options.uniqueBy) ? s.data[options.uniqueBy] : s.cid;
          return action.items.indexOf(filterOut) === -1
        });

      case actions.pendUpdate:
      case actions.update:
        if (action.noArgs) return state.map(s => crudItem(s, { ...action }));
        if (action.items.length === 0) return state;
        const cruddy = action.items[0].__cruddy;
        return state.map(s => {
          if (cruddy) {
            const itemUpdate = find(action.items, { cid: s.cid });
            if (!itemUpdate) return s;
            return crudItem(s, { ...action, update: itemUpdate.data });
          } else {
            const dataUpdate = find(action.items, (i) => i[options.uniqueBy] === s.data[options.uniqueBy])
            if (!dataUpdate) return s;
            return crudItem(s, { ...action, update: dataUpdate });
          }
        });

      case actions.empty:
        return [];

      default:
        return state.map(s => crudItem(s, action));

    }
  }

  return combineReducers({
    status: statusReducer,
    valid: validReducer,
    error: errorReducer,
    creating: creatingReducer,
    failedCreations: failedCreationsReducer,
    items: itemsReducer
  });
}
