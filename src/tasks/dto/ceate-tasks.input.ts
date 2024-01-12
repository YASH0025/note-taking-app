
import { InputType, Field } from '@nestjs/graphql'
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import { FileUpload } from '../../common/interface';
import * as processRequest from "graphql-upload/processRequest.js"
import { Validate } from '@nestjs/class-validator';
import { TaskCategoryValidator } from '../../common/validators/taskCategoryTypeValidator';

@InputType()
export class CreateTask {

    @Field(type => String)
    title: string

    @Field(type => String)
    @Validate(TaskCategoryValidator, { message: 'Invalid Category' })
    category: string

    @Field(type => String, { nullable: true })
    description: string
}

@InputType()
export class UpdateTask {

    @Field(type => String)
    _id: string


    @Field(type => String, { nullable: true })
    title: string

    @Field(type => String)
    @Validate(TaskCategoryValidator, { message: 'Invalid Category' })
    category: string

    @Field(type => String, { nullable: true })
    description: string
}