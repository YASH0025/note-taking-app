import { Test, TestingModule } from '@nestjs/testing'
import { UsersResolver } from './users.resolver'
import { UsersService } from './users.service'
import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { AppModule } from '../app.module';
import { CONSTANTS } from '../constants';
describe('UsersResolver', () => {
  let app;
  let token;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

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

    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect(response => {
        if (response?.body?.data) {
          const { signInUser } = response.body.data
          token = signInUser.user.auth_token
          return
        }
      })
  });

  afterAll(async () => {
    await app.close();
  });


  it('Delete user', async () => {
    const query = `
    mutation RemoveUser {
      removeUser {
          message
          statusCode
      }
  }
  `

    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query })
      .expect(200)
      .expect(response => {
        const data = response.body.data
        expect(data.removeUser.message).toEqual(CONSTANTS.USER_DELETE_SUCCESS)
        expect(data.removeUser.statusCode).toEqual(HttpStatus.OK)
      })
  })
  it('should be defined', () => {
    // expect(resolver).toBeDefined()
  })
})
