var db = new Object();
db.preLoad = function () {
	$('.page-preload').delay(400).fadeOut(200, function () {
		$('body').fadeIn();
	});
	$('.dropdown-toggle').dropdown()
}
db.menuResponsive = function () {
	$('.menu-icon').on('click', function (e) {
		e.stopPropagation();
		$('body').toggleClass("open-menu");
	});
}
db.niceScroll = function () {
	if ($('.scroll').length) {
		$('.scroll').niceScroll({
			cursorcolor: "#E0E0E9",
			cursorwidth: "5px",
			cursorborder: "none"
		});
	}

	if ($('.content-scroll').length) {
		$('.content-scroll').niceScroll({
			cursorcolor: "#E0E0E9",
			cursorwidth: "6px",
			cursorborder: "none",
			background: "#fff",
			autohidemode: 'leave',
			autohidemode: false
		});
	}
}

db.calendar = function () {
	$('.date').click(function () {
		$('.date').datepicker({
			orientation: "bottom",
			autoclose: true
		});
	});

	$('.dropdown-toggle').dropdown();
}

db.preLoad();
db.menuResponsive();
db.niceScroll();
