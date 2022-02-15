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

// -------------------------------------------------------------------------------------------------- //
// Routes definition
// -------------------------------------------------------------------------------------------------- //

// Users
app.post('/login', login)
app.post('/register', register)

// Posts
// app.get('/posts/posts/:category', getPostsByCategory)
// app.get('/posts/posts:tag', getPostsByTag)
// app.get('/posts/posts:id', getPostsById)

mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT)
    }).catch(error => {
        console.error('Could not connect to database', error)
    }) 