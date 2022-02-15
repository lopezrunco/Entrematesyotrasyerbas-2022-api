const bcrypt = require('bcrypt')
const Joi = require('joi')
const { userModel } = require('../../models/user')
const createToken = require('../../utils/create-token')
const { CONSUMER_TOKEN_TYPE, REFRESH_TOKEN_TYPE } = require('../../utils/token-types')

module.exports = (request, response) => {
    const user = request.body

    const schema = Joi.object({
        name: Joi.string()
            .alphanum()
            .min(3)
            .max(20)
            .required(),
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(5)
            .max(50)
            .required()
    })

    const validationResult = schema.validate(user)

    if (!validationResult.error) {
        user.password = bcrypt.hashSync(user.password, 2)

        userModel.create({
            name: user.name,
            email: user.email,
            password: user.password,
            mfaEnabled: false,
            mfaSecret: ''

        }).then (user => {
            const userWithoutPasswords = user.toObject()

            delete userWithoutPasswords.password
            delete userWithoutPasswords.mfaEnabled
            delete userWithoutPasswords.mfaSecret
            userWithoutPasswords.id = userWithoutPasswords._id
            delete userWithoutPasswords._id

            userWithoutPasswords.token = createToken(user, CONSUMER_TOKEN_TYPE, '30m')
            userWithoutPasswords.refreshToken = createToken(user, REFRESH_TOKEN_TYPE, '3d')

            response.json({
                user: userWithoutPasswords
            })
        }).catch(error => {
            response.status(500).json({
                message: 'Could not register the user'
            })
        })
    } else {
        response.status(400).json({
            message: validationResult.error
        })
    }
}