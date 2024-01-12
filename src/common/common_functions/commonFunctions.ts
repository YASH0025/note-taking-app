import { Injectable } from "@nestjs/common"
import * as ejs from 'ejs'
import * as fs from 'fs'
import { MailerService } from '@nestjs-modules/mailer'
import { join } from "path"
import { taskConstants } from "../../constants"
@Injectable()
export class CommonFunctions {

    constructor(
        private readonly mailerService: MailerService,
    ) { }

    async checkIfTimeExpired(time: any) {
        const currentEpochTimestamp = await Date.now()
        const fiveMinutesAgoTimestamp = await currentEpochTimestamp - 15 * 60 * 1000
        const isOtpExpired = await time < fiveMinutesAgoTimestamp
        return isOtpExpired
    }

    //This function check if token is expire or not
    async tokenExpiryCheck(value: any) {
        const currentTimestamp = Math.floor(Date.now() / 1000)
        return value > currentTimestamp
    }


    //This function renders ejs file for dynamic templates and data in it
    async renderWithData(data: Record<string, any>, path: any) {
        const template = await fs.readFileSync(path, 'utf-8');
        const rendered = await ejs.render(template, data);
        return rendered;
    }


    async sendEmail(data: any) {
        return await this.mailerService
            .sendMail({
                to: data.to,
                from: process.env.HOST_USER,
                subject: data.subject,
                html: data.html
            })
    }

    async trimedValues(data: any) {
        let trimmedObject = ''
        let regex = /\s+/
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const value = data[key]
                if (typeof value === "string" && regex.test(value)) {
                    if (key === 'fullName') {
                        trimmedObject = `Invalid ${key}`
                    } else {
                        trimmedObject = `Invalid ${key}`
                    }
                }
            }
        }

        return trimmedObject;
    }

    async addFile(data: any, category: string) {
        const file = await data
        let msg: any
        const dirPath = join(__dirname, `../../../uploads/${category}`)

        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
        const imageName = new Date().getTime().toString()
        const fileType = file.mimetype.split('/')

        const isFileTypeValid = taskConstants.formatsAllowed[category.toUpperCase()].includes(fileType[1])
        if (!isFileTypeValid) return msg = { message: `Provide correct ${category.toLowerCase()} format` }
        try {
            const writeStream = fs.createWriteStream(`${dirPath}/${imageName}.${fileType[1]}`)
            await new Promise<void>((resolve, reject) => {
                writeStream.on('error', (error) => {
                    msg = { message: error }
                    reject(error);
                })

                writeStream.on('finish', () => {
                    resolve();
                });
                ///// not to be removed till tested
                // writeStream.on('finish', () => {
                //     msg = {
                //         filename: `${imageName}.${fileType[1]}`,
                //         mimetype: file.mimetype,
                //         encoding: file.encoding,
                //         path: `${process.env.LOCAL_DOMAIN_NAME}uploads/${category}/${imageName}.${fileType[1]}`
                //     }
                // })

                file.createReadStream().pipe(writeStream)
            })
            msg = {
                filename: `${imageName}.${fileType[1]}`,
                mimetype: file.mimetype,
                encoding: file.encoding,
                path: `${process.env.LOCAL_DOMAIN_NAME}uploads/${category}/${imageName}.${fileType[1]}`
            }

            return msg
        } catch (error) {
            if (error?.toString().includes('File truncated as it exceeds the')) msg = { message: 'File size should not exceed 10 mb.' }
        }

        return msg
    }

    async unLinkFile(category: string, imageName: string = '') {
        const imagePath = join(__dirname, '../../../uploads',category, imageName)
        await fs.unlinkSync(imagePath)
    }
}