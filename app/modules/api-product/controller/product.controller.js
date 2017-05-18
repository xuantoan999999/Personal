'use strict';

const Boom = require('boom');
const Joi = require('joi');
const Bluebird = require('bluebird');
const sanitizeHtml = require('sanitize-html');

const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const productWebController = require('./../../web-product/controller/product.controller.js');

module.exports = {
	getAll,
};

function getAll (request, reply) {
	try{
		let config = request.server.configManager;
		let category = request.pre.getCategory;
		if(!category)
			return reply({ status: false, msg: 'Not category'});

		let select = '_id slug name meta_description price thumb images';
		productWebController.asyncFuncProduct({}, category, [], select).then(function (docs) {
			formatData(request, docs).then(function(resp){
				let start = "<?xml version=\"1.0\"?>"
				+"<rss xmlns:g=\"http://base.google.com/ns/1.0\" version=\"2.0\">"
				+"<channel>"
				+"<title>Mua Hàng Việt</title>"
				+"<link>https://www.muahangviet.com.vn</link>"
				+"<description>"+config.get('web.context.app.description')+"</description>";

				let end = '</channel>'
				+'</rss>';

				return reply(start+resp+end).type('application/xml');

			},function(err){
				return reply({ status: false, msg: err});
			});
		});

	}catch(e){
		return reply({ status: false, msg: e});
	}
}

/*MIDDLEWARE*/
function formatData(request, products){
	let config = request.server.configManager;
	let Url = request.info.host;
	let pathImage = '';

	return new Bluebird(function(resolve, reject){
		try{
			let items = '';
			for (let key in products) {
				if (products.hasOwnProperty(key)) {
					let desc = products[key].meta_description||config.get('web.context.app.description');
					let status = (products[key].status == 'HSV') ? 'out of stock' : 'in stock';
					let image = '';
					if(products[key].images){
						image = products[key].images[0].url;
						pathImage = config.get('web.upload.productImgPath');
					}else{
						image = products[key].thumb;
						pathImage = config.get('web.upload.thumbImgPathProduct');
					}

					let item = "<item>";
					item += "<g:id>"+products[key]._id+"</g:id>";
					item += "<g:title>"+products[key].name+"</g:title>";
					item += "<g:description>"+desc+"</g:description>";
					item += "<g:link>"+'http://'+Url + '/san-pham/' + products[key].slug + '-' + products[key]._id+"</g:link>";
					item += "<g:image_link>"+'http://'+Url + pathImage.replace('/public','') + image+"</g:image_link>";
					item += "<g:brand>"+'Mua Hàng Việt'+"</g:brand>";
					item += "<g:availability>"+status+"</g:availability>";
					item += "<g:price>"+products[key].price+" VND</g:price>";
					item += "<g:condition>new</g:condition>";
					item += "<g:google_product_category>Animals &gt; Pet Supplies</g:google_product_category>";
					item += "</item>";

					items+=item;
				}
			}
			return resolve(items);
		}catch(e){
			request.log(['error'],e);
			return reject(e);
		}
	});
}