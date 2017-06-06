'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var slug = require('slug');
/**
 * Post Schema
 */
var PostSchema = new Schema({
    title: {
        type: String,
        default: '',
        required: 'Please fill title',
        trim: true
    },
    slug: {
        type: String,
        default: '',
        trim: true
    },
    image: {
        type: String,
        default: '',
        trim: true
    },
    thumb: {
        type: String,
        default: '',
        trim: true
    },
    short_desc: {
        type: String,
        default: '',
        required: 'Please fill short_desc',
        trim: true
    },
    content: {
        type: String,
        default: '',
        required: 'Please fill content',
        trim: true
    },
    status: {
        type: Number,
        default: 1
    },
    type: {
        type: String,
        enum: ['NEWS', 'SALE'],
        default: 'NEWS',
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    attrs: {
        title: String,
        description: String,
        keyword: String
    }
},{ collection: 'posts', timestamps: true });
PostSchema.index({ slug: 1 });

PostSchema.pre('update', function(next) {
    if (!this.slug) {
        this.slug = slug(this.title);
    }
    this.slug = this.slug.toLowerCase();
    next();
});
PostSchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = slug(this.title);
    }
    this.slug = this.slug.toLowerCase();
    next();
});
module.exports = mongoose.model('Post', PostSchema);
