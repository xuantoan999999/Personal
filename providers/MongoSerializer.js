'use strict'

const mongoose = use('mongoose');
const NE = require('node-exceptions')
const { ioc } = require('@adonisjs/fold')

const User = mongoose.model('User');

class MongoSerializer {

    constructor(Hash) {
        this.Hash = Hash;
        this._config = null;
        this._Model = null;
        this._queryCallback = null;
    }

    /* istanbul ignore next */
    /**
     * Dependencies to be injected by Ioc container
     *
     * @attribute inject
     *
     * @return {Array}
     */
    static get inject() {
        return ['Adonis/Src/Hash']
    }

    /**
     * Setup config on the serializer instance. It
     * is import and needs to be done as the
     * first step before using the serializer.
     *
     * @method setConfig
     *
     * @param  {Object}  config
     */
    setConfig(config) {
        this._config = config
        this._Model = ioc.make(this._config.model)
    }
}

module.exports = MongoSerializer;