import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  /**
   * Update current user profile (name)
   * @param data - Profile data to update
   * @returns Updated user
   */
  async updateProfile(data: { name?: string; email?: string }): Promise<User> {
    const storedUser = await AsyncStorage.getItem('user');
    if (!storedUser) throw new Error('User not found');

    const user = JSON.parse(storedUser) as User;
    const response = await api.put<User>(`/users/${user.id}`, data);

    // Update stored user info
    if (response.data) {
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  }

  /**
   * Change current user password
   * @param currentPassword - Current password for verification
   * @param newPassword - New password
   * @returns Success status
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean }> {
    const storedUser = await AsyncStorage.getItem('user');
    if (!storedUser) throw new Error('User not found');

    const user = JSON.parse(storedUser) as User;
    const response = await api.put<{ success: boolean }>(`/users/${user.id}/password`, {
      currentPassword,
      newPassword,
    });

    return response.data;
  }
}

export default new UserService();
