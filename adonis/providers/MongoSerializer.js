'use strict'

const mongoose = use('mongoose');
const User = mongoose.model('User');

class MongoSerializer {

    constructor() {
        const Hash = use('Hash')
        this.hash = Hash
    }

    static get inject() {
        return ['Adonis/Src/Hash']
    }


    primaryKey(authenticatorOptions) {
        var obj = { primaryKey: '_id' }
        return obj.primaryKey
    }

    // _getModel(model) {
    //     return typeof (model) === 'string' ? Ioc.use(model) : model
    // }

    // _decorateQuery(query, options) {
    //     if (options.query) {
    //         query.andWhere(options.query)
    //     }
    // }

    * findById(id, options) {
        // const model = this._getModel(options.model)
        // return yield model.find(id)
        return yield User.findById(id).lean();
    }

    // * findByCredentials(email, options) {
    //     const model = this._getModel(options.model)
    //     const query = model.where(options.uid, email)
    //     this._decorateQuery(query, options)
    //     const row = yield query.find()
    //     return row.length > 0 ? row[0] : null
    // }

    // * findByToken(token, options) {
    //     const model = this._getModel(options.model)
    //     const query = model.query().where('token', token).andWhere('is_revoked', false)
    //     this._decorateQuery(query, options)
    //     return yield query.with('user').first()
    // }

    // * getUserForToken(token) {
    //     return token.get('user')
    // }

    // _getTokenExpiryDate(expiry) {
    //     return new Date(Date.now() + expiry)
    // }


    // * saveToken(user, token, options, expiry) {
    //     const tokenObject = {
    //         token: token,
    //         forever: !expiry,
    //         expiry: expiry ? this._getTokenExpiryDate(expiry) : null,
    //         is_revoked: false
    //     }
    //     const Token = this._getModel(options.model)
    //     const tokenInstance = new Token(tokenObject)
    //     const isSaved = yield user.apiTokens().save(tokenInstance)
    //     return isSaved ? tokenInstance : null
    // }

    // * revokeTokens(user, tokens, reverse) {
    //     const userTokens = user.apiTokens()
    //     if (tokens) {
    //         const method = reverse ? 'whereNotIn' : 'whereIn'
    //         userTokens[method]('token', tokens)
    //     }
    //     return yield userTokens.update({ 'is_revoked': true })
    // }

    // * validateToken(token, options) {
    //     if (!token || !token.get || !token.get('user')) {
    //         return false
    //     }

    //     if (token.forever) {
    //         return true
    //     }

    //     const expiry = token.toJSON().expiry
    //     return util.dateDiff(new Date(), new Date(expiry)) > 0
    // }

    // * validateCredentials(user, password, options) {
    //     if (!user || !user.attributes || !user.attributes[options.password]) {
    //         return false
    //     }
    //     const actualPassword = user.attributes[options.password]
    //     try {
    //         let compare = yield this.hash.verify(password, actualPassword)
    //         return compare
    //     } catch (e) {
    //         return false
    //     }
    // }

}

module.exports = MongoSerializer;