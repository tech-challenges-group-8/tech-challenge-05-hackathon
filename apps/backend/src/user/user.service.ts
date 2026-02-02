
import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@mindease/domain';
import * as bcrypt from 'bcrypt';
import { UserRecord, UserRepository } from './user.repository';


@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10;

  constructor(private readonly userRepository: UserRepository) {}

  async createUser(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return this.toDomainUser(user);
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => this.toDomainUser(user));
  }

  async getUserById(id: string): Promise<User | undefined> {
    const user = await this.userRepository.findById(id);
    return user ? this.toDomainUser(user) : undefined;
  }

  async updateUser(
    id: string,
    name?: string,
    email?: string,
    password?: string
  ): Promise<User | undefined> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) return undefined;

    if (email && email !== existingUser.email) {
      const emailOwner = await this.userRepository.findByEmail(email);
      if (emailOwner && emailOwner.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    const updatePayload: Partial<{
      name: string;
      email: string;
      password: string;
    }> = {};

    if (name) updatePayload.name = name;
    if (email) updatePayload.email = email;
    if (password) {
      updatePayload.password = await bcrypt.hash(password, this.SALT_ROUNDS);
    }

    const updatedUser = await this.userRepository.update(id, updatePayload);
    return updatedUser ? this.toDomainUser(updatedUser) : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findByEmail(email);
    return user ? this.toDomainUser(user) : undefined;
  }

  async getUserByEmailWithPassword(
    email: string
  ): Promise<UserRecord | undefined> {
    const user = await this.userRepository.findByEmail(email);
    return user ?? undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }

  // Password operations
  async updatePassword(id: string, newPassword: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    const updated = await this.userRepository.update(id, {
      password: hashedPassword,
    });
    return !!updated;
  }

  async validatePassword(id: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    if (!user) return false;
    return bcrypt.compare(password, user.password);
  }

  private toDomainUser(user: UserRecord): User {
    return new User(
      user.id,
      user.name,
      user.email,
      '',
      user.createdAt,
      user.updatedAt
    );
  }
}
