const Sequelize = require('sequelize')

// Use database URL from heroku or local postgres
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/boiler-plate', {
  logging: false
})

module.exports = db
