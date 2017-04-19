'use strict';

/**
 * @ngdoc overview
 * @name anatasmlozApp
 * @description
 * # anatasmlozApp
 *
 * Main module of the application.
 */
var app = angular.module('ffhhuApp', ['ui.router', 'ngResource', 'ngDialog']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('index', {
            url: '/',
            views: {
                'header': {
                    templateUrl: 'views/header.html',
                    controller: 'HeadCtrl'
                },
                'content': {
                    templateUrl: 'views/home.html',
                    //                controller: 'IndexController'
                },
                'footer': {
                    templateUrl: 'views/footer.html',
                }
            }
        })
        .state('aboutus', {
            url: '/aboutus',
            views: {
                'header': {
                    templateUrl: 'views/header.html',
                    controller: 'HeadCtrl'
                },
                'content': {
                    templateUrl: 'views/aboutus.html',
                    //                controller: 'IndexController'
                },
                'footer': {
                    templateUrl: 'views/footer.html',
                }
            }
        })
        .state('download', {
            url: '/download',
            views: {
                'header': {
                    templateUrl: 'views/header.html',
                    controller: 'HeadCtrl'
                },
                'content': {
                    templateUrl: 'views/download.html',
                    controller: 'DownloadController'
                },
                'footer': {
                    templateUrl: 'views/footer.html',
                }
            }
        })

    $urlRouterProvider.otherwise('/');
})
