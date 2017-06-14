'use strict';

// Products controller
angular
    .module('products')
    .controller(
    'ProductsEditController', ['$scope', '$stateParams', '$location', '$window', 'Option', 'Authentication', 'Products', 'Util', 'toastr', 'FileUploader', 'Upload', 'productSvc', '$uibModal',
        function ($scope, $stateParams, $location, $window, Option, Authentication, Products, Util, toastr, FileUploader, Upload, productSvc, $uibModal) {
            // Variable
            $scope.authentication = Authentication;
            if (!Authentication.isAdmin) {
                $location.path('signin');
            }
            $scope.types = Option.getTypes();
            $scope.statuses = Option.getStatusDefault();
            $scope.uploadApi = $window.settings.services.uploadApi;
            $scope.urlTmp = $window.settings.services.webUrl + '/files/product/tmp/';
            $scope.url = $window.settings.services.webUrl + '/files/product/';
            $scope.dataTmp = {
                color: []
            }
            $scope.form_color = {
                showAdd: false
            };
            $scope.dataColorAdd = {};
            $scope.imgDelete = [];
            $scope.loading = true;
            $scope.listColor = Option.getListColor();
            $scope.jsonEditorOpt = {
                search: false
            }

            // Method
            $scope.findOne = findOne;
            $scope.changeToSlug = changeToSlug;
            $scope.uploadImage = uploadImage;
            $scope.removeImage = removeImage;
            $scope.showAddColor = showAddColor;
            $scope.hideAddColor = hideAddColor;
            $scope.showEditColor = showEditColor;
            $scope.hideEditColor = hideEditColor;
            $scope.addColor = addColor;
            $scope.editColor = editColor;
            $scope.deleteColor = deleteColor;
            $scope.submit = submit;

            function findOne() {
                Products.get({
                    productId: $stateParams.productId
                }, function (resp) {
                    $scope.data = resp.data;
                    $scope.data.color = $scope.data.color.map(function (item) {
                        return {
                            name: item.name,
                            image: item.image,
                            value: $scope.listColor.find(function (color) {
                                return color.value == item.value;
                            })
                        }
                    });
                    $scope.dataTmp = {
                        color: $scope.data.color.map(function (item) {
                            return item;
                        }),
                    };

                    productSvc.getListModel(function (data) {
                        var indexFindModel = 0;
                        var tmp_find = data.items.find(function (item, index) {
                            indexFindModel = index;
                            return $scope.data.model.toString() == item._id.toString();
                        })
                        $scope.dataTmp.model = data.items[indexFindModel];
                        $scope.listModel = data.items;
                    });
                    productSvc.getListBrand(function (data) {
                        var indexFindBrand = 0;
                        var tmp_find = data.items.find(function (item, index) {
                            indexFindBrand = index;
                            return $scope.data.brand.toString() == item._id.toString();
                        })
                        $scope.dataTmp.brand = data.items[indexFindBrand];
                        $scope.listBrand = data.items;
                    })
                    productSvc.getListSuplier(function (data) {
                        var indexFindSuplier = 0;
                        var tmp_find = data.items.find(function (item, index) {
                            indexFindSuplier = index;
                            return $scope.data.supplier.toString() == item._id.toString();
                        })
                        $scope.dataTmp.supplier = data.items[indexFindSuplier];
                        $scope.listSuplier = data.items;
                    })

                    $scope.loading = false;
                });

            };

            function changeToSlug() {
                $scope.data.slug = Util.changeToSlug($scope.data.name);
            }

            function uploadImage(file, type, color) {
                if (file.length > 0) {
                    if (file[0].type == "image/png" || file[0].type == "image/jpeg") {
                        Upload.upload({
                            url: $window.settings.services.uploadApi + '/api/upload/image',
                            data: {
                                file: file[0],
                                type: 'product',
                                filename: file[0].name,
                            }
                        }).then(function (resp) {
                            if (type == 'thumb') {
                                if ($scope.data.thumb) {
                                    $scope.imgDelete.push({
                                        url: $scope.url,
                                        fileName: $scope.data.thumb.url
                                    });
                                }
                                $scope.data.thumb = {
                                    url: resp.data.file.filename
                                }
                            }
                            if (type == 'gallery') {
                                $scope.data.gallery.push({
                                    url: resp.data.file.filename
                                });
                            }
                            if (type == 'colorAdd') {
                                $scope.dataColorAdd.image = resp.data.file.filename;
                            }
                            if (type == 'color') {
                                color.image = resp.data.file.filename;
                            }
                            if (type == 'feature') {
                                $scope.data.feature = resp.data.file.filename;
                            }
                            toastr.success("Upload hình ảnh thành công!", 'Thành công');
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

            function removeImage(key, type, fileName) {
                if (type == 'thumb') {
                    $scope.data.thumb = null;
                }
                if (type == 'gallery') {
                    $scope.data.gallery.splice(key, 1);
                }
                $scope.imgDelete.push({
                    url: $scope.url,
                    fileName: fileName
                });
            }

            function showAddColor() {
                $scope.form_color.showAdd = true;
            }

            function hideAddColor() {
                $scope.form_color.showAdd = false;
                $scope.dataColorAdd = {};
            }

            function showEditColor(key) {
                $scope.dataTmp.color[key].showEdit = true;
            }

            function hideEditColor(key) {
                $scope.dataTmp.color[key] = {
                    value: $scope.data.color[key].value,
                    name: $scope.data.color[key].name,
                    image: $scope.data.color[key].image
                };
                $scope.dataTmp.color[key].showEdit = false;
            }

            function addColor() {
                $scope.dataColorAdd.submited = true;
                if ($scope.dataColorAdd.name && $scope.dataColorAdd.value && $scope.dataColorAdd.image) {
                    $scope.data.color.push({
                        value: $scope.dataColorAdd.value,
                        name: $scope.dataColorAdd.name,
                        image: $scope.dataColorAdd.image
                    });
                    $scope.dataTmp.color.push({
                        value: $scope.dataColorAdd.value,
                        name: $scope.dataColorAdd.name,
                        image: $scope.dataColorAdd.image
                    });
                }
                hideAddColor();
            }

            function editColor(key) {
                $scope.data.color[key] = {
                    value: $scope.dataTmp.color[key].value,
                    name: $scope.dataTmp.color[key].name,
                    image: $scope.dataTmp.color[key].image
                };
                $scope.dataTmp.color[key].showEdit = false;
            }

            function deleteColor(key) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/templates/admin-core/popupMessage.html',
                    resolve: {
                        vmProduct: function () {
                            return $scope;
                        }
                    },
                    controller: function ($scope, $uibModalInstance, vmProduct) {
                        $scope.popTitle = 'Xóa';
                        $scope.message = 'Bạn muốn xóa color này?';

                        $scope.ok = function () {
                            vmProduct.dataTmp.color.splice(key, 1);
                            vmProduct.data.color.splice(key, 1);
                            $uibModalInstance.close();
                        }
                    }
                });
            }

            function submit(form) {
                $scope.data.color = $scope.data.color.map(function (item) {
                    return {
                        name: item.name,
                        image: item.image,
                        value: item.value.value
                    }
                });
                if (!$scope.dataTmp.supplier &&
                    !$scope.dataTmp.brand &&
                    !$scope.dataTmp.model) {
                    toastr.error('Chưa nhập đủ thông tin.', 'Lỗi');
                    return;
                }
                $scope.data.supplier = $scope.dataTmp.supplier._id;
                $scope.data.brand = $scope.dataTmp.brand._id;
                $scope.data.model = $scope.dataTmp.model._id;
                if ($scope.data.color.length == 0) {
                    toastr.error('Chưa upload color.', 'Lỗi');
                    return;
                }
                if ($scope.data.gallery.length == 0) {
                    toastr.error('Chưa upload galerry.', 'Lỗi');
                    return;
                }
                if (!$scope.data.thumb) {
                    toastr.error('Chưa upload thumb.', 'Lỗi');
                    return;
                }
                if (!form.$valid) {
                    toastr.error('Not enough information.', 'Lỗi');
                    return;
                }

                var Product = new Products($scope.data);
                Product.$update(function (resp) {
                    toastr.success("Cập nhật sản phẩm thành công!", 'Thành công');
                    $location.path('products');
                }, function (err) {
                    console.log(err);
                    toastr.error(err.data.message, 'Lỗi');
                })
            }
        }
    ]);
