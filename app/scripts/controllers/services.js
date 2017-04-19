'use strict';

angular.module('ffhhuApp')

.constant("baseURL", "http://115.159.213.154:3444/")
    .service('otherFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

        this.getId = function () {

            return $resource(baseURL + "users", null, {
                'update': {
                    method: 'PUT'
                }
            });

        };


        }])
    .factory('$localStorage', ['$window', function ($window) {
        return {
            store: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            remove: function (key) {
                $window.localStorage.removeItem(key);
            },
            storeObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key, defaultValue) {
                return JSON.parse($window.localStorage[key] || defaultValue);
            }
        }
}])
    .factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', function ($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog) {

        var authFac = {};
        var TOKEN_KEY = 'Token';
        var isAuthenticated = false;
        var username = '';
        var authToken = undefined;


        function loadUserCredentials() {
            var credentials = $localStorage.getObject(TOKEN_KEY, '{}');
            if (credentials.username != undefined) {
                useCredentials(credentials);
            }
        }

        function storeUserCredentials(credentials) {
            $localStorage.storeObject(TOKEN_KEY, credentials);
            useCredentials(credentials);
        }

        function useCredentials(credentials) {
            isAuthenticated = true;
            username = credentials.username;
            authToken = credentials.token;

            // Set the token as header for your requests!
            $http.defaults.headers.common['x-access-token'] = authToken;
        }

        function destroyUserCredentials() {
            authToken = undefined;
            username = '';
            isAuthenticated = false;
            $http.defaults.headers.common['x-access-token'] = authToken;
            $localStorage.remove(TOKEN_KEY);
        }

        authFac.login = function (loginData) {

            $resource(baseURL + "users/login")
                .save(loginData,
                    function (response) {
                        storeUserCredentials({
                            username: loginData.username,
                            token: response.token
                        });
                        $rootScope.$broadcast('login:Successful');
                    },
                    function (response) {
                        isAuthenticated = false;
                        ngDialog.openConfirm({
                            template: '\
                <p>There is something wrong with your username or password</p>\
                <div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">Give up Login</button>\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-ng-click=confirm("OK")">Try Again</button>\
                </div>',
                            plain: true
                        });
                    }

                );

        };

        authFac.logout = function () {
            $resource(baseURL + "users/logout").get(function (response) {});
            destroyUserCredentials();
        };

        authFac.register = function (registerData) {

            $resource(baseURL + "users/register")
                .save(registerData,
                    function (response) {
                        authFac.login({
                            username: registerData.username,
                            password: registerData.password
                        });
                        if (registerData.rememberMe) {
                            $localStorage.storeObject('userinfo', {
                                username: registerData.username,
                                password: registerData.password
                            });
                        }

                        $rootScope.$broadcast('registration:Successful');
                    },
                    function (response) {

                        ngDialog.openConfirm({
                            template: '\
                <p>Register Unsuccessful. Change your username or password</p>\
                <div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">Give up Register</button>\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-ng-click=confirm("OK")">Try Again</button>\
                </div>',
                            plain: true
                        });

                    }

                );
        };

        authFac.isAuthenticated = function () {
            return isAuthenticated;
        };

        authFac.getUsername = function () {
            return username;
        };

        loadUserCredentials();

        return authFac;

}])

.factory('FileFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', function ($resource, $http, $localStorage, $rootScope, $window, baseURL) {
    return $resource(baseURL + "search/all", null, {
           action1: {
             method: 'GET',
             url: baseURL + "search/all",
             isArray: true  
           }
       });

}])
