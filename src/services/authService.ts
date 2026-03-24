import { apiService } from "./apiService";

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  statusCode: number;
  message: string;
  data?: {
    access_token?: string;
    user?: {
      id: number;
      username: string;
      email: string;
    };
  };
}

class AuthService {
  async register(dto: RegisterDto) {
    return apiService.post<AuthResponse>({
      url: "/api/v1/auth/signup",
      dto,
    });
  }

  async login(dto: LoginDto) {
    return apiService.post<AuthResponse>({
      url: "/api/v1/auth/login",
      dto,
    });
  }
}

export const authService = new AuthService();
