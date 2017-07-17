'use strict'

const Ioc = require('adonis-fold').Ioc
const ServiceProvider = require('adonis-fold').ServiceProvider
const mongoose = require('mongoose')
const Glob = require('Glob')
const Path = require('path');
const config = require('./../config/mongo')

// const Mongorito = require('mongorito')
// const CatLog = require('cat-log')
// const logger = new CatLog('adonis:mongorito')
// const MongoritoScheme = require('../AuthManager/MongoritoScheme')
// const MongoritoSerializer = require('../Serializer/MongoritoSerializer')

// class MongoritoModel extends Mongorito.Model {

//     /**
//      * Required to instructor IoC container to never make an
//      * instance of this class even when `make` is called.
//      * Model instances should be controlled by user.
//      *
//      * @return {Boolean}
//      */
//     static get makePlain() {
//         return true
//     }

// }

class MongoritoProvider extends ServiceProvider {

    * register() {

        // const managers = this.app.getManagers();

        // // Add Mongo auth support
        // managers['Adonis/Src/AuthManager'].extend('MongoritoScheme', MongoritoScheme, 'scheme')
        // // Add Mongo serializer
        // Ioc.extend('Adonis/Src/AuthManager', 'MongoritoSerializer', function (app) {
        //     return new MongoritoSerializer()
        // }, 'serializer')

        // this.app.singleton('Adonis/Addons/MongoritoModel', function (app) {

        //     const Config = app.use('Adonis/Src/Config')
        //     const mongoHost = Config.get('mongo.host')
        //     const mongoPort = Config.get('mongo.port')
        //     const mongoDb = Config.get('mongo.db')
        //     const mongoUser = Config.get('mongo.user', '')
        //     const mongoPass = Config.get('mongo.pass', '')

        //     const connectUri = `${mongoHost}:${mongoPort}/${mongoDb}`
        //     const connectionString = (mongoUser !== '' || mongoPass !== '') ? `${mongoUser}:${mongoPass}@${connectUri}` : connectUri

        //     logger.verbose('connection string %s', connectionString)
        //     Mongorito.connect(connectionString)


        //     return MongoritoModel
        // })

        mongoose.connect('mongodb://' + config.host + '/' + config.database);
        mongoose.Promise = require('bluebird');
        require('mongoose-pagination');
        let models = Glob.sync(process.cwd() + '/app/Model/*.js', {});
        models.forEach((item) => {
            require(Path.resolve(item));
        });

        const managers = this.app.getManagers();
        const MongoSchema = require('./../providers/MongoSchema')
        managers['Adonis/Src/AuthManager'].extend('MongoSchema', MongoSchema, 'scheme')

        const MongoSerializer = require('./../providers/MongoSerializer')
        Ioc.extend('Adonis/Src/AuthManager', 'MongoSerializer', function (app) {
            return new MongoSerializer()
        }, 'serializer')
    }
}

module.exports = MongoritoProvider