'use strict'

const mongoose = use('mongoose');
// const User = mongoose.model('User');

class MongoSerializer {

    * findById(id, options) {
        // ...
    }

    * findByCredentials(email, options) {
        // ...
    }

    * findByToken(token, options) {
        // ...
    }

    * getUserForToken(tokenPayload, options) {
        // ...
    }

    * saveToken(userPayload, token, options, expiry) {
        // ...
    }

    * revokeTokens(userPayload, tokens, reverse) {
        // ...
    }

    * validateToken(tokenPayload, options) {
        // ...
    }

    * validateCredentials(userPayload, password, options) {
        // ...
    }

    primaryKey(authenticatorOptions) {
        // ...
    }

}

module.exports = MongoSerializer;