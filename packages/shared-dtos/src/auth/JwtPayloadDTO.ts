/**
 * JWT Payload DTO - Data stored in the JWT token
 */
export class JwtPayloadDTO {
  sub: string; // User ID (subject)
  email: string;
  name: string;
  iat?: number; // Issued at
  exp?: number; // Expiration time

  constructor(sub: string, email: string, name: string) {
    this.sub = sub;
    this.email = email;
    this.name = name;
  }
}
