import actionTypesFor from './actionTypesFor';

export default function(type) {
  const actions = actionTypesFor(type);
  let ret = {};
  for (const action in actions) {
    ret[action] = (a = {}, b = {}) => {
      if (a.constructor === Array) {
        return { type: actions[action], ...b, items: a }
      } else {
        return { type: actions[action], ...a }
      }

    }
  }
  return ret;
}
