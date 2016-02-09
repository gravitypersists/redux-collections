'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = crudItem;

var _redux = require('redux');

var _actionTypesFor = require('utils/actionTypesFor');

var _actionTypesFor2 = _interopRequireDefault(_actionTypesFor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currentClientID = 0;

function crudItem(forType) {
  var actions = (0, _actionTypesFor2.default)(forType);

  var statusReducer = function statusReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? 'success' : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
      default:
        return state;
    }
  };

  var dataReducer = function dataReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
      case actions.updateSuccess:
        return _extends({}, state, action.update);
      default:
        return state;
    }
  };

  return (0, _redux.combineReducers)({
    status: statusReducer,
    data: dataReducer,
    cid: function cid() {
      var s = arguments.length <= 0 || arguments[0] === undefined ? currentClientID++ : arguments[0];
      return s;
    }
  });
}