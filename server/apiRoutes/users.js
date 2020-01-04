// Example for individual router
const { User } = require('../database/models')
// apiRoutes/users.js
const router = require('express').Router()

// Authentication routes
// Sign up
router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    req.login(user, (err) => {
      if (err) next(err)
      else res.json(user)
    })
  } catch (error) {
    next(error)
  }
})

// Login
router.put('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    })
    if (!user) res.status(401).send('User not found')
    else if (!user.correctPassword(req.body.password)) res.status(401).send('Incorrect password')
    else {
      req.login(user, (err) => {
        if (err) next(err)
        else res.json(user)
      })
    }
  } catch (error) {
    next(error)
  }
})

// Get me (logged in user)
router.get('/me', (req, res, next) => {
  try {
    if (req.user) {
      res.json(req.user)
    } else {
      res.sendStatus(400)
    }
  } catch (error) {
    next(error)
  }
})

// Log out
router.delete('/logout', (req, res, next) => {
  try {
    req.logout()
    req.session.destroy()
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

// Other Routes
// Matches GET requests to /api/users/
router.get('/', function(req, res, next) {
  /* etc */ res.sendStatus(200)
})
// Matches POST requests to /api/users/
router.post('/', function(req, res, next) {
  /* etc */
})
// Matches PUT requests to /api/users/:userId
router.put('/:userId', function(req, res, next) {
  /* etc */
})
// Matches DELETE requests to /api/users/:userId
router.delete('/:userId', function(req, res, next) {
  /* etc */
})

module.exports = router
