const { db, User } = require('./server/database/models')
const { green, red } = require('chalk')

const seed = async () => {
  await db.sync({ force: true })

  // seed your database here!
  await User.create({ name: 'foo' })

  console.log(green('Seeding success!'))
  db.close()
}

seed().catch((err) => {
  console.error(red('Oh noes! Something went wrong!'))
  console.error(err)
  db.close()
})
