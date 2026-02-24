export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface JwtPayloadDTO {
  sub: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}
