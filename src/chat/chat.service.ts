import { Injectable } from '@nestjs/common';
import { AzureChatOpenAI } from '@langchain/openai';
import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma';
import { DocumentEmbedding } from '@prisma/client';
import { MessageContent } from '@langchain/core/messages';

@Injectable()
export class ChatService {
  model = new AzureChatOpenAI({
    model: 'gpt-4o',
    temperature: 1,
    maxTokens: undefined,
    maxRetries: 2,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY, // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME, // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
    azureOpenAIApiDeploymentName: "gpt-4o-interns-bootcamp-2025", // In Node.js defaults to process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
    azureOpenAIApiVersion: "2024-08-01-preview", // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
  });

  constructor(private readonly prismaVectorStore: PrismaVectorStore<DocumentEmbedding, any, any, any>){

  }

  // async getResponse(query: string): Promise<MessageContent> {
  //   const aiMsg = await this.model.invoke([
  //     ['system', 'Add message "here is summary" in response at last'],
  //     ['human', `summarize this ${query}`],
  //   ]);
  //   return aiMsg.content;
  // }

  async getResponse(query: string): Promise<MessageContent> {
    const resultOne = await this.prismaVectorStore.similaritySearch(query, 1);
    const aiMsg = await this.model.invoke([
          ['system', `${resultOne[0].pageContent} Please consider this context. And answer the question if you can not find any answer just say Chala ja`],
          ['human', `${query}`],
        ]);
    return aiMsg.content;
  }
}
