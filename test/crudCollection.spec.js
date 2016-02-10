import expect from 'expect'
import { createStore } from 'redux'
import { last, find, filter } from 'lodash'

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

  it('has status set to "success"', () => {
    expect(store.getState().status).toEqual('success')
  })

})

describe('Fetching', () => {
  let reducer, store

  before(() => {
    reducer = crudCollection('test')
    store = createStore(reducer)
  })

  describe('Start', () => {

    before(() => {
      store.dispatch(testActions.fetchStart())
    })

    xit('sets status to "pending"', () => {
      expect(store.getState().status).toEqual('pending')
    })

  })

  describe('Success', () => {

    before(() => {
      store.dispatch(testActions.fetchSuccess([{ test: 'isGood' }]))
    })

    it('sets status to "success"', () => {
      expect(store.getState().status).toEqual('success')
    })

    it('adds the new items', () => {
      expect(store.getState().items.length).toEqual(1)
    })

    it('adds a cid to the new item', () => {
      expect(store.getState().items[0].cid).toBeA('number')
    })

  })

  describe('Subsequent success', () => {

    before(() => {
      store.dispatch(testActions.fetchStart())
      store.dispatch(testActions.fetchSuccess([{ test: 'anotherIsGood' }]))
    })

    it('merges the new item', () => {
      expect(store.getState().items.length).toEqual(2)
    })

    it('adds a unique cid to the new item', () => {
      const [first, second] = store.getState().items
      expect(second.cid).toBeA('number')
      expect(second.cid).toNotEqual(first.cid)
    })

    it('does not create a new cid for existing items', () => {
      const cidBefore = store.getState().items[0].cid
      store.dispatch(testActions.fetchSuccess([{ test: '' }]))
      const cidAfter = store.getState().items[0].cid
      expect(cidBefore).toEqual(cidAfter)
    })

  })

  describe('Failure', () => {

    before(() => {
      store.dispatch(testActions.fetchStart())
      store.dispatch(testActions.fetchFailed('fuck'))
    })

    xit('sets status to "error"', () => {
      expect(store.getState().status).toEqual('error')
    })

    xit('sets the value of error to the fuck', () => {
      expect(store.getState().error).toEqual('fuck')
    })

    it('does not change the current items', () => {
      const beforeLength = store.getState().items.length
      store.dispatch(testActions.fetchFailed('fuckkkkk'))
      const afterLength = store.getState().items.length
      expect(beforeLength).toEqual(afterLength)
    })

  })

})

describe('Creating', () => {
  let reducer, store

  beforeEach(() => {
    reducer = crudCollection('test', { uniqueBy: 'id' })
    store = createStore(reducer)
  })

  describe('Start', () => {

    xit('creates optimistic items if provided things', () => {
      const beforeLength = store.getState().items.length
      store.dispatch(testActions.createStart([{ id:1 }, { id:2 }, { id:3 }]))
      const afterLength = store.getState().items.length
      expect(beforeLength + 3).toEqual(afterLength)
    })

    it('does not create optimistic items if provided nothing', () => {
      const beforeLength = store.getState().items.length
      store.dispatch(testActions.createStart())
      const afterLength = store.getState().items.length
      expect(beforeLength).toEqual(afterLength)
    })

    it('does not create optimistic items if no uniqueness parameter is set', () => {
      const nonUniqueStore = createStore(crudCollection('test', { uniqueBy: 'id' }))
      const beforeLength = nonUniqueStore.getState().items.length
      store.dispatch(testActions.createStart([{ id:1 }, { id:2 }, { id:3 }]))
      const afterLength = nonUniqueStore.getState().items.length
      expect(beforeLength + 3).toNotEqual(afterLength)
    })

    xit('sets the status of optimistic items to "pending"', () => {
      store.dispatch(testActions.createStart([{ one:1 }]))
      expect(last(store.getState().items).status).toEqual('pending')
    })

  })

  describe('Success', () => {

    it('creates new items', () => {
      const beforeLength = store.getState().items.length
      store.dispatch(testActions.createSuccess([{ id:1 }, { id:2 }, { id:3 }]))
      const afterLength = store.getState().items.length
      expect(beforeLength + 3).toEqual(afterLength)
    })

    it('creates new items with status of "success"', () => {
      const beforeLength = store.getState().items.length
      store.dispatch(testActions.createSuccess([{ id:10 }]))
      expect(last(store.getState().items).status).toEqual('success')
    })

    xit('overwrites items that match on uniqueness parameter', () => {
      store.dispatch(testActions.createSuccess([{ id:100, second: false }]))
      store.dispatch(testActions.createSuccess([{ id:100, second: true }]))
      const items = filter(store.getState().items, i => i.data.id === 100)
      expect(items.length).toEqual(1)
      expect(items[0].data.second).toEqual(true)
    })

  })

})
