'use strict';
const prefixCollection = global.config.web.db.prefixCollection || '';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TagSchema = new Schema({
    name: {
        type: String,
        unique: "Đã tồn tại",
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    type:{
        type: String,
        enum: ['SP', 'CN', 'BL'], // Sản phẩm || Cách nấu || Blog
        default: 'SP'
    },
    type_blog: [{ // Loại tag blog
        type: String,
        enum: ['GB', 'MV', 'TT'], // Góc bếp | Mẹo vặt | Tin tức
        // default: 'GB'
    }]
}, {
    collection: prefixCollection + 'tag',
    timestamps: true,
    toJSON: {
        virtuals: true
    }
});

/******************************************************************
Virtual Populate
*******************************************************************/

// Virtual Product
TagSchema.virtual('proccesing',{
    ref: 'Product',
    localField: '_id',
    foreignField: 'tag_processing.id_tag',
});

// Virtual Product
TagSchema.virtual('product_tag',{
    ref: 'Product',
    localField: '_id',
    foreignField: 'tag_product.id_tag',
});

let Tag = mongoose.model('Tag', TagSchema);

module.exports = Tag;