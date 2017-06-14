angular
    .module('Product')
    .controller('productCtrl', productCtrl);

function productCtrl($scope, $filter, $cookies) {
    var vmProduct = this;

    // Methoad
    vmProduct.init = init;
    vmProduct.changeImage = changeImage;

    // Function
    function init() {

    }

    function changeImage(image) {
        var img_old = $('#img-product')
            .css(['background-image'])['background-image']
            .split('/').pop().split('"')[0];
        if (img_old != image) {
            $('#img-product').fadeOut('fast')
                .css('background-image', 'url(files/product/' + image + ')')
                .fadeIn();
        }
    }
}