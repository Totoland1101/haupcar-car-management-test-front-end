import HttpResponse, { type ServiceResponse } from "../utils/http_response";
import Http from "./HttpService";

const { HttpService } = Http;

export interface User {
  id: number;
  username: string;
  name: string;
  isActive: boolean;
  lastLoginAt: string | null;
  role: { id: number; name: string };
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
