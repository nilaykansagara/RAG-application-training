import { Injectable } from '@nestjs/common';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { PrismaService } from '../prisma/prisma.service';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PrismaClient, DocumentEmbedding } from '@prisma/client';
import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma';
@Injectable()
export class EmbeddingService {
  constructor(
    private prismaService: PrismaService,
    private textSplitter: RecursiveCharacterTextSplitter,
    private prismaVectorStore: PrismaVectorStore<DocumentEmbedding, any, any, any>
  ) {}

  async embedding(file: Express.Multer.File) {
    const loader = new PDFLoader(file.path);
    const chunks = await this.textSplitter.splitDocuments(await loader.load());
    const db = new PrismaClient();


    await this.prismaVectorStore.addModels(
      await db.$transaction(
        chunks.map((content) =>
          this.prismaService.documentEmbedding.create({
            data: {
              content: content.pageContent,
              documentName: file.originalname,
            },
          }),
        ),
      ),
    );
  }
}
