angular
    .module('myApp', ['ngRoute'])
    .run(['$rootScope', function($rootScope) {
        $rootScope.$on('$routeChangeSucces', function() {
            window.scrollTo(0, 0);
        });
    }])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                resolve: {
                    photos: photosPrepService
                },
                template: '<home-component photos="$resolve.photos"></home-component'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);

photosPrepService.$inject = ['photoService'];

function photosPrepService(photoService) {
    return photoService
        .all()
        .then(function(response) {
            return response.data.slice(0, 100);
        });
}
