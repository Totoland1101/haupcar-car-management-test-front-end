import HttpResponse, { type ServiceResponse } from "../utils/http_response";
import Http from "./HttpService";

const { HttpService } = Http;

export type UserStatus = "pending" | "approved" | "rejected";

export interface Department {
  id: number;
  name: string;
}

/** Who the person is. Stored in haup_profiles, one row per user. */
export interface Profile {
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  jobTitle: string | null;
  department: Department | null;
}

export interface ProfilePayload {
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  jobTitle: string | null;
  departmentId: number | null;
}

export interface User {
  id: number;
  username: string;
  /** First and last name together, for display */
  name: string;
  isActive: boolean;
  lastLoginAt: string | null;
  status: UserStatus;
  profile: Profile;
  /** null for a registration that hasn't been approved yet */
  role: { id: number; name: string } | null;
  /** When the registration was approved or rejected, or the account was created by an admin */
  reviewedAt: string | null;
  reviewedBy: { id: number; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserPayload {
  username: string;
  /** Required for a new user. On update, null keeps the current password. */
  password: string | null;
  roleId: number;
  isActive: boolean;
  profile: ProfilePayload;
}

const UserService = {
  findAll: async (): Promise<ServiceResponse<{ data: User[] }>> => {
    try {
      const response = await HttpService.get<{ data: User[] }>("/users");
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  create: async (payload: UserPayload): Promise<ServiceResponse<User>> => {
    try {
      const response = await HttpService.post<User>("/users", payload);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  update: async (id: number, payload: UserPayload): Promise<ServiceResponse<User>> => {
    try {
      const response = await HttpService.put<User>(`/users/${id}`, payload);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  /** An admin setting a new password for someone else */
  resetPassword: async (id: number, password: string): Promise<ServiceResponse<null>> => {
    try {
      const response = await HttpService.put<null>(`/users/${id}/password`, { password });
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  delete: async (id: number): Promise<ServiceResponse<null>> => {
    try {
      const response = await HttpService.delete(`/users/${id}`);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
};

export default UserService;
