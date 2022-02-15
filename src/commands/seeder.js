require('dotenv').config()

const bcrypt = require('bcrypt')
const faker = require('faker')
const mongoose = require('mongoose')
const getDbConnectionString = require('../utils/get-db-connection-string')
const { userModel } = require('../models/user')
const { postModel } = require('../models/post')

const users = []
const userPassword = bcrypt.hashSync('super_mega_secret', 2)
const numberOfUsers = 10
const posts = []
const numberOfPosts = 20

for (let generateUsersIndex = 0; generateUsersIndex < numberOfUsers; generateUsersIndex++) {
    users.push({
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: userPassword,
        mfaEnabled: false,
        mfaSecret: ''
    })
}

for (let generatePostsIndex = 0; generatePostsIndex < numberOfPosts; generatePostsIndex++) {
    
    const content = []
    const subcontent = []
    for (let contentIndex = 0; contentIndex < faker.datatype.number(20); contentIndex++) {
        content.push(faker.lorem.paragraph())        
    }
    for (let subcontentIndex = 0; subcontentIndex < faker.datatype.number(30); subcontentIndex++) {
        subcontent.push(faker.lorem.paragraph())        
    }
    
    posts.push({
        title: faker.name.title(),
        published: true,
        category: faker.lorem.word(),
        tags: [
            faker.lorem.word(),
            faker.lorem.word(),
            faker.lorem.word()
        ],
        primaryImageUrl: faker.image.image(),
        content: content,
        subcontent: subcontent,
        secondaryImagesUrls: [
            faker.image.image(),
            faker.image.image(),
            faker.image.image()
        ],
        links: [
            faker.internet.domainName(),
            faker.internet.domainName()
        ],
        author: faker.name.firstName()
    })
}

console.log('------------------------------------------------------------------------')
console.log('Seeder running')
console.log(`Will be inserted ${numberOfUsers} users and ${numberOfPosts} posts`)

mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        Promise.all([
            userModel.insertMany(users),
            postModel.insertMany(posts)
        ]).then(() => {
            console.log('Done!')
            console.log('------------------------------------------------------------------------')
            mongoose.connection.close()
        })
    }).catch(error => {
        console.error('Could not connect to database', error)
    })