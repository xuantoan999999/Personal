'use strict'
const BaseScheme = require('adonis-auth/src/Schemes/BaseScheme')
const scheme = require('adonis-auth/src/Schemes/index')
const mongoose = use('mongoose');
const jwt = require('jsonwebtoken')
const NE = require('node-exceptions')
const CE = require('adonis-auth/src/Exceptions')

const User = mongoose.model('User');

class MongoSchema {
    constructor(request, serializer, options) {
        this.request = request;
        this.serializer = serializer;
        this.options = options;
    }
    /**
   * checks whether a user is logged in or not. It
   * is performed by excuting following steps in
   * sequence.
   * 1. return true - If user exists on the instance
   * 2. Check for session value
   * a) return false - If session does not exists
   * b) Go to step 3
   * 3. find the user using the serializer and passing id
   * a) return false - If user does not exist
   * b) Go to step 4
   * 4. set user object on instance and return true
   *
   * @return {Boolean}
   */
    * check() {
        if (this.user) {
            return true
        }
        const requestUser = yield this._getRequestUser()
        if (!requestUser) {
            return false;
        }
        return requestUser;
    }

    /**
     * returns the logged in user by calling check method
     *
     * @return {Object}
     *
     * @public
     */
    * getUser() {
        const isLoggedIn = yield this.check()
        if (!isLoggedIn) {
            return null
        }
        return this.user
    }

    /**
     * validates a user with uid and password.
     *
     * @param  {String} uid
     * @param  {String} password
     * @param  {Boolean} [returnUser]
     * @return {Boolean|Object}
     *
     * @throws UserNotFoundException when unable to locate user
     * @throws PasswordMisMatchException when password does not match
     */
    * validate(uid, password, returnUser) {
        const user = yield this.serializer.findByCredentials(uid, this.options)
        if (!user) {
            throw new CE.UserNotFoundException(`Không tìm thấy user hoặc user không phải là admin`)
        }
        const isValid = yield this.serializer.validateCredentials(user, password, this.options)
        if (!isValid) {
            throw new CE.PasswordMisMatchException('Mật khẩu không khớp')
        }
        return returnUser ? { success: true, user } : { success: true, user: true }
    }

    /**
     * returns token passed inside request, it will look
     * for following places.
     * Request header - Authorization=Bearer 'token'
     * Query string - token='token'
     * Request body - token='token'
     *
     * @return {String|Null}
     *
     * @private
     */
    _getRequestToken() {
        let token = this.request.header('authorization')
        if (token) {
            token = token.split(' ')
            return (token.length === 2 && token[0] === 'Bearer') ? token[1] : null
        }
        return this.request.input('token')
    }

    /**
   * returns default jwtOptions to be used while
   * generating and verifying tokens.
   *
   * @return {Object}
   *
   * @private
   */
    get jwtOptions() {
        return this.options.options || {};
    }

    /**
     * returns a signed token with given payload
     * @param  {Mixed} payload
     * @param  {Object} [options]
     * @return {Promise}
     *
     * @private
     */
    _signToken(payload, options) {
        return new Promise((resolve, reject) => {
            jwt.sign({ payload: payload }, this.options.secret, options, function (error, token) {
                if (error) {
                    return reject(error)
                }
                resolve(token)
            })
        })
    }

    /**
     * verifies request JWT token
     *
     * @param  {String} token
     * @return {Promise}
     *
     * @private
     */
    _verifyRequestToken(token, options) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.options.secret, options, (error, decoded) => {
                if (error) {
                    return reject(error)
                }

                /**
                 * For backward compatibility we are going to auto detect the
                 * decoded payload and return it as a new payload when it
                 * does not have a uid.
                 */
                if (decoded.payload && typeof (decoded.payload) === 'number') {
                    decoded.payload = { uid: decoded.payload }
                }
                resolve(decoded)
            })
        })
    }

    /**
     * returns user by verifying request token and
     * using serializer to get user.
     *
     * @return {String}
     *
     * @private
     */
    * _getRequestUser() {
        try {
            const Redis = use('Redis');
            let token = yield this.request.session.get('Authorization');
            let cachedUsers = yield Redis.get(`Personal:${token}`);
            if (!cachedUsers) return null;
            let decodeUser = yield this._verifyRequestToken(cachedUsers, this.jwtOptions);
            const userId = decodeUser.payload.uid || null;
            if (!userId) {
                return null
            }
            return yield this.serializer.findById(userId, this.options)
        } catch (e) {
            return null
        }
    }

    /**
     * Generates a new JWT token for a given user. The user
     * needs to be an instance of model when serializer
     * is Lucid
     *
     * @param  {Object} user
     *
     * @return {String}
     */
    * generate(user, customPayload) {
        if (!user) {
            throw new NE.InvalidArgumentException('user is required to generate a jwt token')
        }
        const primaryKey = this.serializer.primaryKey(this.options)
        const primaryValue = user[primaryKey]
        if (!primaryValue) {
            throw new NE.InvalidArgumentException(`Value for ${primaryKey} is null for given user.`)
        }
        const payload = { uid: primaryValue }
        if (customPayload) {
            payload.data = typeof (customPayload.toJSON) === 'function' ? customPayload.toJSON() : customPayload
        }
        return this._signToken(payload, this.jwtOptions)
    }

    /**
     * Decodes a token and returns jwt object.
     *
     * @return {Object}
     */
    * decode() {
        return yield this._verifyRequestToken(this._getRequestToken(), this.jwtOptions)
    }

    /**
     * Validates a user an returns the token
     * if credentials have been validated.
     *
     * @param  {String} uid
     * @param  {String} password
     *
     * @return {String}
     */
    * attempt(uid, password) {
        const user = yield this.validate(uid, password, true)
        if (!user.success) return user;
        return yield this.generate(user.user)
    }
}

module.exports = MongoSchema;
