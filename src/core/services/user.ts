import HttpResponse, { type ServiceResponse } from "../utils/http_response";
import Http from "./HttpService";

const { HttpService } = Http;

export type UserStatus = "pending" | "approved" | "rejected";

export interface User {
  id: number;
  username: string;
  name: string;
  isActive: boolean;
  lastLoginAt: string | null;
  status: UserStatus;
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
  name: string;
  /** Required for a new user. On update, null keeps the current password. */
  password: string | null;
  roleId: number;
  isActive: boolean;
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
