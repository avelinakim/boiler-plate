const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
require('dotenv').config()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const { db, User } = require('./database/models')

// Google authentication

// Google configuration object
const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}
// Configure the strategy with config obj, & write the function passport will invoke after google sends the user's profile and access token
const strategy = new GoogleStrategy(googleConfig, async function(token, refreshToken, profile, done) {
  const googleId = profile.id
  const name = profile.displayName
  const email = profile.emails[0].value

  let user = User.find({ where: { googleId: googleID } })
  if (!user) {
    user = await User.create({ name, email, googleId })
  }
  done(null, user)
})

passport.use(strategy) // register our strategy with passport

// Config & create our database store
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const dbStore = new SequelizeStore({ db: db })

// Sync so that our session table gets created
dbStore.sync()

// Middlewares ----------------------------------------------------------------------

// Plug store into session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'a wildly insecure secret',
    store: dbStore,
    resave: false,
    saveUninitialized: false,
  })
)

// Passport
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

// ----------------------------------------------------------------------

// My api routes
app.use('/api', require('./apiRoutes'))
app.get('/auth/google', passport.authenticate('google', { scope: 'email' }))
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
)

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
