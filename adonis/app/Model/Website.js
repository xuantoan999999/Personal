'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WebsiteSchema = new Schema({
    name: {
        type: String,
    },
    link_website: {
        type: String,
    },
    creater: {
        type: Schema.ObjectId,
        ref: 'User',
    }
}, {
        timestamps: true,
        collection: 'website',
    }
);

module.exports = mongoose.model('Website', WebsiteSchema);