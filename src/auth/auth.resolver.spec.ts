import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from '../app.module'
import { CONSTANTS } from '../constants'
import { HttpStatus, INestApplication } from '@nestjs/common'

describe('Your Test Description', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    app = moduleFixture.createNestApplication();
    await app.init()
  });

  afterAll(async () => {
    await app.close()
  });


  it('Runs signUpUser mutation and check password provided empty string', async () => {
    const query = `
         mutation SignUpUser {
        signUpUser(
            signUpUser: {
              fullName: "Synsoft Global"
              email: "synsoft@mailinator.com"
              password: ""
            }
        ) {
            message
            statusCode
        }
    }
    `
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect(response => {
        if (response.body.errors) {
          const resp = response.body.errors
          const errorMessage = resp[0].message[0]
          const errorStatusCode = resp[0].statusCode
          expect(errorMessage).toEqual(CONSTANTS.STRONG_PASSWORD)
          expect(errorStatusCode).toEqual(HttpStatus.BAD_REQUEST)
        }
      })
  })


  it('Runs signUpUser mutation and check email provided empty string', async () => {
    const query = `
         mutation SignUpUser {
        signUpUser(
            signUpUser: {
              fullName: "Synsoft Global"
              email: ""
              password: "Synsoft@123"
            }
        ) {
            message
            statusCode
        }
    }
    `
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect(response => {
        if (response.body.errors) {
          const resp = response.body.errors
          const errorMessage = resp[0].message[0]
          const errorStatusCode = resp[0].statusCode
          expect(errorMessage).toEqual(CONSTANTS.EMAIL_VALID)
          expect(errorStatusCode).toEqual(HttpStatus.BAD_REQUEST)
        }
      })
  })


  it('Runs signUpUser mutation and check fullName provided empty string', async () => {
    const query = `
         mutation SignUpUser {
        signUpUser(
            signUpUser: {
              fullName: ""
              email: "synsoft@mailinator.com"
              password: "Synsoft@123"
            }
        ) {
            message
            statusCode
        }
    }
    `
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect(response => {
        if (response.body.errors) {
          const resp = response.body.errors
          const errorMessage = resp[0].message[0]
          const errorStatusCode = resp[0].statusCode
          if (errorMessage === CONSTANTS.FULLNAME_INVALID_MESSAGE) {
            expect(errorMessage).toEqual(CONSTANTS.FULLNAME_INVALID_MESSAGE)
            expect(errorStatusCode).toEqual(HttpStatus.BAD_REQUEST)
          } else {
            expect(errorMessage).toEqual(CONSTANTS.ENTER_FULLNAME)
            expect(errorStatusCode).toEqual(HttpStatus.BAD_REQUEST)
          }
        }
      })
  }, 100000)

  it('Runs signUpUser mutation and register user', async () => {
    const query = `
         mutation SignUpUser {
        signUpUser(
            signUpUser: {
              fullName: "Synsoft Global",
              email: "synsoft@mailinator.com",
              password: "Synsoft@123"
            }
        ) {
            message
            statusCode
        }
    }
    `
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect(response => {
        const data = response.body.data
        expect(data.signUpUser.message).toEqual(CONSTANTS.REGISTRATION_SUCCESSFULL)
        expect(data.signUpUser.statusCode).toEqual(HttpStatus.OK)
      })
  })


  it('Runs signUpUser mutation and check if user already exist', async () => {
    const query = `
         mutation SignUpUser {
        signUpUser(
            signUpUser: {
              fullName: "Synsoft Global",
              email: "synsoft@mailinator.com",
              password: "Synsoft@123"
            }
        ) {
            message
            statusCode
        }
    }
    `
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect(response => {
        if (response.body.errors) {
          const resp = response.body.errors
          const errorMessage = resp[0].message[0]
          const errorStatusCode = resp[0].statusCode
          expect(errorMessage).toEqual(CONSTANTS.EMAIL_EXISTS)
          expect(errorStatusCode).toEqual(HttpStatus.BAD_REQUEST)
        }
      })
  })


  it('Runs signInUser mutation and check if  email provided is empty string', async () => {
    const query = `
         mutation SignInUser {
        signInUser(
            signInUser: {
              password: "Synsoft@123"
            }
            ) {
              message
              statusCode
              user {
                fullName
                email
                auth_token
              }
            }
        }
      `
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect(response => {
        const { signInUser } = response.body.data
        expect(signInUser.message).toEqual(CONSTANTS.EMAIL_CHECK)
        expect(signInUser.statusCode).toEqual(HttpStatus.BAD_REQUEST)
      })
  })


  it('Runs signInUser mutation and to signIn with email', async () => {
    const query = `
         mutation SignInUser {
        signInUser(
            signInUser: {
              email: "synsoft@mailinator.com"
              password: "Synsoft@123",
            }
            ) {
              message
              statusCode
              user {
                fullName
                email
                auth_token
              }
            }
        }
      `
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect(response => {
        if (response?.body?.data) {
          const { signInUser } = response.body.data
          expect(signInUser.message).toEqual(CONSTANTS.SIGNEDIN_SUCCESS)
          expect(signInUser.statusCode).toEqual(HttpStatus.OK)

        }
      })
  })


  // it('Delete user', async () => {
  //   const query = `
  //   mutation SignUpUser {
  //     removeUser(removeUser: { userName: "synsoft" }) {
  //       message
  //       statusCode
  //     }
  //   }
  // `
  //   return await request(app.getHttpServer())
  //     .post('/graphql')
  //     .send({ query })
  //     .expect(200)
  //     .expect(response => {
  //       const data = response.body.data
  //       expect(data.removeUser.message).toEqual('User removed')
  //       expect(data.removeUser.statusCode).toEqual(HttpStatus.OK)
  //     })
  // })

})
