(function() {
	'use strict';

	var $modMenu = $("#mod-menu");

	function bzPullMenu() {
		var openClass = 'is-open',
		closeClass = 'is-close',
		$modMenuMb = $('#mod-menu-mob');

		$modMenuMb.find(".pull-menu").on('click', function(event) {
			event.preventDefault();
			if($(this).hasClass(openClass)) {
				close();
			} else {
				open();
			}
		});

		function open() {
			$modMenuMb.find(".pull-menu").removeClass(closeClass).addClass(openClass);
			$modMenu.find(".menu-desk").removeClass(closeClass).addClass(openClass);
		}

		function close() {
			$modMenuMb.find(".pull-menu").removeClass(openClass).addClass(closeClass);
			$modMenu.find(".menu-desk").removeClass(openClass).addClass(closeClass);
		}
	}

	function bzDesktopMenu() {
		var li = $modMenu.find('li'),
		menuDesk = $modMenu.find('.menu-desk'),
		fadeSpeedEffect = 100,
		subMegaClass = 'mega',
		subListClass = 'list',
		hasSubClass = 'has-sub',
		hoverClass = 'hover',
		activeClass = 'active',
		subCurrent = '';

		li.on('mouseenter', function() {
			$(this).addClass(hoverClass).find('>ul,>div').stop().fadeIn(fadeSpeedEffect);
		}).on('mouseleave', function(){
			$(this).removeClass(hoverClass).find('>ul,>div').stop().fadeOut(fadeSpeedEffect);
		});

		function showArrow() {
			li.has('ul,div').addClass(hasSubClass).find('>a').append('<i>&nbsp</i>');
		}

		function autoActive() {
			var liActive = li.filter('.'+activeClass);
			liActive.parents('li').addClass(activeClass);
		}
	}

	$(document).ready(function() {
		bzDesktopMenu();
		bzPullMenu();
	});
})();
