import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('api/v1/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body() body: { message: string; context: any }) {
    // We remove the JwtAuthGuard so local frontend users can hit this endpoint 
    // even if they only have a mock localstorage token.
    return this.aiService.getChatResponse(body.message, body.context, { name: 'User' });
  }
}
