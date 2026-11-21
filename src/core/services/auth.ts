import type { PermissionCode } from "../constants/permission";
import HttpResponse, { type ServiceResponse } from "../utils/http_response";
import Http from "./HttpService";
import type { Profile, ProfilePayload } from "./user";

const { HttpService } = Http;

export interface AuthUser {
  id: number;
  username: string;
  name: string;
  isActive: boolean;
  lastLoginAt: string | null;
  role: { id: number; name: string };
  profile: Profile;
  permissions: PermissionCode[];
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

export interface RegisterPayload {
  username: string;
  password: string;
  profile: Pick<ProfilePayload, "firstName" | "lastName" | "email" | "phone">;
}

const AuthService = {
  register: async (payload: RegisterPayload): Promise<ServiceResponse<{ message: string }>> => {
    try {
      const response = await HttpService.post<{ message: string }>("/auth/register", payload);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  login: async (payload: { username: string; password: string }): Promise<ServiceResponse<LoginResult>> => {
    try {
      const response = await HttpService.post<LoginResult>("/auth/login", payload);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  /** The logged-in user editing their own details */
  updateMyProfile: async (payload: ProfilePayload): Promise<ServiceResponse<AuthUser>> => {
    try {
      const response = await HttpService.put<AuthUser>("/auth/me/profile", payload);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  me: async (): Promise<ServiceResponse<AuthUser>> => {
    try {
      const response = await HttpService.get<AuthUser>("/auth/me");
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
};

export default AuthService;
