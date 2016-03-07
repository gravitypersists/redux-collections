'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (type) {
  var actions = (0, _actionTypesFor2.default)(type);
  var ret = {};
  for (var action in actions) {
    ret[action] = buildAction(actions, actions[action]);
  }
  return ret;
};

var _lodash = require('lodash');

var _actionTypesFor = require('./actionTypesFor');

var _actionTypesFor2 = _interopRequireDefault(_actionTypesFor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildAction = function buildAction(actions, action) {
  switch (action) {
    case actions.fetchFailed:
    case actions.createFailed:
    case actions.deleteFailed:
    case actions.updateFailed:
      return function () {
        var a = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
        var b = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
        var c = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        if ((0, _lodash.isString)(a)) {
          return _extends({ type: action, items: b, error: a }, c);
        } else {
          return _extends({ type: action, items: a, error: '' }, c);
        }
      };

    case actions.fetchSuccess:
    case actions.createStart:
    case actions.createSuccess:
    case actions.updateStart:
    case actions.updateSuccess:
    case actions.deleteStart:
    case actions.deleteSuccess:
      return function () {
        var a = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
        var b = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return _extends({ type: action }, b, { items: a, noArgs: a.length === 0 });
      };

    default:
      return function () {
        var a = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        return _extends({ type: action }, a);
      };
  }
};