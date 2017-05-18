const mongoose = require('mongoose');
const Coupon = mongoose.model('Coupon');
require('async-arrays').proto();

/** Update type_apply for old coupon
 * - Nếu coupon có check 2 feild apply_sub_product hoặc apply_product thì type_apply là product
 * - Nếu không type_apply là order
 */
module.exports = function syncTypeApplyCoupon(program) {
    'use strict';

    program
        .command('syncTypeApplyCoupon')
        .description('Update type_apply for old coupon')
        .action(function (command) {
            program.successMessage('Getting coupon...');
            Coupon.find({}).then(function (coupons) {
                program.successMessage('' + coupons.length + ' coupons found!');

                coupons.forEachEmission(function (coupon, index, fnCallback) {
                    if ((coupon.apply_product && coupon.apply_product.is_product) || (coupon.apply_sub_product && coupon.apply_sub_product.is_sub_product)) {
                        coupon.type_apply = 'product';
                    }
                    else {
                        coupon.type_apply = 'order';
                    }

                    const promise = coupon.save();
                    promise.then(function (resp) {
                        program.successMessage('\t -> Updated : \'%s\' %', ((index + 1) / coupons.length) * 100);
                        fnCallback()
                    }).catch(function (err) {
                        program.errorMessage('\t -> Error skiped coupon: ', data.name);
                        fnCallback();
                    })
                },
                    function done(err) {
                        if (err) {
                            program.errorMessage('\t -> Error async \'%s\'', '' + err)
                        }
                        program.successMessage('UPDATE SUCCESSFULLY');
                        process.exit(1);
                    });
            }).catch(function (err) {
                program.errorMessage('Cannot get coupon!', err);
                process.exit(1);
            })
        });
};
