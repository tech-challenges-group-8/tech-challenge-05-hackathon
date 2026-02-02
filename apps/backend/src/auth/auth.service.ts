import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDTO, AuthResponseDTO, JwtPayloadDTO } from '@mindease/dtos';

/**
 * Auth Service - Handles authentication logic
 * Responsible for user login, token generation, and password validation
 */
@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Authenticates a user and returns a JWT token
   * @param loginDto - User credentials (email and password)
   * @returns AuthResponseDTO with access token and user information
   * @throws UnauthorizedException if credentials are invalid
   */
  async login(loginDto: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayloadDTO = new JwtPayloadDTO(
      user.id,
      user.email,
      user.name,
    );

    const accessToken = this.jwtService.sign({
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
    });

    return new AuthResponseDTO(
      accessToken,
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      3600, // 1 hour expiration
    );
  }

  /**
   * Validates user credentials
   * @param email - User email
   * @param password - User password (plain text)
   * @returns User object if credentials are valid, null otherwise
   */
  async validateUser(email: string, password: string): Promise<any> {
    const userWithPassword = await this.userService.getUserByEmailWithPassword(
      email
    );

    if (!userWithPassword) {
      return null;
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await this.comparePassword(
      password,
      userWithPassword.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    // Return user without password
    return {
      id: userWithPassword.id,
      name: userWithPassword.name,
      email: userWithPassword.email,
    };
  }

  /**
   * Hashes a plain text password
   * @param password - Plain text password
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compares a plain text password with a hashed password
   * @param password - Plain text password
   * @param hashedPassword - Hashed password
   * @returns True if passwords match, false otherwise
   */
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      this.logger.warn(
        'Password comparison failed',
        error instanceof Error ? error.stack : String(error)
      );
      return false;
    }
  }

  /**
   * Verifies a JWT token
   * @param token - JWT token to verify
   * @returns Decoded token payload
   */
  async verifyToken(token: string): Promise<JwtPayloadDTO> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      this.logger.warn(
        'Token verification failed',
        error instanceof Error ? error.stack : String(error)
      );
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Generates a new JWT token for a user
   * @param userId - User ID
   * @returns New JWT token
   */
  async generateToken(userId: string): Promise<string> {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload: JwtPayloadDTO = new JwtPayloadDTO(
      user.id,
      user.email,
      user.name,
    );

    return this.jwtService.sign({
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
    });
  }
}
