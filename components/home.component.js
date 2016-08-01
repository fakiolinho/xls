angular
    .module('myApp')
    .component('homeComponent', {
        bindings: {
            photos: '<'
        },
        controller: homeComponentController,
        templateUrl: './components/home.template.html'
    });

homeComponentController.$inject = ['$scope', 'photoService'];

function homeComponentController($scope, photoService) {
    var self = this;
    self.buffer = [];
    self.counter = 0;
    self.windowHeight = window.innerHeight;
    self.rectangleHeight = 4000;
    self.documentHeight = document.body.clientHeight;

    angular.element(window).on('scroll', function() {
        var scrollY = this.pageYOffset;

        if (scrollY <= self.buffer[self.counter].rectanglePoints[0]) {
            // first rectangle section
        } else if (scrollY > self.buffer[self.counter].rectanglePoints[0] && scrollY <= self.buffer[self.counter].rectanglePoints[1]) {
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
                        console.log(123123123123);
                        if (!self.buffer[self.counter].show) {
                            // show new data
                            self.buffer[self.counter].show = true;
                            // $scope.$apply(function() {
                                var photos = self.photos.concat(self.buffer[self.counter].data);
                                self.photos = photos;
                                console.log('SHOW NEW ITEMS', self.counter);
                            // });
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
        } else {
            // third rectangle section
            // check if buffer[counter].show is false (prevent useless extra rendering)
            // show buffer[counter].data
            // set buffer[counter].show to true
            // i guess the best option here is to concat old and new data


        }

        $scope.$apply(function() {
            self.counter = Math.floor(scrollY / self.rectangleHeight);
        });
    });

    $scope.$watch(function() {
        return self.counter;
    }, function(newVal, oldVal) {
        self.buffer.indexOf(newVal, newVal);
        if (self.buffer[newVal] === undefined) {
            self.buffer[newVal] = {
                rectanglePoints: [self.rectangleHeight * newVal + 200, self.rectangleHeight * (newVal + 1) - self.windowHeight - 200],
                request: false,
                show: false,
                data: []
            };
            console.log('new counter', newVal);
        }
    });
}
