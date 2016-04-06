# redux-crud-collections

A set of standard action creators, reducers and selectors for use with a restful-like CRUD API. Inspired a by [redux-crud](https://github.com/Versent/redux-crud) but does not enforce the seamless-immutable library and offers metadata in the stores about data (such as whether the resource is downloading from the server).

## Usage

Using the [fancy-fetch](https://github.com/anyperk/fancy-fetch) util:

```javascript
  const storeActions = actionCreatorsFor('store');
  dispatch(storeActions.pend());
  fetch({
    ...
    success: (response) => dispatch(storeActions.add(response.items)),
    error: (error) => dispatch(storeActions.failToAdd(error))
  });
```

In this case, the response.items is assumed to be an array from your server response. `add` will take an array of items and a reducer will automatically respond to this action creator producing a reducer tree that will look like:

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
const a = actionCreatorsFor('storeName');

a.pend()
a.add(Array)
a.failedToAdd(String)
a.pendCreation()
a.create(Array)
a.failedToCreate(String)
a.pendUpdate()
a.update(Array)
a.failedToUpdate(String)
a.pendDelete()
a.delete(Array)
a.failedToDelete(String)
a.empty()
a.replace(Array)
```

### Reducers

are pretty simple.

```javascript
crudCollectionFor('store', { uniqueBy: 'id' })
```

If you provide a uniqueness parameter, life gets easier for you.


## Development

### Testing

`npm test` or if you prefer `npm run test:watch`

### Compile

`npm run compile`

### TODO

- extend custom reducer functions
- figure out how to `import { crudCollectionFor } from 'redux-crud-collections'` rather than `import crud from ...`;
- get shit done
