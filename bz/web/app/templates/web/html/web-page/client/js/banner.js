(function() {
	'use strict';
	var modHome = $("#mod-banner");

	if(modHome.length > 0){

		function sliderBannerHome(){
			modHome.find(".list-iem").slick({
				slidesToShow: 1,
				slidesToScroll: 1,
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
