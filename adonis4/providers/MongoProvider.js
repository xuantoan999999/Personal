'use strict'

const ioc = require('@adonisjs/fold').ioc
const ServiceProvider = require('@adonisjs/fold').ServiceProvider
const mongoose = require('mongoose')
const Glob = require('Glob')
const Path = require('path');
const config = require('./../config/mongo');

class MongoProvider extends ServiceProvider {

    register() {
        mongoose.connect('mongodb://' + config.host + '/' + config.database, {
            useMongoClient: true
        });
        mongoose.Promise = require('bluebird');
        require('mongoose-pagination');
        let models = Glob.sync(process.cwd() + '/app/Models/*.js', {});
        models.forEach((item) => {
            require(Path.resolve(item));
        });

        const managers = this.app.getManagers();
        const MongoSchema = require('./../providers/MongoSchema');
        managers['Adonis/Src/Auth'].extend('MongoSchema', MongoSchema, 'scheme');

        const MongoSerializer = require('./../providers/MongoSerializer')
        ioc.extend('Adonis/Src/Auth', 'MongoSerializer', function (app) {
            return new MongoSerializer()
        }, 'serializer')
    }
}

module.exports = MongoProvider