import { Module } from '@nestjs/common';

import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ChatModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UploadModule,
    PrismaModule,
  ],
})
export class AppModule {}
