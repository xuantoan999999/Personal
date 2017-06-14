'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 bcrypt = require('bcryptjs'),
 Schema = mongoose.Schema;

 const SALT_LENGTH = 9;
/**
 * A Validation function for local strategy properties
 */
 var validateLocalStrategyProperty = function(property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
 var validateLocalStrategyPassword = function(password) {
    return (this.provider !== 'local' || (password && password.length > 5));
};

/**
 * A Validation function for local strategy password
 */
 var validatePhone = function(phone) {
    let phoneStr = new String(phone);
    if(phone.substring(0,1) != '0')
        return false;
    if(phoneStr.length < 10 || phoneStr.length > 11)
        return false;
    
    return true;
};

/**
 * User Schema
 */
 var UserSchema = new Schema({

    name: {
        type: String,
        // trim: true,
        validate: [validateLocalStrategyProperty, 'Please fill in your name']
    },
    email: {
        type: String,
        trim: true,
        // default: '',
        unique: 'Email already exists',
        validate: [validateLocalStrategyProperty, 'Please fill in your email'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        validate: [validatePhone, 'Please fill a valid phone'],
    },
    address: {
        type: String
    },
    province: {
        type: String
    },
    district: {
        type: String
    },
    roles: {
        type: [{
            type: String,
            enum: ['user', 'admin', 'agent', 'supplier']
        }],
        default: ['user']
    },
    status: {       //0=unactive, 1=active, 2=detele
        type: Number,
        default: 1
    },
    password: {
        type: String,
        // default: '',
        validate: [validateLocalStrategyPassword, 'Password should be longer']
    },
    agent: {
        type: {
            type: String,
            enum: ['XE', 'PT']
        },
        supplier: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    },
    supplier: {
        tax: {  //Mã số thuế
            type: String
        },
        bank_number: {
            type: String
        },
        bank_name: {
            type: String
        },
        bank_agent: {   //Chi nhánh
            type: String
        }
    },

    /* For register Provider user */
    provider: {
        type: String,
        required: 'Provider is required'
    },
    provider_id: {
        type: String,
        default: null,
        trim: true,
        index: false,
        // unique: true,
        sparse: true,
    },
    providerData: {},
    additionalProvidersData: {},
    
    /* For register user */
    activeToken: {
        type: String,
        default: '',
        trim: true,
    },
    activeExpires: {
        type: Date
    },
    /* For reset password */
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, { collection: 'users', timestamps: true });

/**
 * Create instance method for hashing a password
 */
 UserSchema.methods = {
    hashPassword: function(password, callback) {
        bcrypt.hash(password, SALT_LENGTH, callback);
    },
    authenticate: function(password, callback) {
        bcrypt.compare(password, this.password, callback);
    }
}

module.exports = mongoose.model('User', UserSchema);