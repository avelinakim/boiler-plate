// Example for individual router

// apiRoutes/puppies.js
const router = require('express').Router();

// Matches GET requests to /api/puppies/
router.get('/', function (req, res, next) { /* etc */ res.send("PUPPIES") });
// Matches POST requests to /api/puppies/
router.post('/', function (req, res, next) { /* etc */ });
// Matches PUT requests to /api/puppies/:puppyId
router.put('/:puppyId', function (req, res, next) { /* etc */ });
// Matches DELETE requests to /api/puppies/:puppyId
router.delete('/:puppyId', function (req, res, next) { /* etc */ });

module.exports = router;
