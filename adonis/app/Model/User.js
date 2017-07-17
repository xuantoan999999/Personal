'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    email: {
        type: String
    }
}, {
        collection: 'user',
    }
);

module.exports = mongoose.model('User', UserSchema);