import HttpResponse, { type ServiceResponse } from "../utils/http_response";
import Http from "./HttpService";

const { HttpService } = Http;

export type CarStatus = "available" | "in_use" | "maintenance" | "inactive";
export type FuelType = "gasoline" | "diesel" | "hybrid" | "plug_in_hybrid" | "electric" | "lpg" | "ngv";

export interface Car {
  id: number;
  registrationNumber: string;
  /** A temporary red plate (ป้ายแดง) for a car that isn't registered yet */
  redPlate: boolean;
  province: string;
  brand: string;
  model: string;
  /** null only for cars added before the field existed */
  fuelType: FuelType | null;
  year: number | null;
  color: string | null;
  /** Current reading, in kilometres */
  mileage: number | null;
  /** YYYY-MM-DD, the day the car was registered in the system */
  registeredOn: string;
  /** Kilometres on the day the car was registered */
  registeredMileage: number | null;
  status: CarStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CarPayload = Omit<Car, "id" | "createdAt" | "updatedAt" | "registeredOn"> & {
  /** null lets the API use today */
  registeredOn: string | null;
};

export type CarListParams = {
  search?: string;
  status?: CarStatus;
  brand?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export interface CarListResult {
  data: Car[];
  meta: { page: number; pageSize: number; total: number };
}

export interface CarSummary {
  total: number;
  byStatus: Record<CarStatus, number>;
  /** Every brand in use, sorted */
  brands: string[];
}

const CarService = {
  findAll: async (params?: CarListParams): Promise<ServiceResponse<CarListResult>> => {
    try {
      const response = await HttpService.get<CarListResult>("/cars", { params });
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  summary: async (): Promise<ServiceResponse<CarSummary>> => {
    try {
      const response = await HttpService.get<CarSummary>("/cars/summary");
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  findOne: async (id: number | string): Promise<ServiceResponse<Car>> => {
    try {
      const response = await HttpService.get<Car>(`/cars/${encodeURIComponent(id)}`);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  create: async (payload: CarPayload): Promise<ServiceResponse<Car>> => {
    try {
      const response = await HttpService.post<Car>("/cars", payload);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  update: async (id: number, payload: CarPayload): Promise<ServiceResponse<Car>> => {
    try {
      const response = await HttpService.put<Car>(`/cars/${id}`, payload);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  delete: async (id: number): Promise<ServiceResponse<null>> => {
    try {
      const response = await HttpService.delete(`/cars/${id}`);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
};

export default CarService;
