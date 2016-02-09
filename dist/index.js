'use strict';

exports.__esModule = true;

var _actionTypesFor = require('./actionTypesFor');

var _actionTypesFor2 = _interopRequireDefault(_actionTypesFor);

var _actionCreatorsFor = require('./actionCreatorsFor');

var _actionCreatorsFor2 = _interopRequireDefault(_actionCreatorsFor);

var _crudCollection = require('./crudCollection');

var _crudCollection2 = _interopRequireDefault(_crudCollection);

var _crudItem = require('./crudItem');

var _crudItem2 = _interopRequireDefault(_crudItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  actionTypesFor: _actionTypesFor2.default,
  actionCreatorsFor: _actionCreatorsFor2.default,
  crudCollectionFor: _crudCollection2.default,
  crudItemFor: _crudItem2.default
};