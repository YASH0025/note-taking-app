import { IsNumber} from '@nestjs/class-validator'
import { InputType, Field, Int, ObjectType } from '@nestjs/graphql'
import { Tasks } from './tasks.entity'



@InputType()
export class PaginationtInput {

  @IsNumber()
  @Field((type)=> Int)
  page?: number


  @Field((type)=> Int)
  limit?: number
}


@ObjectType()
export class PaginatedResponse {

    @Field((type) => Int)
    total: number


    @Field(() => [Tasks])
    data: Tasks[]
}