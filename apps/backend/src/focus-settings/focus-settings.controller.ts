import { Controller, Body, Put, Get, UseGuards, Request } from '@nestjs/common';
import { 
    GetFocusSettingsUseCase, 
    UpdateFocusSettingsUseCase,
    FocusSettings,
    CreateFocusSettingsUseCase
} from '@mindease/domain';
import { UpdateFocusSettingsDTO, ResponseFocusSettingsDTO } from '@mindease/dtos';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth';

@Controller('focus-settings')
@ApiTags('focus-settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FocusSettingsController {
    constructor(
        private readonly getUseCase: GetFocusSettingsUseCase,
        private readonly updateUseCase: UpdateFocusSettingsUseCase,
        private readonly createUseCase: CreateFocusSettingsUseCase,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get focus timer settings for the authenticated user' })
    @ApiResponse({ status: 200, description: 'Settings found', type: ResponseFocusSettingsDTO })
    async get(@Request() req: any) {
        const userId = req.user.sub;
        let settings = await this.getUseCase.execute(userId);
        
        // Se não existir, cria e salva as configurações padrão
        if (!settings) {
             settings = await this.createUseCase.execute({
                 idUser: userId,
                 foco: 25,
                 pausaCurta: 5,
                 pausaLonga: 15,
                 pomodorosCompleted: 0,
             });
        }
        
        return this.toResponse(settings);
    }

    @Put()
    @ApiOperation({ summary: 'Update focus timer settings' })
    @ApiBody({ 
        schema: {
            properties: {
                foco: { type: 'number' },
                pausaCurta: { type: 'number' },
                pausaLonga: { type: 'number' },
                pomodorosCompleted: { type: 'number' },
                tasks: { type: 'array' },
                audioThemes: { type: 'array' },
            }
        }
    })
    @ApiResponse({ status: 200, description: 'Settings updated successfully', type: ResponseFocusSettingsDTO })
    async update(@Request() req: any, @Body() body: UpdateFocusSettingsDTO) {
        const userId = req.user.sub;
        const settings = await this.updateUseCase.execute({
            idUser: userId,
            foco: body.foco,
            pausaCurta: body.pausaCurta,
            pausaLonga: body.pausaLonga,
            pomodorosCompleted: body.pomodorosCompleted,
            tasks: body.tasks,
            audioThemes: body.audioThemes,
        });
        return this.toResponse(settings);
    }

    private toResponse(settings: FocusSettings): ResponseFocusSettingsDTO {
        return new ResponseFocusSettingsDTO(
            settings.foco,
            settings.pausaCurta,
            settings.pausaLonga,
            settings.pomodorosCompleted,
            settings.tasks,
            settings.audioThemes
        );
    }
}
