import { Injectable } from '@nestjs/common';
import { AzureChatOpenAI } from '@langchain/openai';
import { AIMessageChunk, MessageContent } from '@langchain/core/messages';

@Injectable()
export class ChatService {
  model = new AzureChatOpenAI({
    model: 'gpt-4o',
    temperature: 1,
    maxTokens: undefined,
    maxRetries: 2,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY, // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME, // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME, // In Node.js defaults to process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION, // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
  });

  constructor() {}

  async getResponse(query: string): Promise<MessageContent> {
    const aiMsg = await this.model.invoke([
      ['system', 'Add message "here is summary" in response at last'],
      ['human', `summarize this ${query}`],
    ]);
    return aiMsg.content;
  }
}
