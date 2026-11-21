import HttpResponse, { type ServiceResponse } from "../utils/http_response";
import Http from "./HttpService";

const { HttpService } = Http;

export type CarSide = "front" | "left" | "right" | "back";

export const CAR_SIDES: { side: CarSide; label: string }[] = [
  { side: "front", label: "Front" },
  { side: "left", label: "Left side" },
  { side: "right", label: "Right side" },
  { side: "back", label: "Back" },
];

export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

export interface CarPhoto {
  side: CarSide;
  contentType: string;
  size: number;
  updatedAt: string;
}

const CarPhotoService = {
  findAll: async (carId: number): Promise<ServiceResponse<{ data: CarPhoto[] }>> => {
    try {
      const response = await HttpService.get<{ data: CarPhoto[] }>(`/cars/${carId}/photos`);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  // The API needs the login token, so the image is fetched here instead of by an <img> tag.
  fetchImage: async (carId: number, side: CarSide): Promise<ServiceResponse<Blob>> => {
    try {
      const response = await HttpService.getBlob(`/cars/${carId}/photos/${side}`);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  upload: async (carId: number, side: CarSide, file: Blob): Promise<ServiceResponse<CarPhoto>> => {
    try {
      const response = await HttpService.putFile<CarPhoto>(`/cars/${carId}/photos/${side}`, file);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
  delete: async (carId: number, side: CarSide): Promise<ServiceResponse<null>> => {
    try {
      const response = await HttpService.delete(`/cars/${carId}/photos/${side}`);
      return HttpResponse.success(response);
    } catch (error) {
      return HttpResponse.error(error);
    }
  },
};

export default CarPhotoService;
