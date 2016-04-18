import expect from 'expect'
import { createStore } from 'redux'
import { find, uniq } from 'lodash'

import crudCollection from '../src/crudCollection'
import actionCreatorsFor from '../src/actionCreatorsFor'

const testActions = actionCreatorsFor('test')

describe('Updating', () => {
  let reducer, store

  beforeEach(() => {
    reducer = crudCollection('test', { uniqueBy: 'id' })
    store = createStore(reducer)
    store.dispatch(testActions.create([{ id:1 }, { id:2 }, { id:3 }]))
  })

  describe('Start', () => {

    describe('when an array of item.datas is given', () => {

      describe('when optimistic is not set to true', () => {

        beforeEach(() => {
          store.dispatch(testActions.pendUpdate([{ id: 1, modified: true }]))
        })

        it('sets the status of the items to "updating"', () => {
          const updatedItem = find(store.getState().items, (i) => i.data.id === 1)
          expect(updatedItem.status).toEqual('updating')
        })

        it('does not set the status of non-updating items to "updating"', () => {
          const updatedItem = find(store.getState().items, (i) => i.data.id === 3)
          expect(updatedItem.status).toEqual('success')
        })

        it('does not modify the data model yet', () => {
          const updatedItem = find(store.getState().items, (i) => i.data.id === 1)
          expect(updatedItem.data.modified).toEqual(undefined)
        })

      })

      xdescribe('when optimistic is set to true', () => {

        it('sets the status of the item to "updating"', () => {
          store.dispatch(testActions.pendUpdate([{ id: 1 }]))
          const updatedItem = find(store.getState().items, (i) => i.data.id === 1)
          expect(updatedItem.status).toEqual('updating')
        })

        it('modifies the data model', () => {
          store.dispatch(testActions.pendUpdate([{ id: 1, modified: true }]))
          const updatedItem = find(store.getState().items, (i) => i.data.id === 1)
          expect(updatedItem.data.modified).toEqual(true)
        })

      })

    })

    describe('when an array of items is given', () => {

      describe('when optimistic is not set to true', () => {
        let updatedItem

        beforeEach(() => {
          const firstCid = store.getState().items[0].cid
          store.dispatch(testActions.pendUpdate([{ cid: firstCid, __cruddy: true, data: { modified: true } }]))
          updatedItem = find(store.getState().items, { cid: firstCid })
        })

        it('sets the status of the item to "updating"', () => {
          expect(updatedItem.status).toEqual('updating')
        })

        it('does not modify the data model yet', () => {
          expect(updatedItem.data.modified).toEqual(undefined)
        })

      })

      xdescribe('when optimistic is set to true', () => {


      })

    })

    describe('when no arguments are given', () => {

      beforeEach(() => {
        store.dispatch(testActions.pendUpdate())
      })

      it('sets the status of all items to "updating"', () => {
        const status = store.getState().items.map(i => i.status);
        const uniqueStatuses = uniq(status);
        expect(uniqueStatuses).toEqual(['updating']);
      })

    })
  })

  describe('Success', () => {

    describe('when an array of items is given', () => {

      it('sets the status of the item to "success"', () => {
        const firstItem = store.getState().items[0]
        store.dispatch(testActions.update([firstItem]))
        const updatedItem = find(store.getState().items, { cid: firstItem.cid })
        expect(updatedItem.status).toEqual('success')
      })

      it('modifies the data model', () => {
        const firstItem = store.getState().items[0]
        const newData = { id: firstItem.data.id, modified: true }
        store.dispatch(testActions.update([{ ...firstItem, data: newData }]))
        const updatedItem = find(store.getState().items, { cid: firstItem.cid })
        expect(updatedItem.data.modified).toEqual(true)
      })

      it('overwrites the data model', () => {
        const firstItem = store.getState().items[0]
        const newData = { id: firstItem.data.id, notOverwritten: true }
        store.dispatch(testActions.update([{ ...firstItem, data: newData }]))
        store.dispatch(testActions.update([firstItem]))
        const updatedItem = find(store.getState().items, { cid: firstItem.cid })
        expect(updatedItem.data.notOverwritten).toEqual(undefined)
      })

    })

    describe('when an array of item.datas is given', () => {

      it('sets the status of the items to "success"', () => {
        const firstData = store.getState().items[0].data
        store.dispatch(testActions.pendUpdate([firstData]))
        store.dispatch(testActions.update([firstData]))
        const updatedItem = find(store.getState().items, (i) => i.data.id === firstData.id)
        expect(updatedItem.status).toEqual('success')
      })

      it('modifies the data model', () => {
        const firstData = store.getState().items[0].data
        const newData = { ...firstData, modified: true }
        store.dispatch(testActions.update([newData]))
        const updatedItem = find(store.getState().items, (i) => i.data.id === firstData.id)
        expect(updatedItem.data.modified).toEqual(true)
      })

      it('overwrites the data model', () => {
        const firstData = store.getState().items[0].data
        const newData = { ...firstData, notOverwritten: true }
        store.dispatch(testActions.update([newData]))
        store.dispatch(testActions.update([firstData]))
        const updatedItem = find(store.getState().items, (i) => i.data.id === firstData.id)
        expect(updatedItem.data.notOverwritten).toEqual(undefined)
      })

    })

    describe('when no arguments are given', () => {

      beforeEach(() => {
        store.dispatch(testActions.pendUpdate())
        store.dispatch(testActions.update())
      })

      it('sets the status of all items to "success"', () => {
        const status = store.getState().items.map(i => i.status);
        const uniqueStatuses = uniq(status);
        expect(uniqueStatuses).toEqual(['success']);
      })

    })
  })

  describe('Error', () => {
    it('sets status to "error"', () => {
      const firstItem = store.getState().items[0]
      store.dispatch(testActions.failedToUpdate('oh no'))
      const updatedItem = find(store.getState().items, { cid: firstItem.cid })
      expect(updatedItem.status).toEqual('error')
      expect(updatedItem.error).toEqual('oh no')
    })
  })

})
