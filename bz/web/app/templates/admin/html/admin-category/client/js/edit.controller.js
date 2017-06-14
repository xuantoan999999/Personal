'use strict';

// Categories controller
angular
    .module('categories')
    .controller(
    'CategoriesEditController', ['$scope', '$stateParams', '$location', '$window', 'Option', 'Authentication', 'Categories', 'Util', 'toastr', 'FileUploader', 'Upload',
        function ($scope, $stateParams, $location, $window, Option, Authentication, Categories, Util, toastr, FileUploader, Upload) {
            // Variable
            $scope.authentication = Authentication;
            if (!Authentication.isAdmin) {
                $location.path('signin');
            }
            $scope.types = Option.getTypes();
            $scope.type = $stateParams.type;
            $scope.statuses = Option.getStatusDefault();
            $scope.uploadApi = $window.settings.services.uploadApi;
            $scope.urlTmp = $window.settings.services.webUrl + '/files/category/tmp/';
            $scope.url = $window.settings.services.webUrl + '/files/category/';
            $scope.data_tmp = {};

            // Method
            $scope.findOne = findOne;
            $scope.changeToSlug = changeToSlug;
            $scope.uploadImage = uploadImage;
            $scope.removeImage = removeImage;
            $scope.submit = submit;

            function findOne() {
                Categories.get({
                    categoryId: $stateParams.categoryId
                }, function (category) {
                    $scope.data = category.data;
                    $scope.data_tmp.image_url = $scope.url + $scope.data.image;
                });
            };

            function changeToSlug() {
                $scope.data.slug = Util.changeToSlug($scope.data.name);
            }

            function uploadImage(file) {
                if (file.length > 0) {
                    if (file[0].type == "image/png" || file[0].type == "image/jpeg") {
                        Upload.upload({
                            url: $window.settings.services.uploadApi + '/api/upload/image',
                            data: {
                                file: file[0],
                                type: 'category',
                                filename: file[0].name,
                            }
                        }).then(function (resp) {
                            toastr.success("Upload image success!", 'SUCCESS');
                            $scope.data.image = resp.data.file.filename;
                            $scope.data_tmp.image_url = $scope.url + resp.data.file.filename;
                        }, function (err) {
                            console.error(err);
                            toastr.error(err.error, 'Error');
                        });
                    }
                    else {
                        toastr.error('File must be png or jpg format!', 'Error');
                        return;
                    }
                }
            }

            function removeImage() {
                $scope.data.image = null;
                $scope.data_tmp.image_url = null;
            }

            function submit(form) {
                if (!form.$valid) {
                    toastr.error('Not enough information.', 'Error');
                    return;
                }

                var category = new Categories($scope.data);
                category.$update(function (resp) {
                    toastr.success("Update category success!", 'SUCCESS');
                    if ($scope.data.type == 'model') $location.path('model');
                    if ($scope.data.type == 'brand') $location.path('brand');
                }, function (err) {
                    console.log(err);
                    toastr.error(err.data.message, 'Error');
                })
            }
        }
    ]);
