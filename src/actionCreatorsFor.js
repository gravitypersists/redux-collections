import { isString, isArray } from 'lodash';

import actionTypesFor from './actionTypesFor';

const buildAction = (actions, action) => {
  switch (action) {
    case actions.fetchFailed:
    case actions.createFailed:
    case actions.deleteFailed:
    case actions.updateFailed:
      return function(a = '', b = [], c = {}) {
        if (isString(a)) {
          return { type: action, items: b, error: a, ...c }
        } else {
          return { type: action, items: a, error: '', ...c }
        }
      }

    case actions.fetchSuccess:
    case actions.createStart:
    case actions.createSuccess:
    case actions.updateStart:
    case actions.updateSuccess:
    case actions.deleteStart:
    case actions.deleteSuccess:
      return function(a = [], b = {}) {
        return { type: action, ...b, items: a }
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
