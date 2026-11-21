import { HttpError, type HttpResponseData } from "../services/HttpService";

export interface FieldError {
  field: string;
  message: string;
}

export interface ResponseError {
  /** 0 when the API could not be reached */
  status: number;
  message: string;
  /** Validation errors per form field. Empty for other errors. */
  details: FieldError[];
}

export type SuccessResponse<T> = { success: true; error: null; data: T };
export type FailureResponse = { success: false; error: ResponseError; data: null };
export type ServiceResponse<T> = SuccessResponse<T> | FailureResponse;

const HttpResponse = {
  success: <T>(res: HttpResponseData<T>): SuccessResponse<T> => {
    return { success: true, error: null, data: res.data };
  },
  // The API sends errors as { error: { message, details } }.
  error: (error: unknown): FailureResponse => {
    if (error instanceof HttpError) {
      const body = (error.data as { error?: Partial<ResponseError> } | null)?.error;
      return {
        success: false,
        data: null,
        error: {
          status: error.status,
          message: body?.message ?? error.message,
          details: body?.details ?? [],
        },
      };
    }
    return {
      success: false,
      data: null,
      error: {
        status: 0,
        message: error instanceof Error ? error.message : "Something went wrong",
        details: [],
      },
    };
  },
};

export default HttpResponse;
