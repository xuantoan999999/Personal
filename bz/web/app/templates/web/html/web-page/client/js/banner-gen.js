(function() {
    'use strict';
    var modHome = $("#mod-banner-gen");
    if (modHome.length > 0) {

        function sliderBannerHome() {
            modHome.find(".list-item").slick({
                dots: true,
                customPaging : function(slider, i) {
                    var thumb = $(slider.$slides[i]).data('thumb');
                    console.log(thumb);
                    return '<a>'+thumb+'</a>';
                },
                centerMode: true,
                centerPadding: '150px',
                slidesToShow: 1,
                arrows: true,
                slidesToScroll: 1,
                autoplaySpeed: 5000

            });
        }
        $(document).ready(function() {
            sliderBannerHome();
        });
    }
})();