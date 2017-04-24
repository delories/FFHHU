'use strict';

angular.module('ffhhuApp')

.constant("baseURL", "http://localhost:3444/")
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
        var admin = 0;

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
            console.log(credentials);
            admin = credentials.admin;

            // Set the token as header for your requests!
            $http.defaults.headers.common['x-access-token'] = authToken;
        }

        function destroyUserCredentials() {
            authToken = undefined;
            admin = 0;
            username = '';
            isAuthenticated = false;
            $http.defaults.headers.common['x-access-token'] = authToken;
            console.log("logout");
            $localStorage.remove(TOKEN_KEY);
        }

        authFac.getToken = function () {
            return authToken;
        }

        authFac.getAdmin = function () {
            console.log(admin);
            return admin;
        }

        authFac.login = function (loginData) {

            $resource(baseURL + "users/login")
                .save(loginData,
                    function (response) {
                        storeUserCredentials({
                            username: loginData.username,
                            token: response.token,
                            admin: response.admin
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
        'getFile_': {
            method: 'POST',
            isArray: true
        }
    });

}])

.factory('CouseraFactory', ['$rootScope', 'baseURL', function ($rootScope, baseURL) {
    var coFac = {};
    coFac.couseras = [
//////////////专业基础课//////////////////
        {
            name: '高数Ⅰ '
        },
        {
            name: '高数Ⅱ'
        },
        {
            name: '大学物理Ⅰ '
        },
        {
            name: '大学物理Ⅱ '
        },
        {
            name: '基本电路与电子学'
        },
        {
            name: '离散数学 '
        },
///////////专业主干课///////////////////////		
        {
            name: '数字逻辑与系统'
        },

        {
            name: '线性代数'
        },
        {
            name: '概率论'
        },
        {
            name: 'java语言程序设计 '
        },
        {
            name: '数据结构'
        },
        {
            name: '操作系统'
        },
        {
            name: '数据库原理'
        },
        {
            name: '软件工程'
        },
        {
            name: '算法设计与分析'
        },
/////////////////////专业内选修//////////////////
        {
            name: '人工智能'
        },
        {
            name: '密码学与网络安全'
        },
        {
            name: '多媒体数据处理'
        },
        {
            name: '模式识别'
        },
        {
            name: '数据仓库与数据挖掘'
        },
        {
            name: '数值分析与计算'
        },
        {
            name: '面向对象程序设计'
        },
        {
            name: '并行计算'
        },
        {
            name: '单片机原理与应用'
        },
        {
            name: '嵌入式软件开发技术'
        },
        {
            name: '计算机动画与虚拟现实技术'
        },
        {
            name: 'java高级开发'
        },
        {
            name: 'net高级开发'
        },
        {
            name: '软件过程管理与软件测试'
        },
        {
            name: 'tcp/ip协议及编程'
        },
        {
            name: '计算机辅助设计'
        },
        {
            name: '大型数据库应用于开发'
        },
        {
            name: '统一建模语言uml'
        },
        {
            name: ''
        },
//////////////////专业外选修课////////////////	
        {
            name: '无线传感器网络原理'
        },
        {
            name: '射频技术与无线通信'
        },
        {
            name: '信号与线性系统'
        },
        {
            name: '通信原理b'
        },
        {
            name: '数学建模'
        },

    ];
    return coFac;
}])

.factory('DelFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', function ($resource, $http, $localStorage, $rootScope, $window, baseURL) {
    return $resource(baseURL + "search/all/:id", {
        id: "@id"
    }, {
        'change': {
            method: 'POST'
        }
    });

}])

.factory('UpFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', function ($resource, $http, $localStorage, $rootScope, $window, baseURL) {
    return $resource(baseURL + "upload/wps", null, {
        upFile_: {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            transformRequest: function (data, headersGetter) {
                var str = [];
                for (var d in data)
                    str.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
                return str.join("&");
            }
        },
    });

}])
