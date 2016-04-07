import * as types from '../constants/ActionTypes'
import fauxFetch from 'faux-fetch'
import crud from 'redux-crud-collections'

// Just setting up our fake fetcher to randomly delay
// and give us realistic response variations
const fetch = fauxFetch({
  delay: () => 100 + Math.random()*800
})

const todoActions = crud.actionCreatorsFor('todos')

let id = 0;
const newTodo = (text) => ({
  completed: false,
  id: ++id,
  text
})

export function getTodos() {
  return (dispatch, getState) => {
    dispatch(todoActions.pend())
    fetch({
      url: 'todos',
      success: (todos) => dispatch(todoActions.add(todos))
    })
  }
}

export function addTodo(text) {
  return (dispatch, getState) => {
    const todo = newTodo(text)
    dispatch(todoActions.pendCreation([todo]))
    fetch({
      url: 'todos',
      method: 'post',
      body: todo,
      success: (todos) => dispatch(todoActions.create([todo]))
    })
  }
}

export function deleteTodo(id) {
  return (dispatch, getState) => {
    dispatch(todoActions.pendDeletion([id]))
    fetch({
      url: `todos/${id}`,
      method: 'delete',
      body: [id],
      success: (todos) => dispatch(todoActions.delete([id]))
    })
  }
}

// TODOs:
//
// export function editTodo(id, text) {
//   return { type: types.EDIT_TODO, id, text }
// }
//
// export function completeTodo(id) {
//   return { type: types.COMPLETE_TODO, id }
// }
//
// export function completeAll() {
//   return { type: types.COMPLETE_ALL }
// }
//
// export function clearCompleted() {
//   return { type: types.CLEAR_COMPLETED }
// }
