'use strict';

/**
 * Get unique error field name
 */
var getUniqueErrorMessage = function (err) {
	var output;

	try {
		var errmsg = err.errmsg;
		let feild = errmsg.substring(errmsg.indexOf('index: ') + 7, errmsg.indexOf('_1'));
		let value = errmsg.substring(errmsg.indexOf('{ : ') + 4, errmsg.lastIndexOf(' }'));
		output = feild + ' : ' + value + ' đã tồn tại';
		// var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
		// output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';

	} catch (ex) {
		output = 'Dữ liệu bị trùng';
	}

	return output;
};

/**
 * Get the error message from error object
 */
exports.getErrorMessage = function (err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = getUniqueErrorMessage(err);
				break;
			default:
				message = 'Something went wrong';
		}
	}
	else if (err.message && !err.errors) {
		message = err.message;
	}
	else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) {
				message = err.errors[errName].message;
			}
		}
	}

	return message;
};
