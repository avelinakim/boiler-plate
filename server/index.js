const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
require('dotenv').config()
const passport = require('passport')
const { db, User } = require('./database/models')

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

passport.serializeUser((user, done) => {
  try {
    done(null, user.id)
  } catch (err) {
    done(err)
  }
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id)
  try {
    done(null, user)
  } catch (err) {
    done(err)
  }
})

// Passport (authentication) middleware
app.use(passport.initialize())
app.use(passport.session())

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
