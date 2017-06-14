$("#engine").on("hide.bs.collapse", function(){
	$(".view-btn1").html('<span class="glyphicon glyphicon-collapse-down"></span> Xem');
});
$("#engine").on("show.bs.collapse", function(){
	$(".view-btn1").html('<span class="glyphicon glyphicon-collapse-up"></span> Ẩn');
});	
$("#bone").on("hide.bs.collapse", function(){
	$(".view-btn2").html('<span class="glyphicon glyphicon-collapse-down"></span> Xem');
		});
$("#bone").on("show.bs.collapse", function(){
	$(".view-btn2").html('<span class="glyphicon glyphicon-collapse-up"></span> Ẩn');
});	
$("#size").on("hide.bs.collapse", function(){
	$(".view-btn3").html('<span class="glyphicon glyphicon-collapse-down"></span> Xem');
});
$("#size").on("show.bs.collapse", function(){
	$(".view-btn3").html('<span class="glyphicon glyphicon-collapse-up"></span> Ẩn');
});

  $('#mod-product-detail-banner').slick({
      slidesToShow: 1,
	  slidesToScroll: 1,
	  dots: true,
	  arrows: true,
	  autoplay: true,
	  autoplaySpeed: 2000
  });