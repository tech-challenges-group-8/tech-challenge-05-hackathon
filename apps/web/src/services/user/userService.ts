import api from '../api';
import type { User, CreateUserDTO, UpdateUserDTO } from './types';

class UserService {
  /**
   * Create a new user
   * @param userData - User creation data
   * @returns Created user
   */
  async createUser(userData: CreateUserDTO): Promise<User> {
    const response = await api.post<User>('/users', userData);
    return response.data;
  }

  /**
   * Get user by ID
   * @param id - User ID
   * @returns User information
   */
  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  }

  /**
   * Update user information
   * @param id - User ID
   * @param userData - User data to update
   * @returns Updated user
   */
  async updateUser(id: string, userData: UpdateUserDTO): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  }

  /**
   * Update user password
   * @param id - User ID
   * @param newPassword - New password
   * @returns Success status
   */
  async updatePassword(id: string, newPassword: string): Promise<{ success: boolean }> {
    const response = await api.put<{ success: boolean }>(`/users/${id}/password`, {
      newPassword,
    });
    return response.data;
  }
}

export default new UserService();
