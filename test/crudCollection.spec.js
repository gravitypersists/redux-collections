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

  describe('Failure', () => {

    before(() => {
      store.dispatch(testActions.createStart())
      store.dispatch(testActions.createFailed('fuck'))
    })

    xit('?????', () => {
      expect('a test').toBe('written')
    })

  })

})

describe('Deleting', () => {
  let reducer, store

  beforeEach(() => {
    reducer = crudCollection('test', { uniqueBy: 'id' })
    store = createStore(reducer)
    store.dispatch(testActions.createSuccess([{ id:1 }, { id:2 }, { id:3 }]))
  })

  describe('Start', () => {

    xit('?????', () => {
      expect('a test').toBe('written')
    })

  })

  describe('Success', () => {

    describe('when an array of uniqueness parameter is given', () => {

      it('deletes the items from the collection', () => {
        store.dispatch(testActions.deleteSuccess([2]))
        const deletedItem = find(store.getState().items, i => i.data.id === 2)
        expect(deletedItem).toBe(undefined)
      })

    })

    xdescribe('when no uniqueness parameter and an array of cid is given', () => {

      it('deletes the items from the collection', () => {
        const store = createStore(crudCollection('test'))
        store.dispatch(testActions.createSuccess([{ id:1 }, { id:2 }, { id:3 }]))
        const firstCid = store.getState().items[0].cid
        store.dispatch(testActions.deleteSuccess([firstCid]))
        const deletedItem = find(store.getState().items, { cid: firstCid })
        expect(deletedItem).toBe(undefined)
      })

    })

    xdescribe('when an array of items is given', () => {

      it('deletes the items from the collection', () => {
        const firstItem = store.getState().items[0]
        store.dispatch(testActions.deleteSuccess([firstItem]))
        const deletedItem = find(store.getState().items, { cid: firstItem.cid })
        expect(deletedItem).toBe(undefined)
      })

    })

    xdescribe('when an array of item.datas is given', () => {

      it('deletes the items from the collection', () => {
        const firstItem = store.getState().items[0].data
        store.dispatch(testActions.deleteSuccess([firstItem]))
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


describe('Updating', () => {
  let reducer, store

  beforeEach(() => {
    reducer = crudCollection('test', { uniqueBy: 'id' })
    store = createStore(reducer)
    store.dispatch(testActions.createSuccess([{ id:1 }, { id:2 }, { id:3 }]))
  })

  describe('Start', () => {

    xdescribe('when an array of items is given', () => {

      describe('when optimistic is not set to true', () => {

        it('sets the status of the item to "pending"', () => {
          store.dispatch(testActions.updateStart([{ id: 1 }]))
          const updatedItem = find(store.getState().items, (i) => i.data.id === 1)
          expect(updatedItem.status).toEqual('pending')
        })

        it('does not modify the data model yet', () => {
          store.dispatch(testActions.updateStart([{ id: 1, modified: true }]))
          const updatedItem = find(store.getState().items, (i) => i.data.id === 1)
          expect(updatedItem.data.modified).toEqual(undefined)
        })

      })

      describe('when optimistic is set to true', () => {

        it('sets the status of the item to "pending"', () => {
          store.dispatch(testActions.updateStart([{ id: 1 }]))
          const updatedItem = find(store.getState().items, (i) => i.data.id === 1)
          expect(updatedItem.status).toEqual('pending')
        })

        it('modifies the data model', () => {
          store.dispatch(testActions.updateStart([{ id: 1, modified: true }]))
          const updatedItem = find(store.getState().items, (i) => i.data.id === 1)
          expect(updatedItem.data.modified).toEqual(true)
        })

      })

    })

  })

  describe('Success', () => {

    describe('when an array of items is given', () => {

      it('sets the status of the item to "success"', () => {
        const firstItem = store.getState().items[0]
        store.dispatch(testActions.updateSuccess([firstItem]))
        const updatedItem = find(store.getState().items, { cid: firstItem.cid })
        expect(updatedItem.status).toEqual('success')
      })

      it('modifies the data model', () => {
        const firstItem = store.getState().items[0]
        const newData = { id: firstItem.data.id, modified: true }
        store.dispatch(testActions.updateSuccess([{ ...firstItem, data: newData }]))
        const updatedItem = find(store.getState().items, { cid: firstItem.cid })
        expect(updatedItem.data.modified).toEqual(true)
      })

      it('overwrites the data model', () => {
        const firstItem = store.getState().items[0]
        const newData = { id: firstItem.data.id, notOverwritten: true }
        store.dispatch(testActions.updateSuccess([{ ...firstItem, data: newData }]))
        store.dispatch(testActions.updateSuccess([firstItem]))
        const updatedItem = find(store.getState().items, { cid: firstItem.cid })
        expect(updatedItem.data.notOverwritten).toEqual(undefined)
      })

    })

    describe('when an array of item.datas is given', () => {

      it('sets the status of the item to "success"', () => {
        const firstData = store.getState().items[0].data
        store.dispatch(testActions.updateSuccess([firstData]))
        const updatedItem = find(store.getState().items, (i) => i.data.id === firstData.id)
        expect(updatedItem.status).toEqual('success')
      })

      it('modifies the data model', () => {
        const firstData = store.getState().items[0].data
        const newData = { ...firstData, modified: true }
        store.dispatch(testActions.updateSuccess([newData]))
        const updatedItem = find(store.getState().items, (i) => i.data.id === firstData.id)
        expect(updatedItem.data.modified).toEqual(true)
      })

      it('overwrites the data model', () => {
        const firstData = store.getState().items[0].data
        const newData = { ...firstData, notOverwritten: true }
        store.dispatch(testActions.updateSuccess([newData]))
        store.dispatch(testActions.updateSuccess([firstData]))
        const updatedItem = find(store.getState().items, (i) => i.data.id === firstData.id)
        expect(updatedItem.data.notOverwritten).toEqual(undefined)
      })

    })

  })

  describe('Error', () => {

    xit('?????', () => {
      expect('a test').toBe('written')
    })

  })

})
