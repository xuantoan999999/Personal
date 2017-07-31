'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AccountSchema = new Schema({
    name: {
        type: String,
    },
    website: {
        type: String,
    },
    list_account: [{
        email: {
            type: String
        },
        user_name: {
            type: String
        },
        password: {
            type: String
        },
        question: {
            type: String
        },
        answer: {
            type: String
        },
        extra: [{
            key: {
                type: String
            },
            value: {
                type: String
            }
        }]
    }],
    creater: {
        type: Schema.ObjectId,
        ref: 'User',
    }
}, {
        timestamps: true,
        collection: 'account',
    }
);

module.exports = mongoose.model('Account', AccountSchema);