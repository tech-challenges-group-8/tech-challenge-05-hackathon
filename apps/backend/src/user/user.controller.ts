
import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from '@mindease/domain';

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

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [User] })
  async findAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
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
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ schema: { properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'User updated', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string; password?: string }
  ): Promise<User> {
    const user = await this.userService.updateUser(id, body.name, body.email, body.password);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    const success = await this.userService.deleteUser(id);
    if (!success) throw new NotFoundException('User not found');
    return { success };
  }

  // Password operations
  @Put(':id/password')
  @ApiOperation({ summary: 'Update user password' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ schema: { properties: { newPassword: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Password updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updatePassword(
    @Param('id') id: string,
    @Body() body: { newPassword: string }
  ): Promise<{ success: boolean }> {
    const success = await this.userService.updatePassword(id, body.newPassword);
    if (!success) throw new NotFoundException('User not found');
    return { success };
  }

  @Post(':id/validate-password')
  @ApiOperation({ summary: 'Validate user password' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ schema: { properties: { password: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Password validation result' })
  async validatePassword(
    @Param('id') id: string,
    @Body() body: { password: string }
  ): Promise<{ valid: boolean }> {
    const valid = await this.userService.validatePassword(id, body.password);
    return { valid };
  }
}
