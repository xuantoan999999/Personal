'use strict'

/**
 * adonis-auth
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const coFs = require('co-functional')
const Auth = require('adonis-auth/middleware/Auth')
const CE = require('adonis-auth/src/Exceptions')

class AuthCustom extends Auth {
    // * _tryFail(request, authenticators) {
    //     return coFs.forEachSerial(function* (authenticator) {
    //         /**
    //          * it should make use of existing of existing auth instance when
    //          * authenticator is set to default. It will avoid invoking new
    //          * instance, which inturn saves a SQL query.
    //          */
    //         const authInstance = authenticator === 'default' ? request.auth : request.auth.authenticator(authenticator)
    //         const result = yield authInstance.check()
    //         if (result) {
    //             request.authUser = yield authInstance.getUser()
    //             /**
    //              * we need to break the loop as soon as an authenticator
    //              * returns true. Ideally one cannot break promises chain
    //              * without throwing an error, so here we throw an error
    //              * and handle it gracefully
    //              */
    //             throw new Error('Stop execution')
    //         }
    //     }, authenticators)
    // }
    * _authenticate(request, response, authenticators) {
        try {
            yield this._tryFail(request, authenticators)
            return yield response.redirect('/dang-nhap');
            // throw new CE.InvalidLoginException('Login Failure', 401)
        } catch (e) {
            if (e.message !== 'Stop execution') {
                throw e
            }
        }
    }
    * handle(request, response, next) {
        const args = Array.prototype.slice.call(arguments)
        const authenticators = args.length > 3 ? args.splice(3, args.length) : ['default']
        yield this._authenticate(request, response, authenticators)
        yield next
    }
}

module.exports = AuthCustom
