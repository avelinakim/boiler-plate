const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
const db = require('./database/index')
require('dotenv').config()

// Config & create our database store
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const dbStore = new SequelizeStore({ db: db })

// Sync so that our session table gets created
dbStore.sync()

// Plug store into session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'a wildly insecure secret',
    store: dbStore,
    resave: false,
    saveUninitialized: false,
  })
)

// Logging middleware
app.use(morgan('dev'))

// Body parsing middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Static middleware
app.use(express.static(path.join(__dirname, '../dist')))

// My api routes
app.use('/api', require('./apiRoutes'))

// Send HTML
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// Error handling middleware
app.use(function(err, req, res, next) {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})

module.exports = app
