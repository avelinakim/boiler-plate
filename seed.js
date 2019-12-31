const { db, user } = require('./server/database/models')
const { green, red } = require('chalk')

const seed = async () => {
  await db.sync({ force: true })

  // seed your database here!
  await user.create({ name: 'foo' })

  console.log(green('Seeding success!'))
  db.close()
}

seed().catch((err) => {
  console.error(red('Oh noes! Something went wrong!'))
  console.error(err)
  db.close()
})
