import template from './home.html';
import homecontroller from './home.controller';
import './home.scss';

let homeComponent = {
    restrict: 'E',
    bindings: {},
    template,
    controller: ["$ngRedux", "$http", homecontroller]
};

export default homeComponent;