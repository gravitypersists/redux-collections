import { combineReducers } from 'redux'
import todos from './todos'
import crud from 'redux-crud-collections'

const rootReducer = combineReducers({
  todos: crud.crudCollectionFor('todos', { uniqueBy: 'id' })
})

export default rootReducer
