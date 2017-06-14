'use strict';

// Categories controller
angular
    .module('categories')
    .controller(
    'CategoriesAddController', ['$scope', '$stateParams', '$location', '$window', 'Option', 'Authentication', 'Categories', 'Util', 'toastr', 'FileUploader', 'Upload',
        function ($scope, $stateParams, $location, $window, Option, Authentication, Categories, Util, toastr, FileUploader, Upload) {
            // Variable
            $scope.authentication = Authentication;
            if (!Authentication.user.name) {
                $location.path('signin');
            }
            $scope.types = Option.getTypes();
            $scope.statuses = Option.getStatusDefault();
            $scope.uploadApi = $window.settings.services.uploadApi;
            $scope.urlTmp = $window.settings.services.webUrl + '/files/category/tmp/';
            $scope.url = $window.settings.services.webUrl + '/files/category/';
            $scope.data = {
                type: $stateParams.type
            }
            $scope.type = $stateParams.type;

            // Method
            $scope.changeToSlug = changeToSlug;
            $scope.uploadImage = uploadImage;
            $scope.removeImage = removeImage;
            $scope.submit = submit;

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
                            toastr.success("Upload hình ảnh thành công!", 'Thành công');
                            $scope.data.image = resp.data.file.filename;
                            $scope.data_tmp.image_url = $scope.url + resp.data.file.filename;
                        }, function (err) {
                            console.error(err);
                            toastr.error(err.error, 'Error');
                        });
                    }
                    else {
                        toastr.error('Hình ảnh phải có định dạng png hoặc jpg!', 'Lỗi!');
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
                    toastr.error('Chưa nhập đủ thông tin.', 'Lỗi');
                    return;
                }

                var category = new Categories($scope.data);
                category.$save(function (resp) {
                    toastr.success("Thêm category thành công!", 'Thành công');
                    $location.path('categories');
                }, function (err) {
                    console.log(err);
                    toastr.error(err.data.message, 'Error');
                })
            }
        }
    ]);
