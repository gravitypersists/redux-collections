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

    it('sets status to "pending"', () => {
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
      expect(store.getState().items[0].cid).toEqual(0)
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
      expect(store.getState().items[1].cid).toEqual(1)
    })

  })


})
