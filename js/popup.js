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

                // Refresh Angular
                try {
                    $scope.$apply();
                } catch (ex) {
                    // Do nothing
                }

                console.log('Case loaded');
            });
        }

        App.visit = function () {
            // Anchor tag does not work as expected in action
            chrome.tabs.create({ url: 'https://github.com/hawkins/quiet-title' });
        }

        App.refresh = function () {
            chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
                chrome.tabs.executeScript(arrayOfTabs[0].id,
                    // if (we're on YouTube.com)
                    //     if (we're watching a video)
                    //         refresh page but keep video time
                    //     else
                    //         just refresh if we're on YouTube somewhere else.
                    {code: "if (window.location.href.includes('www.youtube.com/')) {\
                                try {\
                                    var time = document.getElementsByClassName('ytp-time-current')[0].innerHTML.split(':');\
                                    var urlArgs = window.location.href.split('watch?v=')[1];\
                                    var id = urlArgs.split('&')[0];\
                                    var url = 'https://youtu.be/' + id + '?t=';\
                                    if (time.length > 2) {\
                                        url += time[0] + 'h';\
                                        url.splice(0, 1);\
                                    }\
                                    if (time[0] != '0') url += time[0] + 'm';\
                                    url += time[1] + 's';\
                                    console.log(url);\
                                    window.location.replace(url);\
                                } catch (ex) {\
                                    window.location.reload();\
                                }\
                            }"});
            });
        }

        App.save();
        App.load();
    });
