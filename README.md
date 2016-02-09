# redux-crud-collections


## Usage

### Reading

```
    const storeActions = actionCreatorsFor('store');
    dispatch(storeActions.fetchStart());
    fetch({
      ...
      success: (response) => dispatch(storeActions.fetchSuccess(response.items)),
      error: (error) => dispatch(storeActions.fetchFailed(error))
    });
```

In this case, the response.items is assumed to be an array. `fetchSuccess` will take an array of items and your reducer tree will look like:

```
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

### Compile

`npm run compile`

### TODO

extend custom reducer functions
get shit done
