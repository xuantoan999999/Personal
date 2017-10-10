'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FacebookSchema = new Schema({
    name: {
        type: String,
    },
    creater: {
        type: Schema.ObjectId,
        ref: 'User',
    }
}, {
        timestamps: true,
        collection: 'facebook',
    }
);

module.exports = mongoose.model('Facebook', FacebookSchema);