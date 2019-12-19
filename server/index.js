const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')

// Logging middleware
app.use(morgan('dev'))

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static middleware
app.use(express.static(path.join(__dirname, '../dist')))

// My api routes
app.use('/api', require('./apiRoutes'))

// Send HTML
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// Error handling middleware
app.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

module.exports = app
