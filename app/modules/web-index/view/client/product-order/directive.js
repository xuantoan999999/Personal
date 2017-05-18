(function () {
    'use strict';
    angular
        .module('bzApp')
        .directive('productOrderBtn', productOrderBtn);

    function productOrderBtn($window, $rootScope, apiProductSvc) {
        var template = '';
        template += '<div data-ng-if="product.qty_in_stock > 0">'
            + '   <button class="btn btn-primary" data-ng-if="!product.quantity || product.quantity == 0" ng-click="addToCart(); addToCartGA({ _id:product.id, price: product.price });">'
            + '       <img data-ng-src="{{linkAssets}}frontend/images/card-button.svg" class="img-reponsive" alt="card-button.svg" data-ng-if="!showImage">'
            + '       Bỏ vào giỏ'
            + '   </button>'
            + '   <div class="soluong show" data-ng-if="product.quantity && product.quantity > 0">'
            + '       <img data-ng-src="{{linkAssets}}frontend/images/icon-giam.svg" data-ng-if="product.quantity > 0" class="img-reponsive" alt="" ng-click="decreaseCart()">'
            + '       <img data-ng-src="{{linkAssets}}frontend/images/icon-giam.svg" data-ng-if="product.quantity == 0" class="img-reponsive disabled" alt="">'
            + '       <span>{{product.quantity}}</span>'
            + '       <img data-ng-src="{{linkAssets}}frontend/images/icon-tang.svg" data-ng-if="product.quantity < product.qty_in_stock" class="img-reponsive" alt="" ng-click="addToCart()">'
            + '       <img data-ng-src="{{linkAssets}}frontend/images/icon-tang.svg" data-ng-if="product.quantity >= product.qty_in_stock" class="img-reponsive disabled" alt="">'
            + '   </div>'
            + '</div>'
            + '<div data-ng-if="product.qty_in_stock == 0">'
            + '   <button class="btn btn-primary" disabled>Sắp có hàng</button>'
            + '</div>';

        return {
            restrict: 'AE',
            template: template,
            link: function ($scope, element, $attrs) {
                // Variable
                $scope.pageGa = $window.pageGa;
                $scope.linkAssets = settingJs.configs.webUrl + '/assets/';
                $scope.disabedOrder = true;
                $scope.product = JSON.parse($attrs.product);
                $scope.showImage = $attrs.showImage;

                // Methods
                $scope.addToCart = addToCart;
                $scope.decreaseCart = decreaseCart;
                $scope.addToCartGA = apiProductSvc.addToCartGA;
                $scope.$on('Cart:getCart', getCart);

                element.addClass('take-cart');
                getCart();

                function getCart(event, data) {
                    try {
                        var find_cart = $rootScope.Cart.items.find(function (item) {
                            return item.id_product == $scope.product.id
                        })
                    } catch (error) {
                        var find_cart = apiProductSvc.findByIdProduct($rootScope.Cart.items, $scope.product.id)
                    }
                    if (find_cart) {
                        $scope.product.quantity = find_cart.quantity;
                    }
                    $scope.disabedOrder = true;
                }

                function addToCart() {
                    helperJsCustom.GA('send', 'event', $scope.pageGa, 'ClickIncreaseQuantityItem', '');
                    if ($scope.disabedOrder) {
                        $scope.disabedOrder = false;
                        apiProductSvc.addToCart($scope.product.id, function (resp) {
                            getCart();
                        })
                    }
                }

                function decreaseCart() {
                    helperJsCustom.GA('send', 'event', $scope.pageGa, 'ClickDecreaseQuantityItem', '');
                    if ($scope.disabedOrder) {
                        $scope.disabedOrder = false;
                        apiProductSvc.decreaseCart($scope.product.id, $scope.product.quantity, function (resp) {
                            getCart();
                        })
                    }
                }
            }
        };
    }
})();