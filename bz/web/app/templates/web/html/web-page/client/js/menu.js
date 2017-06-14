(function() {
	'use strict';

	var $modMenu = $("#mod-menu");
	var openClass = 'is-open',
	closeClass = 'is-close',
	$modMenuMb = $('#mod-menu-mob');

	
	function bzPullMenu() {
		

		$modMenuMb.find(".pull-menu").on('click', function(event) {
			console.log("1");
			event.preventDefault();
			if($(this).hasClass(openClass)) {
				close();
				console.log("close");
			} else {
				open();
				console.log("open");
			}
		});

		function open() {
			$modMenuMb.find(".pull-menu").removeClass(closeClass).addClass(openClass);
			$modMenu.find(".menu-desk").removeClass(closeClass).addClass(openClass);
			$modMenu.find(".menu-gender").removeClass(closeClass).addClass(openClass)
		}

		function close() {
			$modMenuMb.find(".pull-menu").removeClass(openClass).addClass(closeClass);
			$modMenu.find(".menu-desk").removeClass(openClass).addClass(closeClass);
			$modMenu.find(".menu-gender").removeClass(openClass).addClass(closeClass);
		}
	}


	$(document).ready(function() {
		// bzDesktopMenu();
		bzPullMenu();
	});
})();
