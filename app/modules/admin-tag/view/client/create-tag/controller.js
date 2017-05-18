var tagAddCtrl = (function () {
    'use strict';

    angular
        .module('bzTag')
        .controller('tagAddCtrl', tagAddCtrl);

    function tagAddCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, tagSvc, listTagTypeBlog) {
        /* jshint validthis: true */
        var vmAddTags = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('tag','add') ))){
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmAddTags.formData = {};
        vmAddTags.lockFOrm = false;
        vmAddTags.save = create;
        vmAddTags.submitted = false;
        vmAddTags.listTagTypeBlog = listTagTypeBlog;

        //Init form
        vmAddTags.formData.type = "SP";

        function create(isValid) {
            vmAddTags.submitted = true;
            vmAddTags.lockForm = true;
            if (isValid) {
                tagSvc.create(vmAddTags.formData)
                .then(function (resp) {
                    $bzPopup.toastr({
                        type: 'success',
                        data: {
                            title: 'Nhãn sản phẩm',
                            message: 'Thêm thành công'
                        }
                    });
                $state.go('tag-list');
                }).catch(function (error) {
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Thêm nhãn sản phẩm ',
                            message: error.data.message
                        }
                    });
                });
            }
            else {
                vmAddTags.submitted = true;
            }
        };
    }

    var resolve = {
        /* @ngInject */
        preload: function (bzPreloadSvc) {
            return bzPreloadSvc.load([]);
        }
    };

    return {
        resolve: resolve
    };
})();