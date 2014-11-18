var cloudfront = 'd6z0ab4she5iy.cloudfront.net';
angular.module('benchit.com', ['ui.router'])
    .config(function($locationProvider, $urlRouterProvider, $stateProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $urlRouterProvider.when('', '/');
        var featuresResolver = ['$http', function($http) {
            return $http.get('/features.json').then(function(data) {
                return data;
            });
        }];
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: '/views/main.html',
                controller: 'Main',
                resolve: {
                    features: featuresResolver
                }
            })
            .state('signup', {
                url: '/signup',
                controller: 'Signup',
                templateUrl: '/views/signup.html',
            })
            .state('signup.done', {
                url: '/done',
                templateUrl: '/views/signup-done.html',
                params: {ok:true,new:true},
                controller: function($scope, $stateParams, $state) {
                    if (typeof $stateParams.new === 'undefined') {
                        $state.go('signup');
                    }
                    $scope.new = $stateParams.new;
                    $scope.ok = $stateParams.ok;
                }
            })
            .state('feature', {
                url: '/feature/:feature',
                templateUrl: '/views/feature.html',
                controller: 'Feature',
                resolve: {
                    features: featuresResolver,
                    feature: function($stateParams, features) {
                        var key = $stateParams.feature;
                        for (var i = 0; i < features.data.length; i++) {
                            if (features.data[i].url === key) {
                                return features.data[i]
                            }
                        }
                        return null;
                    }
                }
            })
        var staticPages = ['faq', 'terms'];
        staticPages.forEach(function(state) {
            $stateProvider.state(state, {
                url: '/' + state,
                templateUrl: '/views/' + state + '.html'
            });
        });

    })
    .run(function($rootScope) {
        $rootScope.mediaUrl = function(id, width, height) {
            height = height || 900;
            return '//' + cloudfront + '/' + width + 'x' + height + '/' + id + '.png?original=1';
        }
    })
    .controller('Feature', function($scope, feature) {
        $scope.feature = feature;
    })
    .controller('Main', function($scope, $rootScope, features) {
        $scope.imgWidth = 350;
        $scope.featureList = features.data;
    })
    .controller('Signup', function($scope, $http, $state) {
        $scope.user = {
            email: ''
        };
        var url = "http://platform.launchrock.com/v1/createSiteUser";
        $scope.submit = function() {
            $scope.loading = true;
            var data = {
                email: $scope.user.email,
                site_id: "YZGIKVEW",
                source: "CE9TOXQR"
            };
            $.ajax({
                url: url,
                data: data,
                method: 'post'
            }).success(function(res) {
                var data = res[0].response;
                $state.go('signup.done', {
                    ok: data.status == 'OK',
                    new: data.site_user.new_user == '1'
                });
            });
        };
    });
