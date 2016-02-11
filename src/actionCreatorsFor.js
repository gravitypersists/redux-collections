import { isString, isArray } from 'lodash';

import actionTypesFor from './actionTypesFor';

export default function(type) {
  const actions = actionTypesFor(type);
  let ret = {};
  for (const action in actions) {
    ret[action] = (a = {}, b = {}) => {
      if (isArray(a)) {
        return { type: actions[action], ...b, items: a }
      } else if (isString(a)) {
        return { type: actions[action], ...b, string: a }
      } else {
        return { type: actions[action], ...a }
      }

    }
  }
  return ret;
}
