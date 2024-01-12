import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { CommonFunctions } from '../common/common_functions/commonfunctions'
import { Tasks, TaskData } from '../common/entities/tasks.entity'
import { CommonMongooseFunctions } from '../common/common_functions/commonMongooseQuries'
import { CONSTANTS } from '../constants'
import { Message } from '../common/entities/user.entity'
import { PaginationtInput } from '../common/entities/pagination.input'

@Injectable()
export class TasksService {

    private mongooseFunction: CommonMongooseFunctions<any>
    constructor(
        @Inject('TASKS_MODEL')
        private tasksModel: Model<Tasks>,
        private readonly commonFunctions: CommonFunctions,
    ) {
        this.mongooseFunction = new CommonMongooseFunctions<any>(this.tasksModel)

    }

    async createTask(data: any) {
        let fileInfos: any = []
        let response: any
        const { file, info, user } = data
        const category = info.category.toUpperCase()

        if (category !== 'TEXT' && file && file.length > 0) {
            for (const item of file) {
                const fileInfo = await this.commonFunctions.addFile(item, info.category)
                if (fileInfo?.message) {
                    return fileInfo.message
                }
                fileInfos.push(fileInfo)
            }
        }

        try {
            const result: any = await this.mongooseFunction.insertOne({ ...info, userId: user._id, urls: fileInfos })
            if (Object.keys(result).length > 0) {
                response = {
                    tasks: result,
                    message: 'Task inserted successfully',
                    statusCode: HttpStatus.CREATED
                }
            } else {
                response = {
                    tasks: {},
                    message: 'Task not created',
                    statusCode: HttpStatus.NOT_MODIFIED
                }
            }

        } catch (error) {
            response = {
                tasks: Tasks,
                message: error.toString(),
                statusCode: HttpStatus.BAD_REQUEST
            }
        }
        return response as TaskData
    }


    async getTasksList(data: any) {
        const result = await this.mongooseFunction.findSpecific({ userId: data._id })
        return result
    }
    async getOneTasks(_id: any) {
        const result = await this.mongooseFunction.findById(_id)
        return result
    }


    async deleteTask(_id: any) {
        let message: {}
        const result = await this.mongooseFunction.deleteOne({ _id: _id })
        console.log(result)
        if (result) {
            message = {
                message: CONSTANTS.TASK_DELETE_SUCCESS,
                statusCode: HttpStatus.OK
            } as Message
            if (result.urls.length > 0) {
                result.urls.map((item: any) => this.commonFunctions.unLinkFile(result.category,item.filename))
            }
            return message
        } else {
            message = {
                message: CONSTANTS.TASK_DELETE_ERROR,
                statusCode: HttpStatus.FORBIDDEN
            } as Message
            return message
        }
    }


    async updateTask(data: any) {
        const { file, info } = data
        const filter = { _id: info._id }
        let response = {}
        let fileInfos: any = []

        const update: any = { $set: {} }
        if (file && file.length > 0) {
            for (const item of file) {
                const fileInfo = await this.commonFunctions.addFile(item, info.category)
                if (fileInfo?.message) {
                    return fileInfo.message
                }
                fileInfos.push(fileInfo)
                if (fileInfos.length > 0) {
                    update.$push = { urls: { $each: fileInfos } }
                }
            }
        }
        Object.keys(info).forEach(async (key) => {
            if (key !== '_id') update.$set[key] = data.info[key]
        })

        if (Object.keys(update.$set).length === 0) {
            console.error('No valid fields provided for update.')
            response = {
                tasks: {},
                message: 'Task not updated',
                statusCode: HttpStatus.NOT_MODIFIED
            }
        }

        try {
            const result = await this.mongooseFunction.updateOne(filter, update)
            if (Object.keys(result).length > 0) {
                response = {
                    tasks: result,
                    message: 'Task Updated successfully',
                    statusCode: HttpStatus.CREATED
                }
            } else {
                response = {
                    tasks: {},
                    message: 'Task not updated',
                    statusCode: HttpStatus.NOT_MODIFIED
                }
            }

        } catch (error) {
            response = {
                tasks: {},
                message: error.toString(),
                statusCode: HttpStatus.BAD_REQUEST
            }
        }
        return response
    }


    async findByPagination(paginate: PaginationtInput) {
        const data = await this.mongooseFunction.findByPagination(paginate.page, paginate.limit)
        console.log('data',data);
        
        // const resp = {
        //     tot
        // }
        return data as unknown
      }
}
