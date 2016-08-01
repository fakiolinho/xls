angular
    .module('myApp')
    .component('homeComponent', {
        bindings: {
            photos: '<'
        },
        controller: homeComponentController,
        templateUrl: './components/home.template.html'
    });

homeComponentController.$inject = ['$scope', 'photoService', '$timeout'];

function homeComponentController($scope, photoService, $timeout) {
    var self = this;
    self.buffer = [];
    self.counter = 0;
    self.windowHeight = window.innerHeight;
    self.rectangleHeight = 0;

    // Calculate rectangle's height after ng-repeat has finished
    $timeout(function() {
        self.rectangleHeight = document.querySelector('.list-group').offsetHeight;
    });

    // Bootstrap the functionality while window scrolls down or up
    scroller();

    // Watch for counter's changes and rectangle's height calculation
    $scope.$watchGroup([
        function() {
            return self.counter;
        },
        function() {
            return self.rectangleHeight;
        }
    ], function(newVal, oldVal) {
        console.log(newVal);
        var index = newVal[0],
            rectangleHeight = newVal[1];
        if (self.buffer[index] === undefined && rectangleHeight) {
            self.buffer[index] = {
                rectanglePoints: [rectangleHeight * index + 200, rectangleHeight * (index + 1) - self.windowHeight - 200],
                request: false,
                show: false,
                data: []
            };
            console.log('new counter', index);
        }
    });

    function scroller() {
        angular.element(window).on('scroll', function() {
            if (self.rectangleHeight) {
                var scrollY = this.pageYOffset;

                if (scrollY > self.buffer[self.counter].rectanglePoints[0] && scrollY <= self.buffer[self.counter].rectanglePoints[1]) {
                    // second rectangle section
                    // check if buffer[counter].request is false (prevent useless extra requests)
                    // if yes then make the request here
                    // populate buffer[counter].data with real array data

                    if (!self.buffer[self.counter].request) {
                        self.buffer[self.counter].request = true;
                        // make the request here
                        photoService
                            .all()
                            .then(function(response) {
                                self.buffer[self.counter].data = response.data.slice(self.counter * 100, self.counter * 100 + 100);
                                console.log('GET NEW ITEMS', self.counter);
                            })
                            .then(function() {
                                if (!self.buffer[self.counter].show) {
                                    // show new data
                                    self.buffer[self.counter].show = true;
                                    self.photos = self.photos.concat(self.buffer[self.counter].data);
                                    console.log('SHOW NEW ITEMS', self.counter);
                                }
                            })
                            .catch(function(err) {
                                console.log(err);
                            });
                    }
                }

                $scope.$apply(function() {
                    self.counter = Math.floor(scrollY / self.rectangleHeight);
                });
            }
        });
    }
}
