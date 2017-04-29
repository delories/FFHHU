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
            name: '复变函数与积分变换'
        },
        {
            name: '模电'
        },
        {
            name: '微机原理'
        },
        {
            name: '数字逻辑与系统'
        },

        {
            name: '离散数学 '
        },
        {
            name: '管理学 '
        },
        {
            name: '微观经济学'
        },
        {
            name: '会计学 '
        },
        {
            name: '宏观经济学 '
        },
        {
            name: '国际商务'
        },
        {
            name: '管理沟通 '
        },
        {
            name: '运营与信息管理A '
        },
        {
            name: '统计学'
        },
        {
            name: '财务管理B '
        },
        {
            name: '项目管理 '
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
////////////////////////////////////////
        {
            name: '商事法律'
        },

        {
            name: '市场营销A'
        },
        {
            name: '组织行为学'
        },
        {
            name: '运筹学 '
        },
        {
            name: '战略管理'
        },
        {
            name: '人力资源管理'
        },
        {
            name: '管理信息系统'
        },
        {
            name: '质量管理'
        },
        {
            name: '公司治理'
        },
        {
            name: '客户关系管理 '
        },
        {
            name: '供应链管理'
        },
        {
            name: '工作分析 '
        },
        {
            name: '人力资源测评'
        },
        {
            name: '人力资源开发与培训'
        },
        {
            name: '绩效管理'
        },
        {
            name: '消费者行为'
        },
        {
            name: '市场调查与预测'
        },
        {
            name: '品牌营销 '
        },
        {
            name: '营销渠道管理 '
        },
        {
            name: '服务营销'
        },
        {
            name: '信息社会与信息人'
        },
        {
            name: '数据结构'
        },
        {
            name: '数据库原理与应用 '
        },
        {
            name: '信息管理学'
        },
        {
            name: '计算机网络'
        },
        {
            name: '管理信息系统'
        },
        {
            name: '面向对象程序设计(Java)'
        },
        {
            name: 'C程序设计语言'
        },
        {
            name: '信息系统分析与设计'
        },
        {
            name: 'Web技术应用'
        },
        {
            name: '信息组织与检索'
        },
        {
            name: '商务智能方法与应用 '
        },
        {
            name: '企业资源计划'
        },
        {
            name: '电子商务A'
        },
        {
            name: '会计学入门'
        },
        {
            name: '会计信息系统'
        },
        {
            name: '企业财务分析'
        },
        {
            name: '管理会计'
        },

        {
            name: '中级财务会计I'
        },
        {
            name: '中级财务会计Ⅱ'
        },
        {
            name: '高级财务会计 '
        },
        {
            name: '成本会计'
        },
        {
            name: '审计学'
        },
        {
            name: '政府与非营利组织会计'
        },
        {
            name: '会计理论'
        },
        {
            name: '会计制度设计'
        },
        {
            name: '税法 '
        },
        {
            name: '证券投资分析'
        },
        {
            name: '中国对外贸易问题探讨 '
        },
        {
            name: '国际经济学'
        },
        {
            name: '经贸英语'
        },
        {
            name: '进出口实务'
        },
        {
            name: '计量经济学'
        },
        {
            name: '国际金融 '
        },
        {
            name: '国际商法'
        },
        {
            name: '外贸英语函电'
        },
        {
            name: '世界经济概论'
        },
        {
            name: '国际结算'
        },
///////////////////////////////////
        {
            name: '单片机原理及应用'
        },
        {
            name: '现代控制理论 '
        },
        {
            name: '电力电子技术'
        },
        {
            name: '电拖'
        },
        {
            name: '电气控制及PLC技术'
        },
        {
            name: '运动控制系统'
        },
        {
            name: '传感器技术'
        },
        {
            name: '工程图学'
        },
        {
            name: '过程控制系统'
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
/////////////////////////////////////
        {
            name: '数据统计与分析'
        },
        {
            name: '系统工程'
        },
        {
            name: '预测与决策技术'
        },
        {
            name: '社会科学研究方法'
        },
        {
            name: '供应链管理'
        },
        {
            name: '信息技术前沿'
        },
        {
            name: '企业信息化专题'
        },
        {
            name: '计算机组成原理'
        },
        {
            name: '操作系统原理'
        },
        {
            name: '软件开发工具'
        },
        {
            name: '信息系统集成'
        },
        {
            name: 'IT项目管理'
        },
        {
            name: '客户关系管理'
        },
        {
            name: 'IT项目监理'
        },
        {
            name: '信息系统测试'
        },
        {
            name: '协同管理系统'
        },
        {
            name: '预测与决策技术'
        },
        {
            name: '公共关系学'
        },
        {
            name: '计量经济学'
        },
        {
            name: '社会科学研究方法'
        },
        {
            name: '跨文化管理'
        },
        {
            name: '网络营销'
        },
        {
            name: '数据与统计分析'
        },
        {
            name: '生涯发展规划'
        },
        {
            name: '劳动关系与社会保障'
        },
        {
            name: '管理工作技能'
        },
        {
            name: '创业学'
        },
        {
            name: '电子商务B'
        },
        {
            name: '证券投资分析'
        },
        {
            name: '国际物流学'
        },
        {
            name: '外贸运输与保险'
        },
        {
            name: '商务策划与案例分析'
        },
        {
            name: '技术经济学'
        },
        {
            name: '市场调查与预测'
        },
        {
            name: '高级财务管理'
        },
        {
            name: '高级财务管理'
        },
        {
            name: '国际会计'
        },
        {
            name: '人力资源管理'
        },
        {
            name: '税收筹划'
        },
        {
            name: '金融会计'
        },
////////////////////////
        {
            name: '智能机器人基础'
        },
        {
            name: '过程测量仪表'
        },
        {
            name: '组态控制'
        },
        {
            name: 'Matlab语言与控制系统仿真'
        },
        {
            name: '自适应控制'
        },
        {
            name: 'PID控制'
        },
        {
            name: '数据融合在故障诊断中的应用'
        },
        {
            name: '现场总线'
        },
        {
            name: '电力电子技术在电力系统中的应用'
        },
        {
            name: '模糊控制'
        },
////////////////专业全称/////////////////
		{
            name: '计算机科学与技术'
        },
		{
            name: '机械工程'
        },
		{
            name: '能源与动力工程'
        },
		{
            name: '金属材料'
        },
		{
            name: '工业设计'
        },
		{
            name: '通信工程'
        },
		{
            name: '电子科学与技术'
        },
		{
            name: '自动化'
        },
		{
            name: '物联网工程'
        },
		{
            name: '工商管理'
        },
		{
            name: '会计学'
        },
		{
            name: '国际经济与贸易'
        },
		{
            name: '信息管理与信息系统'
        },
        ////////////////////////电子书/////////
        {
            name: '马列主义毛邓思想'
        },
        {
            name: '哲学'
        },
        {
            name: '社会科学总论'
        },
        {
            name: '政治、法律'
        },
        {
            name: '军事'
        },
        {
            name: '经济'
        },
        {
            name: '文化、科学、教育、体育'
        },
        {
            name: '语言、文字'
        },
        {
            name: '文学'
        },
        {
            name: '艺术'
        },
        {
            name: '历史、地理'
        },
        {
            name: '自然科学总论'
        },
        {
            name: '军事'
        },
        {
            name: '数理科学和化学'
        },
        {
            name: '天文学、地球科学'
        },
        {
            name: '生物科学'
        },
        {
            name: '医药、卫生'
        },
        {
            name: '农业科学'
        },
        {
            name: '工业技术'
        },
        {
            name: '交通运输'
        },
        {
            name: '航空、航天'
        },
        {
            name: '环境科学、安全科学'
        },
        {
            name: '综合性图书'
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
