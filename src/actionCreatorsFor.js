import { isString, isArray } from 'lodash';

import actionTypesFor from './actionTypesFor';

const buildAction = (actions, action) => {
  switch (action) {
    case actions.failedToAdd:
    case actions.failedToCreate:
    case actions.failedToDelete:
    case actions.failedToUpdate:
      return function(a = '', b = [], c = {}) {
        if (isString(a)) {
          return { type: action, items: b, error: a, ...c }
        } else {
          return { type: action, items: a, error: '', ...c }
        }
      }

    case actions.add:
    case actions.pendCreation:
    case actions.create:
    case actions.pendUpdate:
    case actions.update:
    case actions.pendDeletion:
    case actions.delete:
      return function(a = [], b = {}) {
        return { type: action, ...b, items: a, noArgs: a.length === 0 }
      }

    default:
      return function(a = {}) {
        return { type: action, ...a }
      }
  }
}

export default function(type) {
  const actions = actionTypesFor(type);
  let ret = {};
  for (const action in actions) {
    ret[action] = buildAction(actions, actions[action])
  }
  return ret;
}
