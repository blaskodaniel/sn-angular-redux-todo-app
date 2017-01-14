import { TODOS } from '../constants/todos';
import { Actions } from 'sn-redux';

function addTodo(todo) {
    return {
        type: TODOS.ADD_TODO,
        payload: todo
    }
}

function removeTodo(todo) {
    return {
        type: TODOS.REMOVE_TODO,
        payload: todo
    };
}

export default { addTodo, removeTodo };