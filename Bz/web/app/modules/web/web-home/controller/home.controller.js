const fs = require("fs");
const querystring = require('querystring');
const mongoose = require('mongoose');
const async = require('async');

const Category = mongoose.model('Category');
const Product = mongoose.model('Product');
const User = mongoose.model('User');

module.exports = {
	home,
	payment
}

function payment(request, reply) {  /*  THE CO-ROUTINE  */
	let Payment = request.server.plugins['api-order'].Payment;

	var data = {
		//Địa chỉ trỏ vào file DR để nhận kết quả trả về.
		'vpc_ReturnURL': 'http://localhost:9006/payment',
		/*Mã giao dịch, biến số này yêu cầu là duy nhất mỗi lần gửi sang OnePay*/
		'vpc_MerchTxnRef': Date.now() + String(getRandomIntInclusive(50, 100000)),
		/*Thông tin đơn hàng thường mã đơn hàng hoặc mô tả ngăn gon về đơn hàng*/
		'vpc_OrderInfo': 'JSECURETEST01',
		/*Khoản tiền thanh toán, giá trị chuyền vào không có dấu 
		Cổng thanh toán lấy hai ký tự cuối cùng là phần thập phân, nhân với 100 trước khi chuyển sang cổng thanh toán
		100000000 = 1triệu*/
		'vpc_Amount': '100000000',
		//Loại tiền thanh toán, mặc định là VND
		'vpc_Currency': 'VND',
	};

	var data1 = {
		//Địa chỉ trỏ vào file DR để nhận kết quả trả về.
		'vpc_ReturnURL': 'http://localhost:9006/payment',
		/*Mã giao dịch, biến số này yêu cầu là duy nhất mỗi lần gửi sang OnePay*/
		'vpc_MerchTxnRef': Date.now() + String(getRandomIntInclusive(50, 100000)),
		/*Thông tin đơn hàng thường mã đơn hàng hoặc mô tả ngăn gon về đơn hàng*/
		'vpc_OrderInfo': 'JSECURETEST01',
		/*Khoản tiền thanh toán, giá trị chuyền vào không có dấu 
		Cổng thanh toán lấy hai ký tự cuối cùng là phần thập phân, nhân với 100 trước khi chuyển sang cổng thanh toán
		100000000 = 1triệu*/
		'vpc_Amount': '100000000',
	};

	var extend = {
		'AgainLink': 'http://localhost:9006/payment'
	}

	/*Nội địa*/
	var vpcURL = Payment.onlinePayment('domestic', data);

	/*Online*/
	var vpcOnlineURL = Payment.onlinePayment('internal', data1, extend);

	var response = request.query;
	var confirm = Payment.confirmHash('domestic', response);

	return reply({ 'url': vpcURL, 'urlOnline': vpcOnlineURL, 'params': request.query, 'confirm': confirm });
}

function home(request, reply) {  /*  THE CO-ROUTINE  */
	let data = require(SAMPLE_DATA_PATH + 'home.json');

	async.parallel({
		listCategory: function (callback) {
			let promise = Category.find({
				status: 1,
			}).lean();

			promise.then(function (categories) {
				let listBrand = [];
				let listModel = [];
				categories.forEach(function (item) {
					if (item.type == 'model') listModel.push(item);
					if (item.type == 'brand') listBrand.push(item)
				});
				callback(null, { listBrand, listModel });
			})
		},
		listProduct: function (callback) {
			let promise = Product.find().limit(4).populate('brand').lean();
			promise.then(function (product) {
				callback(null, product);
			})
		}
	}, function (err, result) {
		return reply.view('web/html/web-home/index', {
			data,
			title: 'BZ CMS | Hapi ' + request.server.version,
			message: 'Welcome to BZ CMS',
			listBrand: result.listCategory.listBrand,
			listModel: result.listCategory.listModel,
			listProduct: result.listProduct
		});
	})

}


/*Util*/

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
