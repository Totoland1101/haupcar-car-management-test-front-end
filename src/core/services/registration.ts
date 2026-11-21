import HttpResponse, { type ServiceResponse } from "../utils/http_response";
import Http from "./HttpService";
import type { User } from "./user";

const { HttpService } = Http;

export type RegistrationStatus = "pending" | "rejected";

export interface RegistrationList {
  data: User[];
  counts: Record<RegistrationStatus, number>;
}

const RegistrationService = {
  findAll: async (status: RegistrationStatus): Promise<ServiceResponse<RegistrationList>> => {
    try {
      const response = await HttpService.get<RegistrationList>("/registrations", { params: { status } });
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  approve: async (id: number, roleId: number): Promise<ServiceResponse<User>> => {
    try {
      const response = await HttpService.post<User>(`/registrations/${id}/approve`, { roleId });
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  reject: async (id: number): Promise<ServiceResponse<User>> => {
    try {
      const response = await HttpService.post<User>(`/registrations/${id}/reject`);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
};

export default RegistrationService;
