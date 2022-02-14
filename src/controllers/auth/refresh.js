const createToken = require('../../utils/create-token')
const { CONSUMER_TOKEN_TYPE, REFRESH_TOKEN_TYPE } = require('../../utils/token-types')

module.exports = (request, response) => {
    if (request.token.type === 'REFRESH') {
        const token = createToken(request.user, CONSUMER_TOKEN_TYPE, '30m')
        const refreshToken = createToken(request.user, REFRESH_TOKEN_TYPE, '3d')

        response.json({
            token,
            refreshToken
        })
    } else {
        response.status(401).end()
    }
}