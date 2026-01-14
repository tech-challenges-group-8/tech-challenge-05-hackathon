import { User } from '../entities/User';
import { IUserRepository } from '../repositories/IUserRepository';

/**
 * Create User Use Case - Domain Core
 * Pure application logic
 */
export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(name: string, email: string): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser = new User(
      this.generateId(),
      name,
      email,
      new Date()
    );

    // Validate user
    if (!newUser.isEmailValid()) {
      throw new Error('Invalid email format');
    }

    // Save user
    await this.userRepository.save(newUser);

    return newUser;
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
