/**
 * Auth Response DTO - Response payload after successful authentication
 */
export class AuthResponseDTO {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    name: string;
    email: string;
  };

  constructor(
    accessToken: string,
    user: { id: string; name: string; email: string },
    expiresIn: number = 3600,
    tokenType: string = 'Bearer'
  ) {
    this.accessToken = accessToken;
    this.tokenType = tokenType;
    this.expiresIn = expiresIn;
    this.user = user;
  }
}
