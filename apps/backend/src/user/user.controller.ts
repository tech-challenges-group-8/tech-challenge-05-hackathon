
import { Controller, Get, Post, Put, Body, Param, NotFoundException, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from '@mindease/domain';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ schema: { properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' } } } })
  @ApiResponse({ status: 201, description: 'User created', type: User })
  async create(@Body() body: { name: string; email: string; password: string }): Promise<User> {
    return this.userService.createUser(body.name, body.email, body.password);
  }


  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.userService.getUserById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ schema: { properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'User updated', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only update own profile' })
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string; password?: string },
    @Request() req: any
  ): Promise<User> {
    // Ensure user can only update their own information
    if (req.user.sub !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    
    const user = await this.userService.updateUser(id, body.name, body.email, body.password);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Put(':id/password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user password' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ schema: { properties: { newPassword: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Password updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only update own password' })
  async updatePassword(
    @Param('id') id: string,
    @Body() body: { newPassword: string },
    @Request() req: any
  ): Promise<{ success: boolean }> {
    // Ensure user can only update their own password
    if (req.user.sub !== id) {
      throw new ForbiddenException('You can only update your own password');
    }
    
    const success = await this.userService.updatePassword(id, body.newPassword);
    if (!success) throw new NotFoundException('User not found');
    return { success };
  }

}
