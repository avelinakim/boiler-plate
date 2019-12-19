const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, './dist')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', require('./apiRoutes'))

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

const port = process.env.PORT || 3000 // can be useful to deploy to Heroku
app.listen(port, function () {
  console.log(`Your server, listening on port ${port}`)
})
