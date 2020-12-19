const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const middleware = require('./utils/middleware')

app.use(cors())
app.use(bodyParser.json())

app.use(middleware.tokenExtractor)

// routes
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// error handlers
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
