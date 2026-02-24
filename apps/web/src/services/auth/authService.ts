import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LoginDTO, AuthResponseDTO, JwtPayloadDTO } from './types';

class AuthService {
  /**
   * Login with email and password
   * @param credentials - Email and password
   * @returns Auth response with token and user info
   */
  async login(credentials: LoginDTO): Promise<AuthResponseDTO> {
    const response = await api.post<AuthResponseDTO>('/auth/login', credentials);
    
    // Store token in AsyncStorage
    if (response.data.accessToken) {
      await AsyncStorage.setItem('authToken', response.data.accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  /**
   * Get current user profile
   * @returns User profile information
   */
  async getProfile(): Promise<JwtPayloadDTO> {
    const response = await api.get<JwtPayloadDTO>('/auth/profile');
    return response.data;
  }

  /**
   * Logout and clear stored credentials
   */
  async logout(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  }

  /**
   * Get stored auth token
   * @returns Auth token or null
   */
  async getStoredToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  }

  /**
   * Check if user is authenticated
   * @returns True if token exists
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getStoredToken();
    return !!token;
  }
}

export default new AuthService();
