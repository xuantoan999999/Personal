'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');
const Boom = require('boom');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const Promise = require("bluebird");
const moment = require("moment");

const Coupon = mongoose.model('Coupon');
const Product = mongoose.model('Product');
const Category = mongoose.model('Category');
const Order = mongoose.model('Order');
const User = mongoose.model('User');
const Config = mongoose.model('Config');
const productUtil = require(BASE_PATH + '/app/modules/api-product/util/product.js');

module.exports = {
    checkCoupon,
    checkFirstOrderOfUser,
    getConfigs,
    mailOrderSuccess,
    updateCoupon,
    listCateOnSaleAffternoon,
};

function mailOrderSuccess(doc, request) {
    // email
    let config = request.server.configManager;
    let context = doc.toObject();
    if (context && context.payment_method == 'COD')
        context.payment_method = "Thanh toán khi giao hàng (COD)";
    if (context && context.payment_method == 'CK')
        context.payment_method = "Thanh toán chuyển khoản";

    if (context && context.shiper == 'SPT')
        context.shiper = "SPT";
    if (context && context.shiper == 'GHN')
        context.shiper = "GHN";
    if (context && context.shiper == 'AHM')
        context.shiper = "Ahamove (AHM)";

    context.xxx = context.total + context.payment_info.info.shipping_fee - context.total_pay;
    context.khuyenmai = String(context.xxx.toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    context.total = String(context.total).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    context.total_pay = String(context.total_pay).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    context.payment_info.info.shipping_fee = String(context.payment_info.info.shipping_fee).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    for (let key in context.order_detail) {
        if (context.order_detail.hasOwnProperty(key)) {
            context.order_detail[key].total = String(context.order_detail[key].total).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }

    let emailData = {
        "from": config.get('web.email.from'),
        "to": { name: context.payment_info.info.full_name, address: context.payment_info.info.email },
        "subject": "Đặt hàng thành công trên hệ thống Mua Hàng Việt, cho đơn hàng # " + context.id_order,
        "html": "Order Success",
        "template": {
            "name": "ordersuccess",
            "context": context
        },
        "text": ""
    };

    if (config.get('web.context.settings.server') == 'live') {
        emailData.bcc = [
            { name: 'Mua Hàng Việt', address: 'support@muahangviet.com.vn' },
            { name: 'Mua Hàng Việt', address: 'cs@chorus.vn' }
        ];
    } else {
        emailData.bcc = [
            { name: 'Mua Hàng Việt', address: 'muahangvietstaging@gmail.com' }
        ];
    }

    let pubsub = request.server.plugins['app-pubsub'].pubsub;
    pubsub.publish('api-sendmail', emailData, function () {
        request.log(['info', 'order'], 'Create order success');
    });
}

function checkCoupon(data) {
    return new Promise(function (resolve, reject) {
        const codeCoupon = data.codeCoupon;
        let ORDER = data.order;
        const userId = data.userId == undefined ? null : data.userId;

        // Nếu order
        let isUpdateModeCheck = false; // Cờ đánh dấu bỏ qua một số điều kiện khi check
        let money_coupon = 0; // tiền khuyến mãi ORDER

        let products = ORDER.order_detail.map(function (item) {
            return item.product;
        });

        let search = async(function () {

            // Search list product
            if (!codeCoupon) {
                return { success: true };
            }
            let productList = await(Product.find({
                _id: {
                    $in: products
                }
            }).populate({
                path: 'category_list',
            }).populate(productUtil.popuIdPromo()).lean());

            // Find coupon
            let coupon = await(Coupon.findOne({
                $and: [
                    { status: "active", },
                    {
                        $or: [
                            { code: codeCoupon },
                            { 'code_group.code': codeCoupon }
                        ]
                    }
                ]
            }).populate('apply_district.district').lean());

            if (!coupon) {
                return reject(Boom.badRequest('Not found'));
            }

            // Get coupon when coupon's type is group 
            if (coupon.type == 'group') {
                let tmp_coupon = (JSON.parse(JSON.stringify(coupon)));
                let coupon_group = tmp_coupon.code_group.find(function (coupon) {
                    return coupon.code == codeCoupon;
                });
                // console.log(codeCoupon, coupon_group);
                if (coupon_group) {
                    coupon = _.extend(tmp_coupon, coupon_group);
                }
                else {
                    return reject(Boom.badRequest('Not found'));
                }
            }

            // Start: check coupon
            // Check coupon between in start date and end date
            let internal = coupon.internal;
            if (internal.is_internal) {
                let time_present = moment(ORDER.createdAt);
                let startDate = moment(internal.start_date);
                let endDate = moment(internal.end_date);
                if (!(startDate <= time_present && time_present <= endDate)) {
                    return reject(Boom.badRequest('Internal'));
                }
            }


            //set flag check coupon
            let orderExitsInDB = await(Order.findOne({
                _id: ORDER._id
            }).lean());

            if (orderExitsInDB)
                isUpdateModeCheck = true;


            // Check in category
            let product = coupon.apply_product;
            //Danh sach category trong order dua len
            let listCategoryInOrder = [];
            productList.forEach(function (item, index) {
                item.category_list.forEach(function (category) {
                    listCategoryInOrder.push('' + category._id);
                })
            })

            //      Danh sách các category được apply trong coupon
            let listIdCategoryApply = product.products.join(',').split(','); // khởi tạo array string id

            if (product.is_product) {
                // if (!isUpdateModeCheck) { //  Update order thi không quan tâm cate active hay unactive và ngược lại
                //     let listIdCategoryApplyTmp = await(Category.find({
                //         _id: {
                //             $in: listIdCategoryApply
                //         },
                //         status: true
                //     }, '_id').lean());
                //     listIdCategoryApply = listIdCategoryApplyTmp.map(item => {
                //         return ('' + item._id)
                //     });
                // }

                // đệ quy lấy tất cả các category con
                let getAllCategoryApply = function (index, callback) {
                    if (index == listIdCategoryApply.length)
                        callback(listIdCategoryApply);
                    else {
                        let condition = {
                            parrent_id: listIdCategoryApply[index]
                        }
                        // if (!isUpdateModeCheck) {
                        //     condition.status = true;
                        // }

                        let listSubCategory = await(Category.find(condition));

                        listSubCategory.forEach(function (item, i) {
                            listIdCategoryApply.push('' + item._id);
                        })
                        if (listSubCategory) {
                            getAllCategoryApply(index + 1, callback);
                        }
                        else {
                            console.log('Error with await: ', listSubCategory);
                            return callback(listSubCategory);
                        }
                    }
                }
                let checkExittCateApply = function (listIdCategoryApplyResult) {
                    if (_.intersection(listIdCategoryApplyResult, listCategoryInOrder).length === 0) {
                        return reject(Boom.badRequest(
                            'Category'
                        ));
                    }
                }
                getAllCategoryApply(0, checkExittCateApply)
            }

            // Check in district
            let district = coupon.apply_district;
            if (district.is_district) {
                let checkDistrict = district.district.find(function (item) {
                    return ('' + ORDER.id_shipping_fee) == (item._id + '');
                });
                if (!checkDistrict) {
                    return reject(Boom.badRequest('District'));
                }
            }


            // Check order total
            // Nếu sau khi khuyên mãi tiên order âm thì k cho áp dụng
            let total_No_Onsale = 0; // tổng tiền các sản phầm trừ các sản phẩm có onsale
            ORDER.order_detail.forEach(function (item, index) {
                if (item.id_promote == null || item.id_promote.id == null) {
                    total_No_Onsale += item.total;
                }
            })

            // 
            let orderCheck = coupon.apply_order;
            if (orderCheck.is_order) {
                if (total_No_Onsale < orderCheck.money) {
                    return reject(Boom.badRequest('Total'));
                }
            }

            // Check require login
            if (!userId || userId == '') {
                return reject(Boom.badRequest('Must be login'));
            }



            // check so lan su dung
            let checkTimes = function () {
                let order_count = await(Order.count({ id_coupon: coupon._id, status: { $ne: 'CANCEL' }, 'payment_info.info.user_id': userId }));
                if (order_count >= coupon.user_times) {
                    return { success: false, err: 'Limit' };
                }
                if (coupon.times <= 0) {
                    return { success: false, err: 'Count' };
                }
                return { success: true };
            }

            let check = checkTimes();

            if (!isUpdateModeCheck) {
                let check = checkTimes();
                if (!check.success) {
                    return reject(Boom.badRequest(check.err));
                }
            }
            // check lại đối với trường hợp isUpdateMode
            // Khi order cũ thay đổi coupon => check Count & Limit khi order thay đổi coupon
            else {
                let orderUpdate = await(Order.findById(ORDER._id).lean());

                if (orderUpdate.coupon.code !== codeCoupon) {
                    let check = checkTimes();
                    if (!check.success) {
                        return reject(Boom.badRequest(check.err));
                    }
                }
            }



            // Check order total
            // Nếu sau khi khuyên mãi tiên order âm thì k cho áp dụng

            // TÍNH TIỀN KHUYẾN MÃI LẦN 1: LOẠI BỎ CÁC SẢN PHẨM CÓ ONSALE (feild: id_promotion != null)
            money_coupon = 0;
            if (coupon.type_apply == 'order') { // Apply trên tổng order
                // let total_tmp = 0; // tổng tiền các sản phầm trừ các sản phẩm có onsale
                // ORDER.order_detail.forEach(function (item, index) {
                //     if (item.id_promote == null || item.id_promote.id == null) {
                //         total_tmp += item.total;
                //     }
                // })

                // if (coupon.sale.is_money) {
                //     money_coupon = coupon.sale.money_value;
                // }
                // if (coupon.sale.is_percent) {
                //     money_coupon = (coupon.sale.percent_value / 100) * total_tmp;
                // }

                if (coupon.sale.is_money) {
                    if (total_No_Onsale < coupon.sale.money_value)
                        money_coupon = total_No_Onsale;
                    else
                        money_coupon = coupon.sale.money_value;
                }
                if (coupon.sale.is_percent)
                    money_coupon = (coupon.sale.percent_value / 100) * total_No_Onsale;

            }
            else { // Apply trên từng sản phẩm
                ORDER.order_detail.forEach(function (item, index) {
                    if (item.id_promote == null || item.id_promote.id == null) {
                        if (coupon.sale.is_money) {
                            // Tổng tiền mặt hàng order lớn hơn giá trị khuyến mãi của order
                            if (item.total > coupon.sale.money_value)
                                money_coupon += coupon.sale.money_value;
                            else { // Tổng tiền mặt hàng order nhỏ hơn giá trị khuyến mãi của order
                                money_coupon += item.total;
                            }
                        }
                        if (coupon.sale.is_percent) {
                            money_coupon += (coupon.sale.percent_value / 100) * item.total;
                        }
                    }
                })

            }


            // TÍNH TIỀN KHUYẾN MÃI LẦN 2: LOẠI BỎ CÁC SẢN PHẨM BỊ EXCEPTION TRONG COUPON VÀ CÁC SẢN PHẨM ĐÃ CÓ ONSALE

            // Check không apply cho sản phẩm nào
            let apply_sub_product = coupon.apply_sub_product;
            // fix coupon single cũ k có feild apply_sub_product
            if (apply_sub_product) {
                let is_sub_product = apply_sub_product.is_sub_product;
                let lsProductNotApply = [];
                if (apply_sub_product.is_sub_product) {
                    lsProductNotApply = apply_sub_product.products;
                    //convert to array string
                    lsProductNotApply = lsProductNotApply.join('/').split('/');
                    let listIDProduct = [];
                    let array_id_delete = []; // list product không được apply trong đơn hàng. sẽ bị delete tạm thời ra khỏi ds để check
                    for (var index = 0; index < productList.length; index++) {
                        listIDProduct.push('' + productList[index]._id);
                        let tmp = [('' + productList[index]._id)]; // id product type array
                        if (_.intersection(tmp, lsProductNotApply).length > 0) {
                            productList.splice(index, 1); // Loại bỏ các sản phẩm bị EXCEPTION ra khỏi list
                            index--;
                        }
                    }


                    if (productList.length == 0) { // Tất cả các sản phẩm trong order bị exception
                        return reject(Boom.badRequest('No product apply'));
                    }

                    // RESET MONEY
                    let total_tmp = 0; // tổng tiền order các sản phẩm KHÔNG ONSALE và KHÔNG EXCEPTION
                    money_coupon = 0;
                    // Tính lại tiền khuyến mãi
                    productList.forEach(function (item, index) {
                        let detailOrderProduct;
                        if (typeof JSON.parse(JSON.stringify(ORDER.order_detail[0].product)) === 'object') {
                            detailOrderProduct = ORDER.order_detail.find(function (detail) {
                                // lấy detail sản phẩm cùng id
                                return ('' + item._id) == ('' + detail.product._id);
                            });
                        }
                        else {
                            detailOrderProduct = ORDER.order_detail.find(function (detail) {
                                // lấy detail sản phẩm cùng id
                                return ('' + item._id) == ('' + detail.product);
                            })
                        }
                        if (detailOrderProduct.id_promote == null || detailOrderProduct.id_promote.id == null) {
                            if (coupon.type_apply == 'product') { // Apply trên từng sản phẩm
                                if (coupon.sale.is_money) {
                                    // CASE 1: tiền khuyến mãi lớn hơn tiền order mặt hàng(sản phẩm * số lượng)
                                    if (coupon.sale.money_value >= detailOrderProduct.total) {
                                        money_coupon += detailOrderProduct.total;
                                    }
                                    else { //CASE 2: tiền khuyến mãi nhỏ hơn tiền mặt hàng đặt
                                        money_coupon += coupon.sale.money_value;
                                    }
                                }
                                if (coupon.sale.is_percent) {
                                    money_coupon += (coupon.sale.percent_value / 100) * detailOrderProduct.total;
                                }
                            }
                            // Tính tổng tiền các sản phẩm đủ điều kiện
                            total_tmp += detailOrderProduct.total;
                        }
                    });

                    // Tính lại tiền đối với trường hợp apply trên tổng order
                    if (coupon.type_apply == 'order') {
                        if (coupon.sale.is_money) {
                            if (coupon.sale.money_value > total_tmp) // trường hợp tổng order nhỏ hơn giá trị coupon
                                money_coupon = total_tmp;
                            else
                                money_coupon = coupon.sale.money_value;
                        }
                        if (coupon.sale.is_percent) {
                            money_coupon = (coupon.sale.percent_value / 100) * total_tmp;
                        }

                    }
                    // tổng tiền sau khi trừ product exctiopn nhỏ hơn value coupon
                    if (orderCheck.is_order) {
                        if (total_tmp < orderCheck.money) {
                            return reject(Boom.badRequest('Total'));
                        }
                    }
                }
            }

            // TÍNH TIỀN KHUYẾN MÃI LẦN 3: LOẠI BỎ CÁC SẢN PHẨM BỊ EXCEPTION TRONG COUPON, CÁC SẢN PHẨM ĐÃ CÓ ONSALE VÀ CÁC SẢN PHẨM KHÔNG THUỘC CATEGORY ĐƯỢC ÁP DỤNG

            // Tính tiền khuyến mãi trong trường hợp áp dụng cho danh mục sản phẩm
            if (product.is_product) {
                let total_tmp = 0;// tổng tiền order các sản phẩm KHÔNG ONSALE, KHÔNG EXCEPTION và THUỘC CATEGORY ĐƯỢC APPLY
                money_coupon = 0; //reset money
                // tính lại 
                // productList lúc này đã loại bỏ các sản phẩm bị EXCEPTION
                productList.forEach(function (item, index) {
                    let listCategoryProduct = [];
                    item.category.map(function (item) {
                        listCategoryProduct.push('' + item);
                    });
                    if ((_.intersection(listCategoryProduct, listIdCategoryApply).length != 0) && item.id_promotion == null) {
                        let detailOrderProduct;
                        if (typeof JSON.parse(JSON.stringify(ORDER.order_detail[0].product)) === 'object') {
                            detailOrderProduct = ORDER.order_detail.find(function (detail) {
                                // lấy detail sản phẩm cùng id
                                return ('' + item._id) == ('' + detail.product._id);
                            });
                        }
                        else {
                            detailOrderProduct = ORDER.order_detail.find(function (detail) {
                                // lấy detail sản phẩm cùng id
                                return ('' + item._id) == ('' + detail.product);
                            })
                        }
                        if (detailOrderProduct.id_promote == null || detailOrderProduct.id_promote.id == null) {
                            if (coupon.type_apply == 'product') { // Apply trên từng sản phẩm
                                if (coupon.sale.is_money) {
                                    // CASE 1: tiền khuyến mãi lớn hơn tiền order mặt hàng(sản phẩm * số lượng)
                                    if (coupon.sale.money_value >= detailOrderProduct.total) {
                                        money_coupon += detailOrderProduct.total;
                                    }
                                    else { //CASE 2: tiền khuyến mãi nhỏ hơn tiền mặt hàng đặt
                                        money_coupon += coupon.sale.money_value;
                                    }
                                }
                                if (coupon.sale.is_percent) {
                                    money_coupon += (coupon.sale.percent_value / 100) * detailOrderProduct.total;
                                }
                            }
                            // Tổng tiền sản phẩm k onsale, không bị excep, thuộc cate apply
                            total_tmp += detailOrderProduct.total;
                        }
                    }
                });

                // Tính lại tiền đối với trường hợp apply trên tổng order
                if (coupon.type_apply == 'order') {
                    if (coupon.sale.is_money) {
                        if (coupon.sale.money_value > total_tmp) // trường hợp tổng order nhỏ hơn giá trị coupon
                            money_coupon = total_tmp;
                        else
                            money_coupon = coupon.sale.money_value;
                    }
                    if (coupon.sale.is_percent) {
                        money_coupon = (coupon.sale.percent_value / 100) * total_tmp;
                    }
                }
                // tổng tiền sau khi trừ product exctiopn nhỏ hơn value coupon
                if (orderCheck.is_order) {
                    if (total_tmp < orderCheck.money) {
                        return reject(Boom.badRequest('Total'));
                    }
                }
            }

            // END CHECK CONDITION COUPON

            if (money_coupon == 0) {
                return reject(Boom.badRequest('Money coupon equal 0'));
            }

            if (ORDER.total - money_coupon < 0) {
                return reject(Boom.badRequest('Total'));
            }

            return { coupon: coupon, money_coupon: money_coupon };
        })

        // Call async function
        return search().then(function (resp) {
            return resolve(resp);
        })
    });
}


function checkFirstOrderOfUser(userId = null) {

    return new Promise(function (resolve, reject) {
        if (!userId) {
            return reject(new Error('Parameter does not match'));
        }
        return User.findById(userId, function (err, user) {
            if (err || !user) {
                return reject(new Error('Query Error Or User does not exits!'));
            }

            return Order.findOne({
                'payment_info.info.user_id': userId,
                status: {
                    $ne: 'CANCEL'
                }
            }).sort({ createdAt: 1 }).exec(
                function (er, order) {
                    if (er) {
                        return reject(new Error('Error occur on get list order. Try again!'
                        ));
                    }
                    if (order)
                        return reject(new Error('' + order._id));

                    return resolve({
                        success: true,
                        message: 'This is first order for user: ' + user.name,
                    });
                })
        })
    });


}


function getConfigs() {
    return new Promise(function (resolve, reject) {
        // set default value
        let data = {
            ProductBalance: 3,
            FreeShipConfig: {
                Urban: {
                    value: 999999999,
                    status: false,
                    description: '',
                    type: 'MN'
                },
                Suburb: {
                    value: 999999999,
                    status: false,
                    description: '',
                    type: 'MN'
                }
            },
            OrderDeleveryOnAffernoon: {
                value: 0,
                status: false,
                description: '',
                type: 'PC'
            },
            FirstOrder: {
                value: 0,
                status: false,
                description: '',
                type: 'PC'
            }
        };

        Config.find({}, function (err, listConf) {
            if (err) return resolve(data);
            listConf.forEach(function (cf, i) {
                cf = cf.toObject();
                if (cf.name == 'onSale_order_DT' && cf.status) // đon hàng đầu tiên
                    data.FirstOrder = cf;
                if (cf.name == 'onSale_order_NT' && cf.status) // nội thành
                    data.FreeShipConfig.Urban = cf;
                if (cf.name == 'onSale_order_NGT' && cf.status) // ngoại thành
                    data.FreeShipConfig.Suburb = cf;
                if (cf.name == 'onSale_order_BC' && cf.status) // giao hàng buổi chiều
                    data.OrderDeleveryOnAffernoon = cf;
            });
            return listCateOnSaleAffternoon().then(function (resp) {
                data.OrderDeleveryOnAffernoon.listCateApply = resp.listCateApply;
                data.OrderDeleveryOnAffernoon.listCateException = resp.listCateException;
                return resolve(data);
            }).catch(function (err) {
                data.OrderDeleveryOnAffernoon.listCateApply = [];
                return resolve(data);
            })
        }).catch(function (err) {
            return resolve(data);
        });
    })
}


function updateCoupon(codeCoupon, num) {
    return new Promise(function (resolve, reject) {
        let findCoupon = Coupon.findOne({
            $and: [
                { status: "active", },
                {
                    $or: [
                        { code: codeCoupon },
                        { 'code_group.code': codeCoupon }
                    ]
                }
            ]
        });

        findCoupon.then(function (coupon) {
            if (coupon) {
                if (coupon.type == 'single') {
                    coupon.times += num;
                }
                if (coupon.type == 'group') {
                    let find_code_group = coupon.code_group.find(function (item) {
                        if (item.code == codeCoupon) {
                            item.times += num;
                        }
                        return item.code == codeCoupon;
                    });
                }
                let update_coupon = coupon.save();
                update_coupon.then(function (resp) {
                    return resolve({ success: true, data: resp });
                }).catch(function (err) {
                    return reject({ success: false, err: err });
                });
            }
            else {
                return resolve({ success: true });
            }
        }).catch(function (err) {
            return reject({ success: false, err: err });
        });
    })
}

function listCateOnSaleAffternoon() {
    return new Promise(function (resolve, reject) {

        let listCateApply = [];
        let listCateException = [];

        const condition = {
            $or: [
                {
                    slug: 'trai-cay',
                }, {
                    slug: 'rau-cu',
                }
            ]
        };
        const cate_exception = ['combo-rau-cu'];

        return Category.find(condition, '_id name slug').lean().then(function (rootCate) {
            listCateApply = rootCate.map(function (item) {
                return ('' + item._id);
            });
            let getSubCate = function (index, callback) {
                if (index == listCateApply.length)
                    callback(listCateApply);
                else {
                    return Category.find({ parrent_id: listCateApply[index] }, '_id name slug').lean().then(function (cate) {
                        cate.forEach(function (item, i) {
                            if (cate_exception.indexOf(item.slug) == -1) {
                                listCateApply.push('' + item._id);
                            }
                            else {
                                listCateException.push('' + item._id);
                            }
                        })
                        return getSubCate(index + 1, callback);
                    }).catch(function (err) {
                        return getAllCategoryApply(index + 1, callback);
                    })
                }
            }

            return getSubCate(0, function (listRoot) {
                return resolve({
                    listCateApply,
                    listCateException
                });
            })

        }).catch(function (err) {
            reject(err)
        })
    })
}