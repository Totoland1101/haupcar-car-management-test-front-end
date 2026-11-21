import HttpResponse, { type ServiceResponse } from "../utils/http_response";
import Http from "./HttpService";

const { HttpService } = Http;

export interface DepartmentRow {
  id: number;
  name: string;
  /** How many people have this department on their profile */
  userCount: number;
}

const DepartmentService = {
  findAll: async (): Promise<ServiceResponse<{ data: DepartmentRow[] }>> => {
    try {
      const response = await HttpService.get<{ data: DepartmentRow[] }>("/departments");
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  create: async (name: string): Promise<ServiceResponse<DepartmentRow>> => {
    try {
      const response = await HttpService.post<DepartmentRow>("/departments", { name });
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  update: async (id: number, name: string): Promise<ServiceResponse<DepartmentRow>> => {
    try {
      const response = await HttpService.put<DepartmentRow>(`/departments/${id}`, { name });
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  delete: async (id: number): Promise<ServiceResponse<null>> => {
    try {
      const response = await HttpService.delete(`/departments/${id}`);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
};

export default DepartmentService;
