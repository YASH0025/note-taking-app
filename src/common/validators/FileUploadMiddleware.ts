import { Injectable, NestMiddleware } from '@nestjs/common';
import * as graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";

@Injectable()
export class FileUploadMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void): any {
    const fileSize = 10 * 1024 * 1024
    graphqlUploadExpress({ maxFileSize: fileSize, maxFiles: 10 })(req, res, (err: any) => {
      try {
        if (err) {
          if (err.message.includes('maxFileSize')) {
            return res.status(403).json({ error: 'File size exceeds the limit of 10MB.' });
          }
          return res.status(500).json({ error: 'Maximum 10 files only' });
        }

      } catch (error) {
        return res.status(401).json({ message: 'To large file' })
      }
      next();
    });
  }
}
