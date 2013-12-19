/*
 * grunt-init-callum
 * https://gruntjs.com/
 *
 * Copyright (c) Callum Macrae 2013
 * Licensed under the MIT license.
 */

exports.description = 'The grunt-init scaffold used by Callum Macrae (callumacrae).';

exports.warnOn = ['*', '.*'];

exports.template = function (grunt, init, done) {
	'use strict';

	init.process({}, [
		init.prompt('name'),
		init.prompt('author_name'),
		init.prompt('author_email')
	], function (err, props) {
		var files = init.filesToCopy(props);
		init.copyAndProcess(files, props);

		done();
	});
};