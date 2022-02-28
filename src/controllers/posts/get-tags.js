const { postModel } = require("../../models/post")

module.exports = (request, response) => {
    postModel
        .find()
        .select('tags')
        .then(tags => {
            let tagList = []

            tags.forEach(tag => {
                tag.tags.forEach(tagsSubElements => {
                    tagList.push(tagsSubElements)
                })
            })

            let uniqueTags = [...new Set(tagList)]

            response.status(200).json({
                uniqueTags
            })
        })
        .catch(error => {
            console.error(error)
            response.status(500).json({
                message: 'Error trying to list the tags'
            })
        })
}