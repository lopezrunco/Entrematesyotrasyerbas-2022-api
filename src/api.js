require('dotenv').config()

const mongoose = require('mongoose')
const mongooseToJson = require('@meanie/mongoose-to-json') // Clean the requests in _id y __v
const express = require('express')
const cors = require('cors') // Allow conections between the same IP
const getDbConnectionString = require('./utils/get-db-connection-string')

mongoose.plugin(mongooseToJson)

// -------------------------------------------------------------------------------------------------- //
// Express app creation
// -------------------------------------------------------------------------------------------------- //

const app = express()

// -------------------------------------------------------------------------------------------------- //
// Middlewares
// -------------------------------------------------------------------------------------------------- //

const checkUserCredentials = require('./middlewares/check-user-credentials')

app.use(cors())
app.use(express.json())

// -------------------------------------------------------------------------------------------------- //
// Controllers
// -------------------------------------------------------------------------------------------------- //

// Security
const refresh = require('./controllers/auth/refresh')
const enableMfa = require('./controllers/auth/enable-mfa')

// Users
const login = require('./controllers/user/login')
const register = require('./controllers/user/register')
const getAllUsers = require('./controllers/user/get-all')

// Posts
const getAllPosts = require('./controllers/posts/get-all')
const getPostById = require('./controllers/posts/get-by-id')
const getPostsByCategory = require('./controllers/posts/get-by-category')
const getPostsByTag = require('./controllers/posts/get-by-tag')
const getPostsByAuthor = require('./controllers/posts/get-by-author')
const getCategories = require('./controllers/posts/get-categories')
const getTags = require('./controllers/posts/get-tags')

// -------------------------------------------------------------------------------------------------- //
// Routes definition
// -------------------------------------------------------------------------------------------------- //

// Security
app.get('/auth/refresh', checkUserCredentials('REFRESH'), refresh)
app.get('/auth/mfa', checkUserCredentials(), enableMfa)

// Users
app.post('/login', login)
app.post('/register', register)
app.get('/users', getAllUsers)

// Posts
app.get('/posts', getAllPosts)
app.get('/posts/:id', getPostById)
app.get('/posts/category/:category', getPostsByCategory)
app.get('/posts/tag/:tag', getPostsByTag)
app.get('/posts/author/:author', getPostsByAuthor)
app.get('/categories', getCategories)
app.get('/tags', getTags)

mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT)
    }).catch(error => {
        console.error('Could not connect to database', error)
    }) 