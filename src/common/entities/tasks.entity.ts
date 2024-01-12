import { ObjectType, Field, Int, InputType } from '@nestjs/graphql'
import { Message } from './user.entity'



@ObjectType()
export class Tasks {

    @Field((type) => String, { defaultValue: '' })
    _id: string

    @Field((type) => String, { defaultValue: '' })
    title: string

    @Field((type) => String, { defaultValue: '' })
    description: string

    @Field((type) => String, { defaultValue: '' })
    type: string

    @Field((type) => String, { defaultValue: '' })
    userId: string

    @Field((type) => [FileObject], { defaultValue: [] })
    urls: FileObject[]
}


@ObjectType()
export class FileObject {
    @Field((type) => String, { defaultValue: '' })
    filename: string

    @Field((type) => String, { defaultValue: '' })
    mimetype: string

    @Field((type) => String, { defaultValue: '' })
    encoding: string

    @Field((type) => String, { defaultValue: '' })
    path: string
}

@ObjectType()
export class TaskData extends Message {
    @Field((type) => Tasks, { nullable: true })
    tasks: Tasks

}