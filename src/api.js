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

app.use(cors())
app.use(express.json())

// -------------------------------------------------------------------------------------------------- //
// Routes definition
// -------------------------------------------------------------------------------------------------- //

// Posts
app.get('/posts/posts/:category', getPostsByCategory)
app.get('/posts/posts:tag', getPostsByTag)
app.get('/posts/posts:id', getPostsById)

mongoose.connect(getDbConnectionString(), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT)
    }).catch(error => {
        console.error('Could not connect to database', error)
    }) 