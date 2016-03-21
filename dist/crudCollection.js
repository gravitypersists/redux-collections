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
    return options.uniqueBy ? (0, _lodash.uniqBy)(items, function (i) {
      return i.data[options.uniqueBy];
    }) : items;
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
      case actions.fetchStart:
        return 'pending';
      case actions.fetchSuccess:
        return 'success';
      case actions.fetchFailed:
        return 'error';
      default:
        return state;
    }
  };

  var errorReducer = function errorReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
      case actions.fetchStart:
        return null;
      case actions.fetchSuccess:
        return null;
      case actions.fetchFailed:
        return action.error;
      default:
        return state;
    }
  };

  var creatingReducer = function creatingReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? 'success' : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
      case actions.createStart:
        return 'pending';
      case actions.createSuccess:
        return 'success';
      case actions.createFailed:
        return 'error';
      default:
        return state;
    }
  };

  var failedCreationsReducer = function failedCreationsReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
      case actions.createFailed:
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

      case actions.fetchSuccess:
      case actions.createSuccess:
        return unique(mergeNew(state, action.items)).reverse().map(function (s) {
          return crudItem(s, action);
        });

      case actions.deleteStart:
        return state.map(function (s) {
          var filterOut = options.uniqueBy ? s.data[options.uniqueBy] : s.cid;
          return action.items.indexOf(filterOut) === -1 ? s : crudItem(s, action);
        });

      case actions.deleteSuccess:
        return state.filter(function (s) {
          var filterOut = options.uniqueBy ? s.data[options.uniqueBy] : s.cid;
          return action.items.indexOf(filterOut) === -1;
        });

      case actions.updateStart:
      case actions.updateSuccess:
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
    error: errorReducer,
    creating: creatingReducer,
    failedCreations: failedCreationsReducer,
    items: itemsReducer
  });
}