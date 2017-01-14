import { combineReducers } from 'redux';
import { TodosReducer } from './todos.reducer';
import { listByFilter } from './todos.reducer2';
import { Reducers } from 'sn-redux';

export const RootReducer = combineReducers({
    todos2: listByFilter
});