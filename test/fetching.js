import expect from 'expect'
import { createStore } from 'redux'
import { find } from 'lodash'

import crudCollection from '../src/crudCollection'
import actionCreatorsFor from '../src/actionCreatorsFor'

const testActions = actionCreatorsFor('test')

describe('Fetching', () => {
  let reducer, store

  before(() => {
    reducer = crudCollection('test')
    store = createStore(reducer)
  })

  describe('Start', () => {

    before(() => {
      store.dispatch(testActions.pend())
    })

    it('sets status to "pending"', () => {
      expect(store.getState().status).toEqual('pending')
    })

  })

  describe('Success', () => {

    before(() => {
      store.dispatch(testActions.add([{ test: 'isGood' }]))
    })

    it('sets status to "success"', () => {
      expect(store.getState().status).toEqual('success')
    })

    it('sets valid to true', () => {
      expect(store.getState().valid).toEqual(true)
    })

    it('adds the new items', () => {
      expect(store.getState().items.length).toEqual(1)
    })

    it('adds a cid to the new item', () => {
      expect(store.getState().items[0].cid).toBeA('number')
    })

    describe('when an item is being added with same uniqueness parameter', () => {

      before(() => {
        store = createStore(crudCollection('test', { uniqueBy: 'id' }))
      })

      it('overwrites the older item', () => {
        store.dispatch(testActions.add([{ id: 1, newOne: false }]))
        store.dispatch(testActions.add([{ id: 1, newOne: true }]))
        const item = find(store.getState().items, i => i.data.id === 1)
        expect(item.data.newOne).toEqual(true)
      })

    })

    describe('when multiple items are added returns in order', () => {
      before(() => {
        store.dispatch(testActions.add([{ id: 1, name: 'A' }, { id: 2, name:'B' }, { id: 3, name:'C' }]))
      })

      it('should remain in order', () => {
        const item = store.getState().items
        expect(item[0].data.name) .toEqual('A')
        expect(item[1].data.name) .toEqual('B')
        expect(item[2].data.name) .toEqual('C')
      })
    })

  })

  describe('Subsequent success', () => {

    beforeEach(() => {
      store = createStore(reducer)
      store.dispatch(testActions.pend())
      store.dispatch(testActions.add([{ first: true }]))
      store.dispatch(testActions.add([{ second: true }]))
    })

    it('merges the new item', () => {
      expect(store.getState().items.length).toEqual(2)
    })

    it('adds a unique cid to the new item', () => {
      const [first, second] = store.getState().items
      expect(second.cid).toBeA('number')
      expect(second.cid).toNotEqual(first.cid)
    })

    it('preserves item creation ordering', () => {
      expect(store.getState().items[0].data.first).toEqual(true)
    })

    it('does not update existing items cids', () => {
      const cidBefore = store.getState().items[0].cid
      store.dispatch(testActions.add([{ test: '' }]))
      const cidAfter = store.getState().items[0].cid
      expect(cidBefore).toEqual(cidAfter)
    })

  })

  describe('Failure', () => {

    before(() => {
      store.dispatch(testActions.pend())
      store.dispatch(testActions.failedToAdd('fuck'))
    })

    it('sets status to "error"', () => {
      expect(store.getState().status).toEqual('error')
    })

    it('sets the value of error to the fuck', () => {
      expect(store.getState().error).toEqual('fuck')
    })

    it('does not change the current items', () => {
      const beforeLength = store.getState().items.length
      store.dispatch(testActions.failedToAdd('fuckkkkk'))
      const afterLength = store.getState().items.length
      expect(beforeLength).toEqual(afterLength)
    })

  })

})
