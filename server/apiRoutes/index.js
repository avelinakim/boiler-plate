const router = require('express').Router()

// Add routers
router.use('/puppies', require('./puppies'))

// Handle 404s
router.use(function (req, res, next) {
  const err = new Error('Not found')
  err.status = 404
  next(err)
})

module.exports = router
