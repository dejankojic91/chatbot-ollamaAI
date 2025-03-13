export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
}
