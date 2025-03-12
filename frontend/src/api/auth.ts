import api from "@/utils/axiosInstance"
import { AuthResponse, LoginCredentials, RegisterCredentials,  } from "@/types/auth";

export const login = async (data: LoginCredentials): Promise<void> => {
  const response = await api.post<AuthResponse>("/auth/login", data)
  localStorage.setItem("accessToken", response.data.accessToken);
  api.defaults.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
}

export const registerUser = async (data: RegisterCredentials): Promise<void> => {
  const response = await api.post<AuthResponse>("/auth/register", data)
  localStorage.setItem("accessToken", response.data.accessToken);
  api.defaults.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
}

export const getAuthUser = async () => {
  const response = await api.get("/auth/user")
  return response.data
}

export const logoutUser = async () => {
  await api.post("/auth/logout")
}
