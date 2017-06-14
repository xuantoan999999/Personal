'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const regexp = require(BASE_PATH + '/app/utils/regexp');
const _ = require('lodash');

module.exports = {
	getById,
	getUserByEmail,
	getRowsSelect,
	getOptions,
}
/**
 * Middleware
 */
 function getById(request, reply) {
 	const id = request.params.id || request.payload.id;
 	let promise = User.findOne({ '_id': id });
 	promise
 	.then(function (user) {
 		return reply(user);
 	})
 	.catch(function (err) {
 		request.log(['error'], err);
 		return reply.continue();
 	})
 }

 function getUserByEmail(request, reply) {

 	const email = request.payload.email;
 	User.findOne({ email: email }, function (err, user) {
 		if (err) {
 			request.log(['error'], err);
 		}
 		return reply(user);
 	});
 }

 function getRowsSelect(request, reply) {
 	let rowsSelected = request.payload.rowsSelected;

 	var filter_ids = [];
 	_.map(rowsSelected, function (key, value) {
 		if (key) {
 			filter_ids.push(value);
 		}
 	});

 	reply(filter_ids);
 }

 function getOptions(request, reply) {
 	let options = {
 		status: {
 			$ne: 2
 		}
 	};
 	let {
 		_idNot,
 		status,
 		keyword,
 		role
 	} = request.payload || request.query;

 	let tmpKeyword = regexp.RegExp("", 'i');
 	let idKeyword = null;
 	if (keyword &&
 		keyword.length > 0) {

 		options.$or = [{
 			email: regexp.RegExp(keyword, 'i')
 		},
 		{
 			name: regexp.RegExp(keyword, 'i')
 		}, {
 			phone: regexp.RegExp(keyword, 'i')
 		}
 		];

 		if (mongoose.Types.ObjectId.isValid(keyword)) {
 			options.$or.push({
 				_id: keyword
 			});
 		}
 	}

 	if (status) {
 		options.status = status;
 	}

 	if (role) {
 		options.roles = role;
 	}

 	if(_idNot)
 		options._id = { $nin: _idNot }

 	return reply(options);
 }