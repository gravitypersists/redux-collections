'use strict';

exports.__esModule = true;
exports.default = crudItem;

var _redux = require('redux');

var _actionTypesFor = require('./actionTypesFor');

var _actionTypesFor2 = _interopRequireDefault(_actionTypesFor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currentClientID = 0;

function crudItem(forType) {
  var actions = (0, _actionTypesFor2.default)(forType);

  var statusReducer = function statusReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? 'success' : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
      case actions.pendUpdate:
        return 'updating';
      case actions.update:
        return 'success';
      case actions.failedToUpdate:
        return 'error';
      case actions.pendDeletion:
        return 'deleting';
      case actions.delete:
        return 'success';
      case actions.failedToDelete:
        return 'error';
      default:
        return state;
    }
  };

  var errorReducer = function errorReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
      case actions.pendUpdate:
        return null;
      case actions.update:
        return null;
      case actions.failedToUpdate:
        return action.error;
      default:
        return state;
    }
  };

  var dataReducer = function dataReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
      case actions.update:
        if (action.noArgs) return state;
        return action.update;
      default:
        return state;
    }
  };

  return (0, _redux.combineReducers)({
    status: statusReducer,
    error: errorReducer,
    data: dataReducer,
    cid: function cid() {
      var s = arguments.length <= 0 || arguments[0] === undefined ? currentClientID++ : arguments[0];
      return s;
    },
    __cruddy: function __cruddy() {
      var s = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
      return s;
    }
  });
}