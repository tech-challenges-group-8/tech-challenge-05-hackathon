import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CognitiveSettingsService } from './cognitive-settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CognitiveSettings } from '@mindease/domain';

@ApiTags('cognitive-settings')
@Controller('cognitive-settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CognitiveSettingsController {
  constructor(private readonly service: CognitiveSettingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create cognitive settings for authenticated user' })
  @ApiBody({
    schema: {
      properties: {
        themeMode: { type: 'string', enum: ['light', 'dark', 'soft-pastel', 'high-contrast'] },
        typography: {
          type: 'object',
          properties: {
            fontFamily: { type: 'string' },
            lineHeight: { type: 'string' },
            letterSpacing: { type: 'string' },
            textSize: { type: 'string' },
          },
        },
        focusMode: {
          type: 'object',
          properties: {
            hideSidebar: { type: 'boolean' },
            highlightActiveTask: { type: 'boolean' },
            animationsEnabled: { type: 'boolean' },
            simpleInterface: { type: 'boolean' },
          },
        },
        sensory: {
          type: 'object',
          properties: {
            muteSounds: { type: 'boolean' },
            hideUrgencyIndicators: { type: 'boolean' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Cognitive settings created' })
  @ApiResponse({ status: 409, description: 'Settings already exist for this user' })
  async create(
    @Body() body: {
      themeMode?: string;
      typography?: any;
      focusMode?: any;
      sensory?: any;
    },
    @Request() req: any
  ): Promise<CognitiveSettings> {
    const userId = req.user.sub;
    return this.service.createSettings(
      userId,
      body.themeMode,
      body.typography,
      body.focusMode,
      body.sensory
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get cognitive settings for authenticated user' })
  @ApiResponse({ status: 200, description: 'Cognitive settings found' })
  @ApiResponse({ status: 404, description: 'Cognitive settings not found' })
  async get(@Request() req: any): Promise<CognitiveSettings> {
    const userId = req.user.sub;
    const settings = await this.service.getSettingsByUserId(userId);
    if (!settings) {
      throw new NotFoundException('Cognitive settings not found');
    }
    return settings;
  }

  @Put()
  @ApiOperation({ summary: 'Update cognitive settings for authenticated user' })
  @ApiBody({
    schema: {
      properties: {
        themeMode: { type: 'string', enum: ['light', 'dark', 'soft-pastel', 'high-contrast'] },
        typography: {
          type: 'object',
          properties: {
            fontFamily: { type: 'string' },
            lineHeight: { type: 'string' },
            letterSpacing: { type: 'string' },
            textSize: { type: 'string' },
          },
        },
        focusMode: {
          type: 'object',
          properties: {
            hideSidebar: { type: 'boolean' },
            highlightActiveTask: { type: 'boolean' },
            animationsEnabled: { type: 'boolean' },
            simpleInterface: { type: 'boolean' },
          },
        },
        sensory: {
          type: 'object',
          properties: {
            muteSounds: { type: 'boolean' },
            hideUrgencyIndicators: { type: 'boolean' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Cognitive settings updated' })
  @ApiResponse({ status: 404, description: 'Cognitive settings not found' })
  async update(
    @Body() body: {
      themeMode?: string;
      typography?: any;
      focusMode?: any;
      sensory?: any;
    },
    @Request() req: any
  ): Promise<CognitiveSettings> {
    const userId = req.user.sub;
    return this.service.updateSettings(
      userId,
      body.themeMode,
      body.typography,
      body.focusMode,
      body.sensory
    );
  }

  @Delete()
  @ApiOperation({ summary: 'Delete cognitive settings for authenticated user' })
  @ApiResponse({ status: 200, description: 'Cognitive settings deleted' })
  @ApiResponse({ status: 404, description: 'Cognitive settings not found' })
  async delete(@Request() req: any): Promise<{ success: boolean }> {
    const userId = req.user.sub;
    await this.service.deleteSettings(userId);
    return { success: true };
  }
}
