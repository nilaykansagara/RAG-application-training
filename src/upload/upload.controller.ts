import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { EmbeddingService } from './embedding.service';

@Controller('upload')
export class UploadController {
  constructor(private embeddingService: EmbeddingService) {}

  @Post('/')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'src/uploads',
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.embeddingService.embedding(file);
  }
}
