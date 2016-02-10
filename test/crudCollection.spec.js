import expect from 'expect'
import { createStore } from 'redux'

import crudCollection from '../src/crudCollection'
import actionCreatorsFor from '../src/actionCreatorsFor'

const testActions = actionCreatorsFor('test')

describe('Fetching', () => {
  const reducer = crudCollection('test')
  const store = createStore(reducer)

  describe('Initialize', () => {

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
