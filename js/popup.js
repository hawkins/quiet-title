angular.module('App', ['ngMaterial'])
    .controller('appCtrl', function($scope) {
        var App = $scope;

        App.save = function () {
            chrome.storage.sync.set({'case': App.case}, function() {
                console.log('Case saved');
            });
        }

        App.load = function () {
            chrome.storage.sync.get('case', function(item) {
                if (item.case)
                    App.case = item.case;
                else
                    App.case = 'lower';

                try {
                    $scope.$apply();
                } catch (ex) {
                    // Do nothing
                }

                console.log('Case loaded');
            });
        }

        App.save();
        App.load();
    });
