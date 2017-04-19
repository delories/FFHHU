'use strict';


var app = angular.module('ffhhuApp')

.controller('HeadCtrl', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {
    
    $scope.loggedIn = false;
    $scope.username = '';
    $scope.openLogin = function () {
        ngDialog.open({
            template: 'views/login.html',
            scope: $scope,
            className: 'ngdialog-theme-default',
            controller: "LoginController"
        });
    };
    if (AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
    $scope.logOut = function () {
        AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };

    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });

    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });

    $scope.stateis = function (curstate) {
        return $state.is(curstate);
    };
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.loginData = $localStorage.getObject('userinfo', '{}');

    $scope.doLogin = function () {
        $localStorage.storeObject('userinfo', $scope.loginData);
        AuthFactory.login($scope.loginData);
        ngDialog.close();
    };

    $scope.openRegister = function () {
        ngDialog.open({
            template: 'views/register.html',
            scope: $scope,
            className: 'ngdialog-theme-plain',
            controller: "RegisterController"
        });
    };


}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.register = {};
    $scope.loginData = {};

    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);
        
        ngDialog.close();

    };
}])
