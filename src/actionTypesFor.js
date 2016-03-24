export default function(type) {
  const t = type.toUpperCase();
  return {
    fetchStart: `${t}_FETCH_START`,
    fetchSuccess: `${t}_FETCH_SUCCESS`,
    fetchFailed: `${t}_FETCH_FAILED`,
    createStart: `${t}_CREATE_START`,
    createSuccess: `${t}_CREATE_SUCCESS`,
    createFailed: `${t}_CREATE_FAILED`,
    updateStart: `${t}_UPDATE_START`,
    updateSuccess: `${t}_UPDATE_SUCCESS`,
    updateFailed: `${t}_UPDATE_FAILED`,
    deleteStart: `${t}_DELETE_START`,
    deleteSuccess: `${t}_DELETE_SUCCESS`,
    deleteFailed: `${t}_DELETE_FAILED`,
    empty: `${t}_EMPTY`,
    invalidate: `${t}_INVALIDATE`
  }
}
