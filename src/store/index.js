// import { createStore, combineReducers } from 'redux';
// import userReducer from './reducers/user';

// const rootReducer = combineReducers(
//     { user: userReducer }
// );
// const configureStore = () => {
//     return createStore(rootReducer);
// }
// export default configureStore;

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import userReducer from './reducers/user';
import thunk from "redux-thunk";

let composeEnhancers = compose;

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const rootReducer = combineReducers(
    { user: userReducer }
);
const configureStore = () => {
    return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
}
export default configureStore;