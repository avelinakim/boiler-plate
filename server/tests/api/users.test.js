const chai = require('chai')
const expect = chai.expect
// const chaiThings = require('chai-things')
// chai.use(chaiThings)

const app = require('../../index')
const request = require('supertest')
const agent = request(app)

describe('GET `/api/users/` route', () => {
  it('gets users', async () => {
    const response = await agent.get('/api/users/').expect(200)
    // expect(response.body).to.have.length(2);
    // expect(response.body[0].campusId).to.equal(1);
  })
})

describe('PUT `/api/users/login` route', () => {
  it('returns 401 if email is not valid', async () => {
    const response = await agent.put('/api/users/login').send({ email: 'abc', password: '123' })
    expect(response.statusCode).to.equal(401)
  })
  it('returns 401 if password is not valid', async () => {
    const response = await agent.put('/api/users/login').send({ email: 'cody@email.com', password: '4567' })
    expect(response.statusCode).to.equal(401)
  })
  it('returns correct data if credentials are valid', async () => {
    const response = await agent.put('/api/users/login').send({ email: 'cody@email.com', password: '1234' })
    expect(response.statusCode).to.equal(200)
    expect(response.body.id).to.equal(1)
    expect(response.body.email).to.equal('cody@email.com')
    console.log(response.header)
  })
})

describe('GET `/api/users/me` route', () => {
  it('returns 400 if not logged in', async () => {
    const response = await agent.get('/api/users/me')
    // console.log('hello', response.body)
    expect(response.statusCode).to.equal(400)
    // expect(response.body).to.have.length(2);
    // expect(response.body[0].campusId).to.equal(1);
  })

  it('returns 200 if logged in and returns correct data', async () => {
    const meAgent = request.agent(app)
    await meAgent.put('/api/users/login').send({ email: 'cody@email.com', password: '1234' })
    const response = await meAgent.get('/api/users/me')
    expect(response.statusCode).to.equal(200)
    expect(response.body.id).to.equal(1)
    expect(response.body.email).to.equal('cody@email.com')
  })
})
