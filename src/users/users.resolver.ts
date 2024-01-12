import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { Email, Message, User, UserFind } from '../common/entities/user.entity'
import { ResetPasswords, UpdatePasswords, UpdateUserInput } from './dto/update-user.input'
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard'
import { RemoveUserInput } from '../auth/dto/create-auth.input'
import { AuthService } from 'src/auth/auth.service'
import { PaginatedResponse, PaginationtInput } from '../common/entities/pagination.input'



@Resolver(() => User)
export class UsersResolver {


  constructor(private readonly usersService: UsersService,private readonly authService: AuthService) { }


  @UseGuards(GqlAuthGuard)
  @Query((returns) => [User])
  findAll() {
    return this.usersService.findAll()
  }


  @UseGuards(GqlAuthGuard)
  @Query((returns) => User, { name: 'findOneUser' })
  async findUser(@Args('userDetail') userDetail: UserFind) {
    const result = this.usersService.findUser(userDetail)
    return result
  }



  // @Mutation((returns) => Message)
  // async generateOTP(@Args('generateOtp') data: Email): Promise<Message> {
  //   const generatedOtp = await this.usersService.generateOTP(data);
  //   return generatedOtp;
  // }


  @Query((returns) => Message)
  async forgotPassword(@Args('forgotPass') data: Email): Promise<Message> {
    const generatedOtp = await this.usersService.forgotPassword(data);
    return generatedOtp;
  }


  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Context() context: any
  ) {
    const userId = context?.req?.user._id
    const result = this.usersService.update(userId, updateUserInput)
    return result
  }


  @Mutation(() => Message)
  async resetPassword(@Args('resetPassword') resetPassword: ResetPasswords) {
    const result = await this.usersService.resetPassword(resetPassword)
    return result
  }


  @UseGuards(GqlAuthGuard)
  @Mutation(() => Message)
  async updatePassword(
    @Args('updatePassword') updatePassword: UpdatePasswords,
    @Context() context: any,
  ) {
    const userData = context?.req?.user
    const result = await this.usersService.updatePassword(userData, updatePassword)
    return result
  }


  @UseGuards(GqlAuthGuard)
  @Mutation(() => Message)
  // async removeUser(@Args({ name: 'removeUser', type: () => Email }) removeUser: Email) {
  async removeUser(@Context() context: any) {
    const user = context.req.user

    const result = await this.usersService.remove(user)
    return result
  }

  @UseGuards(GqlAuthGuard)
  @Query((returns) => PaginatedResponse)
  async getListInPagination(
    @Args('pageinate') paginate?: PaginationtInput
  ): Promise<PaginatedResponse> {
    const data = await this.usersService.findByPagination(paginate)
    return data as PaginatedResponse
  }

  
}
