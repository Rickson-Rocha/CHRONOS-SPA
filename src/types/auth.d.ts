
export interface LoginCredentials {
  email: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile extends LoginCredentials {
  id: number;
  name: string;
  role: 'ROLE_MANAGER' | 'ROLE_EMPLOYEE';
}

export interface LoginResponse extends UserProfile {
  token: AuthToken;
}