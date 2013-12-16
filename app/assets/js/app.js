if (typeof DEBUG === 'undefined') {
	DEBUG = true;
}

require(['jquery'], function ($) {
	'use strict';

	var clicks = 0;

	$('button').click(function () {
		$('.clicked').text(++clicks);

		if (DEBUG) {
			console.log(clicks);
		}
	});
});