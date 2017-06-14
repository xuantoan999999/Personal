(function() {
	'use strict';
	var modHome = $(".mod-banner-buy");

	if(modHome.length > 0){

		function sliderBannerHome(){
			modHome.find(".ct-moto").slick({
				slidesToShow: 2,
				slidesToScroll: 2,
				dots: true,
				arrows: true,
				autoplay: false,
				autoplaySpeed: 5000
			});
		}
		$(document).ready(function(){
			sliderBannerHome();
		});
	}	
})();
