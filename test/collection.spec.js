import expect from 'expect'
import { createStore } from 'redux'
import { last, find, filter, uniq } from 'lodash'

import crudCollection from '../src/crudCollection'
import actionCreatorsFor from '../src/actionCreatorsFor'

const testActions = actionCreatorsFor('test')

describe('Initialize', () => {
  let reducer, store

  before(() => {
    reducer = crudCollection('test')
    store = createStore(reducer)
  })

  it('does not inject anything before use', () => {
    expect(store.getState().items).toEqual([])
  })

  it('has error set to null', () => {
    expect(store.getState().error).toEqual(null)
  })

  it('has status set to "none"', () => {
    expect(store.getState().status).toEqual('none')
  })

  it('has valid set to false', () => {
    expect(store.getState().valid).toEqual(false)
  })

})

describe('Empty', () => {
  let reducer, store

  beforeEach(() => {
    reducer = crudCollection('test', { uniqueBy: 'id' })
    store = createStore(reducer)
    store.dispatch(testActions.create([{ id:1 }, { id:2 }, { id:3 }]))
  })

  it('empties the collection', () => {
    store.dispatch(testActions.empty());
    expect(store.getState().items.length).toEqual(0);
  })
})

describe('Invalidate', () => {
  let reducer, store

  beforeEach(() => {
    reducer = crudCollection('test', { uniqueBy: 'id' })
    store = createStore(reducer)
    store.dispatch(testActions.add([{ id:1 }, { id:2 }, { id:3 }]))
  })

  it('set the collections valid to false', () => {
    store.dispatch(testActions.invalidate());
    expect(store.getState().valid).toEqual(false);
  })
})

describe('Replace', () => {
  let reducer, store

  beforeEach(() => {
    reducer = crudCollection('test', { uniqueBy: 'id' })
    store = createStore(reducer)
    store.dispatch(testActions.add([{ id:1 }, { id:2 }, { id:3 }]))
  })

  it('replaces the collections entirely with the new', () => {
    const firstItem = store.getState().items[0].data;
    store.dispatch(testActions.replace([{ id:5 }]));
    const deletedItem = find(store.getState().items, i => i.data.id === firstItem.id);
    expect(deletedItem).toBe(undefined);
    const newItem = find(store.getState().items, i => i.data.id === 5);
    expect(newItem).toNotBe(undefined);
    expect(store.getState().items.length).toEqual(1);
  })

  it('sets the collections status to success', () => {
    store.dispatch(testActions.pend());
    store.dispatch(testActions.replace([]));
    expect(store.getState().status).toEqual('success');
  })

  it('sets the collections valid to true', () => {
    store.dispatch(testActions.invalidate());
    store.dispatch(testActions.replace([]));
    expect(store.getState().valid).toEqual(true);
  })

  it('sets the collections error to null', () => {
    store.dispatch(testActions.failedToAdd());
    store.dispatch(testActions.replace([]));
    expect(store.getState().error).toEqual(null);
  })
})
