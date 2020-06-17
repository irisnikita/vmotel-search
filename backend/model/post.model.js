const {ObjectID} = require('mongodb');

// Libraries
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User Schema
 */
let PostSchema = new Schema({
    address: String,
    area: Number,
    contact: Object,
    description: String,
    filter: Object,
    images: Array,
    infoBlock: Object,
    option: Object,
    price: Number,
    startTime: Date,
    title: String,
    typePost: String
});

module.exports = mongoose.model('posts', PostSchema, 'posts');