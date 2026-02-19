/**
 * User Response DTO - Shared across Frontend and Backend
 */
export class UserResponseDTO {
  id: string;
  name: string;
  email: string;
  createdAt: string;

  constructor(id: string, name: string, email: string, createdAt: Date) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt.toISOString();
  }
}
