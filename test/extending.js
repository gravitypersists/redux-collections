import expect from 'expect'
import { createStore } from 'redux'
import reduceReducers from 'reduce-reducers'

import crudCollection from '../src/crudCollection'
import actionCreatorsFor from '../src/actionCreatorsFor'

const testActions = actionCreatorsFor('test')

const customReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CUSTOM_ACTION_ON':
      return { ...state, customKey: true }
    case 'CUSTOM_ACTION_OFF':
      return { ...state, customKey: false }
    default:
      return state
  }
}

describe('Extending', () => {
  let reducer, store

  beforeEach(() => {
    reducer = reduceReducers(
      customReducer,
      crudCollection('test', { uniqueBy: 'id' })
    )
    store = createStore(reducer)
    store.dispatch(testActions.create([{ id:1 }, { id:2 }, { id:3 }]))
  })

  it('incorporates the custom reducer', () => {
    expect(store.getState().customKey).toBe(undefined)
    store.dispatch({ type: 'CUSTOM_ACTION_ON' })
    expect(store.getState().customKey).toBe(true)
    store.dispatch({ type: 'CUSTOM_ACTION_OFF' })
    expect(store.getState().customKey).toBe(false)
  })

})
