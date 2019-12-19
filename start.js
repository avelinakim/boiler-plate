const db = require('./server/database/index')
const app = require('./server/index')
const port = process.env.PORT || 3000

db.sync()  // Sync our database
  .then(function () {
    app.listen(port, function () { // Start listening with express server once we have synced
      console.log(`Your server, listening on port ${port}`)
    })
  })

