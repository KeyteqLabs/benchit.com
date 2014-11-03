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
    });
