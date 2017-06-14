angular.module('Contact')
    .controller("ContactController", ContactController)

function ContactController($scope, $filter, ContactService) {
    alert(2222)
    $scope.submit = function() {        
        if ($scope.contactForm.$valid) {
            var data = { name: this.name, email: this.email, message: this.message }
            var promise = ContactService.submit(data);
            console.log(promise);
            promise.then(function(data, status, headers) {
                if (data.status == 1) {
                    $scope.contactSuccess = true;
                } else {
                    $scope.errors = data.messages;
                }
            });
        }
    }
}