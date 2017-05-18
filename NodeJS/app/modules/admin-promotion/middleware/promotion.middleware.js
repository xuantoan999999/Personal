const mongoose = require('mongoose');
const Promotion = mongoose.model('Promotion');
const Product = mongoose.model('Product');

module.exports = {
    getAllPromotion,
    getPromotionById,
    getListProduct
}

function getAllPromotion(request, reply) {
    let opt = {};
    let id = request.params.id;

    if (id) {
        opt._id = {
            $ne: id
        };
    }

    let promise = Promotion.find(opt).select('_id name');
    promise.then(function (resp) {
        return reply(resp);
    })
}

function getPromotionById(type) {
    return function (request, reply) {
        if (type == 'payload') var id = request.payload.data._id;
        if (type == 'params') var id = request.params.id;

        let promise = Promotion.findById(id).populate('product');
        promise.then(function (resp) {
            return reply(resp);
        });
    }
}

function getListProduct(option) {
    return function (request, reply) {
        let list_promote = Promotion.find().select('name').lean();
        list_promote.then(function (resp) {
            let nin = resp.map(function (item) {
                return item._id
            });
            let opt = {};
            if (option == 'add') {
                opt = {
                    $or: [
                        { id_promotion: null },
                        { id_promotion: { $nin: nin } }
                    ]
                };
            }
            if (option == 'edit') {
                opt = {
                    $or: [
                        { id_promotion: null },
                        { id_promotion: { $nin: nin } },
                        { id_promotion: request.params.id }
                    ]
                }
            }
            let promise = Product.find(opt).select({ _id: 1, name: 1 }).lean();
            promise.then(function (resp) {
                return reply(resp);
            });
        })
    }
}