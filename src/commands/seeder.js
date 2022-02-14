require('dotenv').config()

const bcrypt = require('bcrypt')
const faker = require('faker')
const mongoose = require('mongoose')
const getDbConnectionString = require('../utils/get-db-connection-string')
const { userModel } = require('../models/user')

const users = []
const userPassword = bcrypt.hashSync('super_mega_secret', 2)
const numberOfUsers = 10

for (let iterationIndex = 0; iterationIndex < numberOfUsers; iterationIndex++) {
    users.push({
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: userPassword,
        mfaEnabled: false,
        mfaSecret: ''
    })
}

console.log('------------------------------------------------------------------------')
console.log('Seeder running')
console.log(`Will be inserted ${numberOfUsers} users`)

mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        Promise.all([
            userModel.insertMany(users)
        ]).then(() => {
            console.log('Done!')
            console.log('------------------------------------------------------------------------')
            mongoose.connection.close()
        })
    }).catch(error => {
        console.error('Could not connect to database', error)
    })