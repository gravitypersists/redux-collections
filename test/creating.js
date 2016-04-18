import expect from 'expect'
import { createStore } from 'redux'
import { last, filter } from 'lodash'

import crudCollection from '../src/crudCollection'
import actionCreatorsFor from '../src/actionCreatorsFor'

const testActions = actionCreatorsFor('test')

describe('Creating', () => {
  let reducer, store

  beforeEach(() => {
    reducer = crudCollection('test', { uniqueBy: 'id' })
    store = createStore(reducer)
  })

  describe('Start', () => {

    it('sets the status of creating to "pending"', () => {
      store.dispatch(testActions.pendCreation([{ one:1 }]))
      expect(store.getState().creating).toEqual('pending')
    })

    xit('creates optimistic items if provided things', () => {
      const beforeLength = store.getState().items.length
      store.dispatch(testActions.pendCreation([{ id:1 }, { id:2 }, { id:3 }]))
      const afterLength = store.getState().items.length
      expect(beforeLength + 3).toEqual(afterLength)
    })

    it('does not create optimistic items if provided nothing', () => {
      const beforeLength = store.getState().items.length
      store.dispatch(testActions.pendCreation())
      const afterLength = store.getState().items.length
      expect(beforeLength).toEqual(afterLength)
    })

    it('does not create optimistic items if no uniqueness parameter is set', () => {
      const nonUniqueStore = createStore(crudCollection('test', { uniqueBy: 'id' }))
      const beforeLength = nonUniqueStore.getState().items.length
      store.dispatch(testActions.pendCreation([{ id:1 }, { id:2 }, { id:3 }]))
      const afterLength = nonUniqueStore.getState().items.length
      expect(beforeLength + 3).toNotEqual(afterLength)
    })

    xit('sets the status of optimistic items to "pending"', () => {
      store.dispatch(testActions.pendCreation([{ one:1 }]))
      expect(last(store.getState().items).status).toEqual('pending')
    })

  })

  describe('Success', () => {

    it('sets the status of creating to "success"', () => {
      store.dispatch(testActions.pendCreation())
      store.dispatch(testActions.create([{ one:1 }]))
      expect(store.getState().creating).toEqual('success')
    })

    xit('does not set the status of creating to "success" if there are still pending creations', () => {
      store.dispatch(testActions.pendCreation([{ id: 99 }]))
      store.dispatch(testActions.pendCreation([{ id: 98 }]))
      store.dispatch(testActions.create([{ id: 99 }]))
      expect(store.getState().creating).toEqual('pending')
    })

    it('creates new items', () => {
      const beforeLength = store.getState().items.length
      store.dispatch(testActions.create([{ id:1 }, { id:2 }, { id:3 }]))
      const afterLength = store.getState().items.length
      expect(beforeLength + 3).toEqual(afterLength)
    })

    it('creates new items with status of "success"', () => {
      const beforeLength = store.getState().items.length
      store.dispatch(testActions.create([{ id:10 }]))
      expect(last(store.getState().items).status).toEqual('success')
    })

    it('overwrites items that match on uniqueness parameter', () => {
      store.dispatch(testActions.create([{ id:100, second: false }]))
      store.dispatch(testActions.create([{ id:100, second: true }]))
      const items = filter(store.getState().items, i => i.data.id === 100)
      expect(items.length).toEqual(1)
      expect(items[0].data.second).toEqual(true)
    })

  })

  describe('Failure', () => {

    it('adds the item to the creation error array', () => {
      store.dispatch(testActions.pendCreation())
      store.dispatch(testActions.failedToCreate('oh fuck', [{ id: 151 }]))
      expect(store.getState().failedCreations[0].error).toEqual('oh fuck')
      expect(store.getState().failedCreations[0].data.id).toEqual(151)
    })

    xdescribe('when optimistic updates are enabled', () => {

      before(() => {
        store.dispatch(testActions.pendCreation())
        store.dispatch(testActions.failedToCreate('fuck'))
      })

      it('deletes the optimistically created items :(', () => {

      })

    })

    xdescribe('when optimistic updates are not enabled', () => {

      before(() => {
        store.dispatch(testActions.pendCreation())
        store.dispatch(testActions.failedToCreate('fuck'))
      })

      it('does something, do not know yet', () => {

      })

    })

  })

})
