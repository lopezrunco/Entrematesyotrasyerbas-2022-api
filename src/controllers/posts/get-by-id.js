const { postModel } = require('../../models/post')

module.exports = (request, response) => {
    postModel
        .findOne({ _id: request.params.id })
        .select()
        .then(post => {
            response.status(200).json({
                post
            })
        }).catch(error => {
            response.status(500).json({
                message: 'Error trying to get the post'
            })
        })
}