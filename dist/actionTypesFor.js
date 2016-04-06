'use strict';

exports.__esModule = true;

exports.default = function (forKeyword) {
  return (0, _lodash.reduce)(types, appendName.bind(null, forKeyword), {});
};

var _toSnakeCase = require('to-snake-case');

var _toSnakeCase2 = _interopRequireDefault(_toSnakeCase);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var types = ['pend', 'add', 'failedToAdd', 'pendCreation', 'create', 'failedToCreate', 'pendUpdate', 'update', 'failedToUpdate', 'pendDeletion', 'delete', 'failedToDelete', 'empty', 'invalidate', 'replace'];

var appendName = function appendName(forKeyword, accumulator, type) {
  accumulator[type] = ((0, _toSnakeCase2.default)(type) + '_' + (0, _toSnakeCase2.default)(forKeyword)).toUpperCase();
  return accumulator;
};