'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (type) {
  var actions = (0, _actionTypesFor2.default)(type);
  var ret = {};

  var _loop = function _loop(action) {
    ret[action] = function () {
      var a = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var b = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (a.constructor === Array) {
        return _extends({ type: actions[action] }, b, { items: a });
      } else {
        return _extends({ type: actions[action] }, a);
      }
    };
  };

  for (var action in actions) {
    _loop(action);
  }
  return ret;
};

var _actionTypesFor = require('./actionTypesFor');

var _actionTypesFor2 = _interopRequireDefault(_actionTypesFor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }