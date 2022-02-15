const { model, Schema } = require('mongoose')

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    published: {
        type: Boolean,
        required: true,
        default: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: Array,
        default: []
    },
    primaryImageUrl: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: Array,
        default: []
    },
    subcontent: {
        type: Array,
        default: []
    },
    secondaryImagesUrls: {
        type: Array,
        default: []
    },
    links: {
        type: Array,
        default: []
    },
    author: {
        type: String,
        trim: true
    }
})

const postModel = model('posts', postSchema)

module.exports = {
    postSchema,
    postModel
}