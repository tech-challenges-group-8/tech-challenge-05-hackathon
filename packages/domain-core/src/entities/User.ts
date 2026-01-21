/**
 * User Entity - Domain Core
 * Pure domain logic without any framework dependencies
 */
export class User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, name: string, email: string, createdAt: Date = new Date(), updatedAt: Date = new Date()) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  updateName(newName: string): void {
    if (newName.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    this.name = newName;
  }
}
