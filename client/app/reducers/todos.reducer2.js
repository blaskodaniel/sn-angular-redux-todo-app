import { combineReducers } from 'redux';
import { Reducers } from 'sn-redux';

export const createList = (filter) => {
    const handleToggle = (state, action, filter) => {
        const { result: toggleId, entities } = action.response;
        const { Status } = entities.collection[toggleId];
        const shouldRemove = (
            (Status.indexOf('Active') === -1 && filter === 'Active') ||
            (Status.indexOf('Completed') === -1 && filter === 'Completed')
        );
        return shouldRemove ?
            state.filter(Id => Id !== toggleId) :
            state;
    }
    const ids = (state = [], action) => {
        switch (action.type) {
            case 'FETCH_CONTENT_SUCCESS':
                return action.response.result;
            case 'CREATE_CONTENT_SUCCESS':
                return [...state, action.response.result];
            case 'UPDATE_CONTENT_SUCCESS':
                return handleToggle(state, action, filter)
            case 'DELETE_CONTENT_SUCCESS':
                return [...state.slice(0, action.index), ...state.slice(action.index + 1)];
            default:
                return state;
        }
    }
    const isFetching = (state = {}, action) => {
        if (filter !== action.filter) {
            return state;
        }
        switch (action.type) {
            case 'FETCH_CONTENT_REQUEST':
                return true;
            default:
                return false;
        }
    }

    const errorMessage = (state = null, action) => {
        if (filter !== action.filter) {
            return state;
        }
        switch (action.type) {
            case 'FETCH_CONTENT_FAILURE':
                return action.message;
            default:
                return state;
        }
    }

    return combineReducers({
        ids,
        isFetching,
        errorMessage
    });
};

export const listByFilter = combineReducers({
    All: createList('All'),
    Active: createList('Active'),
    Completed: createList('Completed')
})