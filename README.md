# redux-crud-collections


## Usage

```javascript
  const storeActions = actionCreatorsFor('store');
  dispatch(storeActions.fetchStart());
  fetch({
    ...
    success: (response) => dispatch(storeActions.fetchSuccess(response.items)),
    error: (error) => dispatch(storeActions.fetchFailed(error))
  });
```

In this case, the response.items is assumed to be an array. `fetchSuccess` will take an array of items and your reducer tree will look like:

```javascript
  store: {
    status: 'pending', // 'pending' | 'success' | 'error'
    error: null, // error message, if you provide it
    items: [
      {
        cid: 0, // globally unique, starts at 0 and iterates
        data: {
          key: value // the actual data for the model
        }
      }, {
        ...
      }
    ]
  }
```

### Action creators:
```javascript
const storeActions = actionCreatorsFor('storeName');

// fetchStarted()
fetchSuccess(Array) // Array will overwrite entire collection rather than merge (for now)
// fetchFailed(String)
// createStarted()
createSuccess(Array) // Array should be new items
// createFailed(String)
// updateStarted()
updateSuccess(Array) // Array is { cid, update } where update is an object to merge (see below)
// updateFailed(String)
// deleteStarted()
deleteSuccess(Array) // Array is [cid] or uniqueness parameter
// deleteFailed(String)
```

### Reducers

are pretty simple.

```javascript
// uniqueBy is not yet implemented but will let you define a uniqueness parameter
// that you can ensure merged items are unique by.
crudCollectionFor('store', { uniqueBy: 'id' })
```

If you provide a uniqueness parameter, life gets easier for you.


### Updating

Updating is the part of this project that will likely change the most, because of it's nature.

Currently, you should batch your updates up by data model `cid`s. Like so:

```javascript
dispatch(updateSuccess([
  {
    cid: 9,
    update: { name: 'Kitty' }
  }
]))
```

What this will do is find the data entry in the collection by the cid and overwrite it with the contents of `update`.


### Compile

`npm run compile`

### TODO

- extend custom reducer functions
- figure out how to `import { crudCollectionFor } from 'redux-crud-collections'` rather than `import crud from ...`;
- get shit done
