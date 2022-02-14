const otplib = require('otplib')
const qrcode = require('qrcode')
const crypto = require('crypto')
const { userModel } = require('../../models/user')

otplib.authenticator.options = { crypto }

module.exports = (request, response) => {
    const secret = otplib.authenticator.encode(
        crypto.randomBytes(32).toString('hex').substr(0, 20)
    )

    // Data showed in the auth app
    const email = request.user.email
    const service = 'Entre mates y otras yerbas'

    const otpAuth = otplib.authenticator.keyuri(email, service, secret)

    // Generate QR with de data
    qrcode.toDataURL(otpAuth)
        .then(qr => {
            userModel.findByIdAndUpdate(
                { _id: request.user.id, mfaEnabled: false },
                { mfaEnabled: true, mfaSecret: secret })
                .then((user) => {
                    if (user) {
                        response.json({
                            qr,
                            secret
                        })
                    } else {
                        response.json({
                            message: 'Could not enable MFA'
                        })
                    }
                }).catch(error => {
                    console.error('Error trying to enable MFA', error)
                    response.status(500).json({
                        message: 'Error trying to enable MFA'
                    })
                })
        }).catch(error => {
            console.error('Error trying to generate QR', error)
            response.status(500).json({
                message: 'Error trying to generate QR'
            })
        })
}