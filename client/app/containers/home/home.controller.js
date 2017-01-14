import TodoActions from '../../actions/todo.actions';
import SN from 'sn-client-js';
import { Actions } from 'sn-redux';
import { Collection, ODataApi, SetSiteUrl, Content } from 'sn-client-js';
import 'rxjs';
SN.SetSiteUrl('https://demo06.demo.sensenet.com');

class HomeController {
    collection = new SN.Collection([]);
    ROOT_URL = '/workspaces/Project/budapestprojectworkspace/Tasks';
    optionObj = new ODataApi.ODataParams({
        select: ['DisplayName', 'Status'],
        orderby: 'DisplayName'
    });

    constructor($ngRedux, $http, $filter) {
        this.todo = '';
        this.unsubscribe = $ngRedux.connect(this.mapStateToThis, TodoActions)(this);
        this.state = $ngRedux;
    }

    remove(todo) {
        this.state.dispatch(Actions.Delete(todo.Id, true))
        this.removeTodo(this.todo)
    }

    filterTodo($event) {
        //console.log($event.currentTarget.getAttribute("data-type"));
        let filter = $event.currentTarget.getAttribute("data-type");
        if (filter === 'active') {
            this.optionObj['filter'] = `isOf('Task') and Status eq %27Active%27`;
        } else if (filter === 'completed') {
            this.optionObj['filter'] = `isOf('Task') and Status eq %27Completed%27`;
        } else {
            this.optionObj['filter'] = "isOf('Task')";
        }

        console.log(this.optionObj)
        this.state.dispatch(Actions.RequestContent(this.ROOT_URL, this.optionObj));
    }

    success(todoItem, $event) {
        //const status = (todoItem.Status[0] === 'active') ? 'active' : 'completed';
        let status;
        if ($event.toElement.tagName.toLowerCase() == 'div') {
            status = (todoItem.Status[0] === 'active') ? 'completed' : 'active';
        } else {
            status = (todoItem.Status[0] === 'active') ? 'active' : 'completed';
        }
        const fields = { Status: status };
        this.state.dispatch(Actions.UpdateContent(todoItem.Id, fields));
    }

    submitTodo() {
        let content = Content.Create('Task', {
            Type: 'Task',
            DisplayName: this.todo
        });

        this.state.dispatch(Actions.CreateContent(this.ROOT_URL, content))
        this.addTodo(this.todo);
        this.todo = '';
    }

    $onInit() {
        this.state.dispatch(Actions.RequestContent(this.ROOT_URL, this.optionObj))
    }

    $onDestroy() {
        this.unsubscribe();
    }

    mapStateToThis(state) {
        console.log("mapStateToThis");
        let todoArray = [];
        angular.forEach(state.collection.byId, function(value1, key1) {
            angular.forEach(state.collection.ids, function(value2, key2) {
                if (key1 == value2) {
                    todoArray.push(state.collection.byId[key1]);
                }
            });
        });
        return {
            todos: todoArray,
            todosID: state.collection.ids
        };
    }
}

//HomeController.$inject = ["$ngRedux"];
//HomeController.$inject = ["$http"];

export default HomeController;