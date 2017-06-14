angular
    .module('Auth')
    .controller('AuthController', AuthController);

function AuthController($scope, $filter, AuthService, $cookies) {

    $scope.register = register;
    $scope.login = login;
    $scope.logout = logout;
    $scope.myaccount = myaccount;
    $scope.updateMyAccount = updateMyAccount;
    $scope.changePassword = changePassword;
    $scope.reset = reset;
    $scope.forgot = forgot;

    function register() {
        if ($scope.registerForm.$valid) {
            var data = {
                name: this.name,
                email: this.email,
                password: this.password,
                cfpassword: this.cfpassword
            };
            AuthService.register(data).then(function(res) {
                $scope.registerSuccess = true;
                window.location.href = '/login';
            }).catch(function(res) {
                $scope.errors = [res.data.message];
            });
        }
    };

    function login() {
        if ($scope.loginForm.$valid) {
            var data = {
                email: this.email,
                password: this.password
            };
            AuthService.login(data).then(function(res) {
                $scope.loginSuccess = true;
                console.log(res.data.token);
                $cookies.put('token', res.data.token);
                window.location.href = '/';
            }).catch(function(res) {
                $scope.errors = [res.data.message];
            });
        }
    };

    function logout() {
        AuthService.logout().then(function(res) {
            $cookies.put('token', '');
            window.location.href = '/';
        }).catch(function(res) {
            $scope.errors = [res.data.message];
        });
    };

    function myaccount() {
        AuthService.account().then(function(res) {
            $scope.user = res.data;
        }).catch(function(res) {
            $scope.errors = [res.data.message];
        });
    };

    function updateMyAccount() {
        var data = {
            email: this.user.email,
            name: this.user.name
        };
        AuthService.updateAccount(data).then(function(res) {
            $scope.updateSuccess = true;
        }).catch(function(res) {
            $scope.errors = [res.data.message];
        });
    };


    function changePassword() {
        var data = {
            currentPassword: this.currentPassword,
            newPassword: this.newPassword,
            confirmNewPassword: this.confirmNewPassword
        };
        AuthService.changepassword(data).then(function(res) {
            $scope.updateSuccess = true;
        }).catch(function(res) {
            $scope.errors = [res.data.message];
        });
    };

    function reset() {
        var data = {
            newPassword: this.newPassword,
            confirmNewPassword: this.confirmNewPassword
        };
        var resetPasswordToken = angular.element('#resetPasswordToken').val();
        console.log(resetPasswordToken);
        AuthService.reset(resetPasswordToken, data).then(function(res) {
            $scope.updateSuccess = true;
        }).catch(function(res) {
            $scope.errors = [res.data.message];
        });
    };

    function forgot() {
        var data = { email: this.email };
        AuthService.forgot(data).then(function(res) {
            $scope.updateSuccess = true;
        }).catch(function(res) {
            $scope.errors = [res.data.message];
        });
    };
}