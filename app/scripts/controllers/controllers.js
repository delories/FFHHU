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
    $scope.openRegister = function () {
        //        ngDialog.open({
        //            template: '<p>注册暂未开放，如有意见，请联系余涛</p>',
        //            plain: true
        //        });
        ngDialog.open({
            template: 'views/register.html',
            scope: $scope,
            className: 'ngdialog-theme-plain',
            controller: "RegisterController"
        });
    };
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.loginData = $localStorage.getObject('userinfo', '{}');

    $scope.doLogin = function () {
        $localStorage.storeObject('userinfo', $scope.loginData);
        AuthFactory.login($scope.loginData);
        ngDialog.close();
    };


}])

.controller('successController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {



}])


.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.register = {};
    $scope.loginData = {};

    $scope.doRegister = function () {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);

        ngDialog.close();

    };
}])

.controller('DownloadController', ['$scope', '$localStorage', 'FileFactory', 'DelFactory', 'AuthFactory', 'CouseraFactory', 'ngDialog', '$window', function ($scope, $localStorage, FileFactory, DelFactory, AuthFactory, CouseraFactory, ngDialog, $window) {

    $scope.filter = {};
    $scope.filter.colleage = "物联";
    $scope.filter.year = 2016;
    $scope.filter.cousera = "高数Ⅰ ";
    $scope.filterRes = FileFactory.query();
    $scope.admin = AuthFactory.getAdmin();
    $scope.token = AuthFactory.getToken();
    $scope.update = function () {
        FileFactory.getFile_($scope.filter, function (files) {
            $scope.filterRes = files;
        }, function (err) {
            console.log(err);
        });
    };
    $scope.del = function (aim_id) {
        DelFactory.change({
                id: aim_id,
                token: $scope.token
            }, function (response) {
                ngDialog.open({
                    template: '<p>删除成功</p>',
                    plain: true
                });
                $window.location.reload();
            },
            function (response) {
                if (response.status != 200) {
                    ngDialog.open({
                        template: '<p>删除失败,请确认是否有权限</p>',
                        plain: true
                    });
                }
                $window.location.reload();
            });
    };
    $scope.couseras = CouseraFactory.couseras;

}])

.controller('UploadController', ['$scope', '$localStorage', 'UpFactory', 'AuthFactory', '$rootScope', '$http', 'ngDialog', 'CouseraFactory', 'baseURL', '$window', 'FileUploader', function ($scope, $localStorage, UpFactory, AuthFactory, $rootScope, $http, ngDialog, CouseraFactory, baseURL, $window, FileUploader) {
    $scope.uploader = new FileUploader();
    $scope.selectedCousera = {};
    $scope.uploadFile = {};
    $scope.startUpload = false;
    $scope.selectedCousera = function (selected) {
        console.log(selected);
        $scope.uploadFile.cousera = selected.originalObject.name;
        console.log($scope.uploadFile.cousera);
    };
    $scope.addFile = function () {
        var vv = document.getElementById('cousera');
//        console.log(vv);
//        console.log(vv.selectedCousera);
//        console.log($scope.uploadFile.cousera);
        $scope.uploadFile.token = AuthFactory.getToken();
        console.log($scope.uploadFile);
        var myform = document.getElementById('res_form');
        var fd = new FormData(myform);
        fd.append('colleage', $scope.uploadFile.colleage);
        fd.append('filename', $scope.uploadFile.filename);
        fd.append('cousera', $scope.uploadFile.cousera);
        fd.append('teacher', $scope.uploadFile.teacher);
        fd.append('year', $scope.uploadFile.year);
        fd.append('token', $scope.uploadFile.token);
        $scope.startUpload = true;
        if ($scope.startUpload) {
            ngDialog.open({
                template: '<p>开始上传，请耐心等待</p>',
                plain: true
            });
        }

        $http.post(baseURL + "upload/wps", fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                },
                enctype: 'multipart/form-data'
            })
            .then(function (response) {
                if (response.status === 200) {
                    console.log(response);
                    $scope.startUpload = false;
                    ngDialog.open({
                        template: 'views/success.html',
                        scope: $scope,
                        className: 'ngdialog-theme-default',
                        controller: "successController"
                    });
                    $window.location.reload();
                }
            }, function (response) {
                if (response.status === 401) {
                    $scope.startUpload = false;
                    ngDialog.open({
                        template: '<p>登录过期或未登录</p>',
                        plain: true
                    });
                }
                if (response.status === 510) {
                    $scope.startUpload = false;
                    ngDialog.open({
                        template: '<p>文件必须小于25M</p>',
                        plain: true
                    });
                }
            });
    };
    $scope.couseras = CouseraFactory.couseras;
}])
