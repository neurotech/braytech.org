import { createStore, combineReducers } from 'redux';

import member from './reducers/member.js';
import theme from './reducers/theme.js';
import collectibles from './reducers/collectibles.js';
import triumphs from './reducers/triumphs.js';
import vendors from './reducers/vendors.js';
import refreshService from './reducers/refreshService.js';

const rootReducer = combineReducers({
  member,
  vendors,
  theme,
  collectibles,
  triumphs,
  refreshService
});

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
