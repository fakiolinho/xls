angular
    .module('myApp')
    .factory('photoService', photoService);

photoService.$inject = ['$http'];

function photoService($http) {
    return {
        all: all
    };

    function all() {
        return $http.get('http://jsonplaceholder.typicode.com/photos');
    }
}
