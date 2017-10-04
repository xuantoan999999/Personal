'use strict'

const mongoose = use('mongoose');
const NE = require('node-exceptions')

const User = mongoose.model('User');

class MongoSerializer {

    constructor() {
        const Hash = use('Hash')
        this.hash = Hash
    }

    static get inject() {
        return ['Adonis/Src/Hash']
    }
}

module.exports = MongoSerializer;