import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngRedux from 'ng-redux';
import { Store, Reducers, Epics } from 'sn-redux';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';

import AppComponent from './app.component';

import NavigationComponent from './components/navigation/navigation';
import HomeComponent from './containers/home/home';

import { RootReducer } from './reducers';

import 'normalize.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css'

angular
    .module('app', [
        uiRouter,
        ngRedux,
        NavigationComponent.name,
        HomeComponent.name
    ])
    .config(($locationProvider, $stateProvider, $urlRouterProvider, $ngReduxProvider) => {
        "ngInject";

        // Routing
        $stateProvider
            .state('app', {
                url: '',
                abstract: true,
                template: '<app></app>'
            })
            .state('app.home', {
                url: '/home',
                template: '<home></home>'
            });

        $urlRouterProvider.otherwise('/home');

        // Redux
        const collection = Reducers.collection;
        const myReducer = combineReducers({
            RootReducer,
            collection
        });

        let epicMiddleware = createEpicMiddleware(Epics.rootEpic);
        const loggerMiddleware = (createLogger)();
        let middlewareArray = [epicMiddleware, loggerMiddleware];

        //const store = Store.configureStore(myReducer);
        $ngReduxProvider.createStoreWith(myReducer, middlewareArray);
    })
    .component('app', AppComponent);