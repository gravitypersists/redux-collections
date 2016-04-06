"use strict";

exports.__esModule = true;

exports.default = function (type) {
  var t = type.toUpperCase();
  return {
    pend: t + "_FETCH_START",
    add: t + "_FETCH_SUCCESS",
    failedToAdd: t + "_FETCH_FAILED",
    pendCreation: t + "_CREATE_START",
    create: t + "_CREATE_SUCCESS",
    failedToCreate: t + "_CREATE_FAILED",
    pendUpdate: t + "_UPDATE_START",
    update: t + "_UPDATE_SUCCESS",
    failedToUpdate: t + "_UPDATE_FAILED",
    pendDeletion: t + "_DELETE_START",
    delete: t + "_DELETE_SUCCESS",
    failedToDelete: t + "_DELETE_FAILED",
    empty: t + "_EMPTY",
    invalidate: t + "_INVALIDATE"
  };
};