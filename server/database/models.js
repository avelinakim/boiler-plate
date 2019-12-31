const db = require('./index')
const Sequelize = require('sequelize')
const crypto = require('crypto')
const _ = require('lodash')

// Define models
const User = db.define(
  'user',
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
    },
    salt: {
      type: Sequelize.STRING,
    },
  },
  {
    hooks: {
      beforeCreate: setSaltAndPassword,
      beforeUpdate: setSaltAndPassword,
    },
  }
)

// Instance methods
User.prototype.correctPassword = function(candidatePassword) {
  return User.encryptPassword(candidatePassword, this.salt) === this.password
}

User.prototype.sanitize = function() {
  return _.omit(this.toJSON(), ['password', 'salt'])
}

// Class methods
User.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64')
}

User.encryptPassword = function(plainText, salt) {
  const hash = crypto.createHash('sha1')
  hash.update(plainText)
  hash.update(salt)
  return hash.digest('hex')
}

// Need to salt & hash again when user enters password for 1st time and whenever they change it
function setSaltAndPassword(user) {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password, user.salt)
  }
}

module.exports = {
  db,
  // Include models in export
  User,
}
