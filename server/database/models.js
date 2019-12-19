const db = require('./index')
const Sequelize = require('sequelize')

// Define models and associations 
Puppy = db.define('puppy', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  }
})

module.exports = {
  db,
  // Include models in export
  Puppy
}
