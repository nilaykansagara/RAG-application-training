import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { EmbeddingService } from './embedding.service';
import { PrismaService } from '../prisma/prisma.service';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma';
import { DocumentEmbedding, Prisma } from '@prisma/client';
import { AzureOpenAIEmbeddings } from '@langchain/openai';

@Module({
  controllers: [UploadController],
  providers: [
    UploadService,
    EmbeddingService,
    RecursiveCharacterTextSplitter,
    {
      provide: PrismaVectorStore,
      useFactory: (prismaService: PrismaService) => {
        return PrismaVectorStore.withModel<DocumentEmbedding>(
          prismaService,
        ).create(new AzureOpenAIEmbeddings(), {
          prisma: Prisma,
          tableName: 'document_embeddings' as any,
          vectorColumnName: 'vector',
          columns: {
            id: PrismaVectorStore.IdColumn,
            content: PrismaVectorStore.ContentColumn,
            documentName: true,
          },
        });
      },
      inject: [PrismaService],
    },
  ],
})
export class UploadModule {}
