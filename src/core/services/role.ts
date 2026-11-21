import type { PermissionCode } from "../constants/permission";
import HttpResponse, { type ServiceResponse } from "../utils/http_response";
import Http from "./HttpService";

const { HttpService } = Http;

export interface Role {
  id: number;
  name: string;
  description: string | null;
  /** The Admin role. It always has every permission and can't be changed or deleted. */
  isSystem: boolean;
  permissions: PermissionCode[];
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  code: PermissionCode;
  name: string;
  /** Group in the role form, e.g. "car" */
  module: string;
}

export interface RolePayload {
  name: string;
  description: string | null;
  permissions: PermissionCode[];
}

const RoleService = {
  findAll: async (): Promise<ServiceResponse<{ data: Role[] }>> => {
    try {
      const response = await HttpService.get<{ data: Role[] }>("/roles");
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  findPermissions: async (): Promise<ServiceResponse<{ data: Permission[] }>> => {
    try {
      const response = await HttpService.get<{ data: Permission[] }>("/permissions");
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  create: async (payload: RolePayload): Promise<ServiceResponse<Role>> => {
    try {
      const response = await HttpService.post<Role>("/roles", payload);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  update: async (id: number, payload: RolePayload): Promise<ServiceResponse<Role>> => {
    try {
      const response = await HttpService.put<Role>(`/roles/${id}`, payload);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  delete: async (id: number): Promise<ServiceResponse<null>> => {
    try {
      const response = await HttpService.delete(`/roles/${id}`);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
};

export default RoleService;
