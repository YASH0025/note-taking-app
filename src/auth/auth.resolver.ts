import { Resolver, Query, Mutation, Args, Context, Field } from '@nestjs/graphql'
import { HttpStatus, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateAuthInput } from './dto/create-auth.input'
import { Data, Email, Message, User } from '../common/entities/user.entity'
import { LoginAuth } from './dto/update-auth.input'
import { CONSTANTS } from '../constants'
import { JwtService } from '@nestjs/jwt'
import { GqlAuthGuard } from './guards/gql-auth.guard'
import { AuthGuard } from '@nestjs/passport'
import { ProfileInput } from './test'
import { GoogleVerificationService } from './verify-googleuser'
// import { GoogleProfileInput } from './google-profile.input'

// export class ProfileInput {
//   @Field()
//   displayName: string;

//   // Add other fields as needed
// }
@Resolver(() => Data)
export class AuthResolver {


  constructor(
    private jwtService: JwtService,
    private readonly authService: AuthService
  ) { }

  //  Resolver for registering user
  @Mutation((returns) => Message)
  async signUpUser(@Args('signUpUser', new ValidationPipe()) signUpUser: CreateAuthInput) {
    try {
      const response = await this.authService.signUpUser(signUpUser)

      return response
    } catch (error) {
      return {
        message: CONSTANTS.UNKNOWN_ERROR_DURING_SIGNUP,
        statusCode: HttpStatus.ACCEPTED
      }
    }
  }

  //  Resolver to allow user to loggin
  @Mutation((returns) => Data)
  async signInUser(
    @Args('signInUser', new ValidationPipe()) signInUser: LoginAuth,
    @Context() context
  ): Promise<Data> {
    try {
      const { email } = signInUser;
      if ((!email)) return {
        user: null,
        message: CONSTANTS.EMAIL_CHECK,
        statusCode: HttpStatus.BAD_REQUEST
      }
      const result = await this.authService.signInUser(signInUser);
      return result;
    } catch (error) {
      return {
        user: null,
        message: CONSTANTS.UNKNOWN_ERROR_DURING_SIGNIN,
        statusCode: HttpStatus.ACCEPTED
      }
    }
  }


  // Resolver to delete single user at a time
  // @Mutation((returns) => Message)
  // async removeUser(@Args('removeUser') removeUser: RemoveUserInput) {
  //   const response = await this.authService.remove(removeUser)
  //   return response
  // }

  @Query((returns) => Message)
  async resendAccountVerificationEmail(@Args('resendVerificationEmail') email: Email){    
    const response = await this.authService.resendAccountVerificationEmail(email)
    return response
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => String)
  async greetings() {
    return 'Hello World'
  }

  

  @Mutation(() => String)
  async googleLoginCallback(@Args('accessToken') accessToken: string): Promise<string> {
    // const profile = await GoogleVerificationService.verifyAccessToken(accessToken);
    // console.log(profile);
    
    const user = await this.authService.findOrCreateGoogleUser(accessToken);

    if (user) {
      return `User ${user.fullName} authenticated successfully.`;
    } else {
      return 'Authentication failed.';
    }
  }
  @Mutation(() => String)

  async facebookLoginCallback(@Args('accessToken') accessToken: string): Promise<string> {
    // const profile = await GoogleVerificationService.verifyAccessToken(accessToken);
    // console.log(profile);
    

    const user = await this.authService.findOrCreateFacebookUser(accessToken);

    if (user) {
      return `User ${user.fullName} authenticated successfully.`;
    } else {
      return 'Authentication failed.';
    }
  }

}
