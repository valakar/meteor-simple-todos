import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './todosList.html';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../../../imports/api/tasks.js';

class TodosListCtrl {
    constructor($scope) {
        $scope.viewModel(this);

        this.hideCompleted = false;

        this.helpers({
            tasks() {
                const selector = {};

                // If hide completed is checked, filter tasks
                if (this.getReactively('hideCompleted')) {
                    selector.checked = {
                        $ne: true
                    };
                }

                // Show newest tasks at the top
                return Tasks.find(selector, {
                    sort: {
                        createdAt: -1
                    }
                });
            },
            
            incompleteCount() {
                return Tasks.find({
                    checked: {
                        $ne: true
                    }
                }).count();
            },

            currentUser() {
                return Meteor.user();
            }
        })
    }

    addTask(newTask) {
        // Insert a task into the collection
        Meteor.call('tasks.insert', newTask);

        // Clear form
        this.newTask = '';
    }

    setChecked(task) {
        // Set the checked property to the opposite of its current value
        Meteor.call('tasks.setChecked', task._id, !task.checked);
    }

    removeTask(task) {
        Meteor.call('tasks.remove', task._id);
    }
}


export default angular.module('todosList', [
        angularMeteor
    ])
    .component('todosList', {
        templateUrl: template,
        controller: ['$scope', TodosListCtrl]
    });