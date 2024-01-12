import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql'
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import * as processRequest from 'graphql-upload/processRequest.js'
import { CreateTask, UpdateTask } from './dto/ceate-tasks.input'
import { TasksService } from './tasks.service'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard'
import { TaskData, Tasks } from '../common/entities/tasks.entity'
import { Message } from '../common/entities/user.entity'
import { PaginatedResponse, PaginationtInput } from '../common/entities/pagination.input'



@Resolver('File')
export class TasksResolver {

    constructor(private readonly taskService: TasksService) { }

    @UseGuards(GqlAuthGuard)
    @Query((returns) => [Tasks])
    async getTaskList(@Context() context: any) {
        const result = await this.taskService.getTasksList(context?.req?.user)

        return result
    }


    @UseGuards(GqlAuthGuard)
    @Query((returns) => Tasks)
    async getOneTasks(@Args({ name: '_id', type: () => String }) _id: String) {
        const result = await this.taskService.getOneTasks(_id)
        return result
    }

    // @UseGuards(GqlAuthGuard)
    @Query((returns) => PaginatedResponse,{name:'paginatedTasks'})
    async getListInPagination(
      @Args('pageinate') paginate?: PaginationtInput
    ): Promise<unknown> {
      const data = await this.taskService.findByPagination(paginate)
      return data
    }

    

    @UseGuards(GqlAuthGuard)
    @Mutation(() => TaskData, { name: 'addTasks' })
    async addTasks(
        @Args({ name: 'file', type: () => [GraphQLUpload], nullable: true })
        file: processRequest.FileUpload[] | null | undefined,
        @Args('info') cr: CreateTask,
        @Context() context: any
    ) {
        const user = context.req.user
        const res = await this.taskService.createTask({ file, info: cr, user: user })
        return res
    }



    @UseGuards(GqlAuthGuard)
    @Mutation(() => TaskData, { name: 'updateTasks' })
    async updateTasks(
        @Args({ name: 'file', type: () => [GraphQLUpload], nullable: true })
        file: processRequest.FileUpload[] | null | undefined,
        @Args('info') cr: UpdateTask,
        @Context() context: any
    ) {
        const res = await this.taskService.updateTask({ file, info: cr })
        
        return res
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Message)
    async deleteTask(@Args({ name: '_id', type: () => String }) _id: String) {
        const result = this.taskService.deleteTask(_id)
        return result
    }
}