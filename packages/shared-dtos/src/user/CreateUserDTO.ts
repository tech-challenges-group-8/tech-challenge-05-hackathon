import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

/**
 * Create User DTO - Shared across Frontend and Backend
 * Ensures consistent data validation
 */
export class CreateUserDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}
