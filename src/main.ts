import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as passport from 'passport';


import { FileUploadMiddleware } from './common/validators/FileUploadMiddleware'
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'

async function server() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const publicFolder = join(__dirname,'../', 'uploads')
  
  app.use(
    '/graphql',
    new FileUploadMiddleware().use
  )
  
  app.useStaticAssets(publicFolder,{prefix: '/uploads'})
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
    })
  )  
  app.use(passport.initialize());

  await app.listen(3000)
}

server()
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
});