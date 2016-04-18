import expect from 'expect'
import { createStore } from 'redux'
import { last, find, filter } from 'lodash'

import crudCollection from '../src/crudCollection'
import actionCreatorsFor from '../src/actionCreatorsFor'

const testActions = actionCreatorsFor('test')

describe('Deleting', () => {
  let reducer, store

  beforeEach(() => {
    reducer = crudCollection('test', { uniqueBy: 'id' })
    store = createStore(reducer)
    store.dispatch(testActions.create([{ id:1 }, { id:2 }, { id:3 }]))
  })

  describe('Start', () => {

    describe('when an array of uniqueness parameter is given', () => {

      it('sets the status of the items to "deleting"', () => {
        store.dispatch(testActions.pendDeletion([2]))
        const deletedItem = find(store.getState().items, i => i.data.id === 2)
        expect(deletedItem.status).toBe("deleting")
      })

      it('does not modify the status of other items', () => {
        store.dispatch(testActions.pendDeletion([2]))
        const otherItem = find(store.getState().items, i => i.data.id === 1)
        expect(otherItem.status).toBe("success")
      })

    })

  })

  describe('Success', () => {

    describe('when an array of uniqueness parameter is given', () => {

      it('deletes the items from the collection', () => {
        store.dispatch(testActions.delete([2]))
        const deletedItem = find(store.getState().items, i => i.data.id === 2)
        expect(deletedItem).toBe(undefined)
      })

    })

    xdescribe('when no uniqueness parameter and an array of cid is given', () => {

      it('deletes the items from the collection', () => {
        const store = createStore(crudCollection('test'))
        store.dispatch(testActions.create([{ id:1 }, { id:2 }, { id:3 }]))
        const firstCid = store.getState().items[0].cid
        store.dispatch(testActions.delete([firstCid]))
        const deletedItem = find(store.getState().items, { cid: firstCid })
        expect(deletedItem).toBe(undefined)
      })

    })

    xdescribe('when an array of items is given', () => {

      it('deletes the items from the collection', () => {
        const firstItem = store.getState().items[0]
        store.dispatch(testActions.delete([firstItem]))
        const deletedItem = find(store.getState().items, { cid: firstItem.cid })
        expect(deletedItem).toBe(undefined)
      })

    })

    xdescribe('when an array of item.datas is given', () => {

      it('deletes the items from the collection', () => {
        const firstItem = store.getState().items[0].data
        store.dispatch(testActions.delete([firstItem]))
        const deletedItem = find(store.getState().items, i => i.data.id === firstItem.id)
        expect(deletedItem).toBe(undefined)
      })

    })

  })

  describe('Error', () => {

    xit('?????', () => {
      expect('a test').toBe('written')
    })

  })

})
