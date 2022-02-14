const jwt = require('jsonwebtoken')

// By default, token will be CONSUMER type
module.exports = (tokenType = 'CONSUMER') => {
    return (request, response, next) => {
        const token = request.headers.authorization

        try {
            // Validate the token sended by the user
            const decoded = jwt.verify(token, process.env.JWT_KEY)

            if (decoded.type === tokenType) {
                // Insert user data in request
                request.user = {
                    id: decoded.id,
                    name: decoded.name,
                    email: decoded.email
                }

                // Insert token info in the request
                request.token = {
                    value: token,
                    type: decoded.type
                }

                next()
            } else {
                return response.status(401).json({
                    message: 'Invalid token type'
                })
            }
        } catch (error) {
            console.error('Token error', error)
            return response.status(401).json({
                message: 'Invalid credentials'
            })
        }
    }
}