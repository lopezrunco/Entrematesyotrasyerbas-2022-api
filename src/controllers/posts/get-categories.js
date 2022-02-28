const { postModel } = require("../../models/post")

module.exports = (request, response) => {
    postModel
        .aggregate([
            { $sortByCount: '$category' },
            { $project: {
                _id: false,
                name: '$_id',
                count: '$count'
            } }
        ])
        .then(categories => {
            response.status(200).json({
                categories
            })
        })
        .catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to list the categories'
            })
        })
}