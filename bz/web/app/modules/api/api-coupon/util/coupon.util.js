const async = require('asyncawait/async');
const await = require('asyncawait/await');
const Promise = require('bluebird');

const _ = require('lodash');
const moment = require("moment");

const mongoose = require('mongoose');
const Coupon = mongoose.model('Coupon');
const Order = mongoose.model('Order');

class CouponUtil {
    constructor(code, order, options) {
        this.Code = code ? code : '';
        this.Order = order ? order : null;
        this.Options = options ? options : {};
    }

    /**
     * fn checkCoupon
     * Return Promise
     * response format: {boolean success, string message, object data}
     */
    checkCoupon() {
        return new Promise((resolve, reject) => {
            let data = {
                success: false,
                message: '',
                data: null
            }

            let check = async(function (Code, order, Options) {
                ///////// CHECK DATA INPUT /////////
                if (Code === '') {
                    data.message = 'Không có mã giảm giá';
                    return data;
                }

                if (!order) {
                    data.message = 'Đơn hàng không hợp lệ';
                    return data;
                }
                let coupon = await(Coupon.findOne({
                    code: Code,
                    status: 1
                }).populate('apply_product.product_obj'));

                if (!coupon) {
                    data.message = 'Không tồn tại mã giảm giá';
                    return data;
                }
                else {
                    data.data = {
                        coupon: coupon
                    }
                }

                ///////// CHECK CONDITIONS /////////

                /* Check time apply */
                if (coupon.apply_time && coupon.apply_time.is_apply_time) {
                    let time_present;
                    if (order.createAt) {
                        time_present = moment(order.createdAt);
                    }
                    else {
                        time_present = moment();
                    }
                    let startDate = moment(coupon.apply_time.start_date);
                    let endDate = moment(coupon.apply_time.end_date);
                    if (!(startDate <= time_present && time_present <= endDate)) {
                        data.message = 'Thời gian khuyến mãi không hợp lệ';
                        return data;
                    }
                }
                /* Check times used */
                let orders = await(Order.find({
                    'coupon.id': coupon._id
                }, '_id'));

                if (orders && orders.length >= coupon.times) {
                    data.message = 'Khuyến mãi hết số lần sử dụng';
                    return data;
                }

                /* Check apply limit product */
                if (coupon.apply_product && coupon.apply_product.is_apply_product) {
                    // Get products apply from coupon
                    let productsApply = coupon.apply_product.products.map(item => {
                        return ('' + item);
                    });
                    // Get product from order
                    let productsOrder = order.products.map(item => {
                        return ('' + item);
                    });

                    if (_.intersection(productsApply, productsOrder).length == 0) {
                        data.message = 'Sản phẩm không được khuyến mãi';
                        return data;
                    }
                }

                ///////// END CHECK /////////
                data.success = true;
                /* Caculating money coupon */
                let money_coupon = 0;
                if (coupon.type_coupon == 'PC') {
                    money_coupon = (coupon.value / 100) * order.total;
                }
                else {
                    money_coupon = order.total > coupon.value ? coupon.value : order.total;
                }
                data.data.money_coupon = money_coupon;

                return data;
            });

            check(this.Code, this.Order, this.Options).then(resp => {
                if (resp.success)
                    this.getMoneyCoupon = resp.data.money_coupon;
                return resolve(resp);
            });
        });
    }
}

module.exports = CouponUtil;
