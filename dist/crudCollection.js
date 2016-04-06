'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = crudCollection;

var _redux = require('redux');

var _lodash = require('lodash');

var _actionTypesFor = require('./actionTypesFor');

var _actionTypesFor2 = _interopRequireDefault(_actionTypesFor);

var _crudItem = require('./crudItem');

var _crudItem2 = _interopRequireDefault(_crudItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function crudCollection(forType) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var crudItem = (0, _crudItem2.default)(forType);

  var unique = function unique(items) {
    return !options.uniqueBy ? items : (0, _lodash.uniqBy)(items, function (i) {
      return i.data ? i.data[options.uniqueBy] : i[options.uniqueBy];
    });
  };

  var mergeNew = function mergeNew(oldItems, newItems) {
    return [].concat(_toConsumableArray(newItems.map(function (s) {
      return { data: s };
    }).reverse()), _toConsumableArray(oldItems.reverse()));
  };

  var actions = (0, _actionTypesFor2.default)(forType);

  var statusReducer = function statusReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? 'none' : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

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
  };

  var validReducer = function validReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
      case actions.add:
      case actions.replace:
        return true;
      case actions.invalidate:
        return false;
      default:
        return state;
    }
  };

  var errorReducer = function errorReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

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
  };

  var creatingReducer = function creatingReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? 'success' : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

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
  };

  var failedCreationsReducer = function failedCreationsReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
      case actions.failedToCreate:
        return [].concat(_toConsumableArray(state), _toConsumableArray(action.items.map(function (i) {
          return { data: i, error: action.error };
        })));
      default:
        return state.map(function (s) {
          return crudItem(s, action);
        });
    }
  };

  var itemsReducer = function itemsReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {

      case actions.add:
      case actions.create:
        return unique(mergeNew(state, action.items)).reverse().map(function (s) {
          return crudItem(s, action);
        });

      case actions.replace:
        var newItems = unique(action.items.map(function (s) {
          return { data: s };
        }));
        return newItems.map(function (s) {
          return crudItem(s, action);
        });

      case actions.pendDeletion:
        return state.map(function (s) {
          var filterOut = options.uniqueBy ? s.data[options.uniqueBy] : s.cid;
          return action.items.indexOf(filterOut) === -1 ? s : crudItem(s, action);
        });

      case actions.delete:
        return state.filter(function (s) {
          var filterOut = options.uniqueBy ? s.data[options.uniqueBy] : s.cid;
          return action.items.indexOf(filterOut) === -1;
        });

      case actions.pendUpdate:
      case actions.update:
        if (action.noArgs) return state.map(function (s) {
          return crudItem(s, _extends({}, action));
        });
        if (action.items.length === 0) return state;
        var cruddy = action.items[0].__cruddy;
        return state.map(function (s) {
          if (cruddy) {
            var itemUpdate = (0, _lodash.find)(action.items, { cid: s.cid });
            if (!itemUpdate) return s;
            return crudItem(s, _extends({}, action, { update: itemUpdate.data }));
          } else {
            var dataUpdate = (0, _lodash.find)(action.items, function (i) {
              return i[options.uniqueBy] === s.data[options.uniqueBy];
            });
            if (!dataUpdate) return s;
            return crudItem(s, _extends({}, action, { update: dataUpdate }));
          }
        });

      case actions.empty:
        return [];

      default:
        return state.map(function (s) {
          return crudItem(s, action);
        });

    }
  };

  return (0, _redux.combineReducers)({
    status: statusReducer,
    valid: validReducer,
    error: errorReducer,
    creating: creatingReducer,
    failedCreations: failedCreationsReducer,
    items: itemsReducer
  });
}