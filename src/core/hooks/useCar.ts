import { useCallback, useRef } from "react";
import { App } from "antd";
import { useDataContext } from "../context/DataContext";
import CarService, {
  type Car,
  type CarListParams,
  type CarPayload,
  type CarSummary,
} from "../services/car";
import type { ResponseError, ServiceResponse } from "../utils/http_response";
import { DEFAULT_LIST_QUERY, type ListQuery } from "../utils/listQuery";

const namespace = "car";

interface State {
  /** Search, filters, sorting and page of the car list */
  listQuery: ListQuery;
  carList: Car[];
  total: number;
  summary: CarSummary | null;
  carDetail: Car | null;
  detailError: ResponseError | null;
  loadingList: boolean;
  loadingDetail: boolean;
}

const initialState: State = {
  listQuery: DEFAULT_LIST_QUERY,
  carList: [],
  total: 0,
  summary: null,
  carDetail: null,
  detailError: null,
  loadingList: false,
  loadingDetail: false,
};

const useCar = () => {
  const { state, updateState } = useDataContext();
  // The static `message` API ignores the light/dark theme, so use the one from App.useApp().
  const { message } = App.useApp();
  // Only the newest request may write its result. Older ones can finish late when filters change quickly.
  const listRequestID = useRef(0);
  const detailRequestID = useRef(0);

  const {
    listQuery,
    carList,
    total,
    summary,
    carDetail,
    detailError,
    loadingList,
    loadingDetail,
  }: State = { ...initialState, ...(state[namespace] as Partial<State> | undefined) };

  const onChangeState = useCallback(
    (value: Partial<State>) => updateState(value, namespace),
    [updateState]
  );

  const setListQuery = (query: ListQuery) => onChangeState({ listQuery: query });

  // Called by the menu and the logo, so going to Cars starts on the first page.
  const goToFirstPage = () => onChangeState({ listQuery: { ...listQuery, page: 1 } });

  const fetchCarList = async (params: CarListParams) => {
    const requestID = ++listRequestID.current;
    onChangeState({ loadingList: true });
    const { success, data, error } = await CarService.findAll(params);
    if (requestID !== listRequestID.current) return;

    if (success) {
      onChangeState({ carList: data.data, total: data.meta.total, loadingList: false });
    } else {
      onChangeState({ loadingList: false });
      message.error(error.message);
    }
  };

  const fetchSummary = async () => {
    const { success, data } = await CarService.summary();
    // On failure the list request already shows the connection error.
    if (success) onChangeState({ summary: data });
  };

  const fetchCarDetail = async (id: number | string) => {
    const requestID = ++detailRequestID.current;
    onChangeState({ carDetail: null, detailError: null, loadingDetail: true });
    const { success, data, error } = await CarService.findOne(id);
    if (requestID !== detailRequestID.current) return;

    onChangeState({ carDetail: data, detailError: error, loadingDetail: false });
  };

  const createCar = async (payload: CarPayload): Promise<ServiceResponse<Car>> => {
    const response = await CarService.create(payload);
    if (response.success) {
      message.success(`Added ${response.data.registrationNumber} (${response.data.province})`);
    } else {
      message.error(response.error.message);
    }
    return response;
  };

  const updateCar = async (id: number, payload: CarPayload): Promise<ServiceResponse<Car>> => {
    const response = await CarService.update(id, payload);
    if (response.success) {
      onChangeState({ carDetail: response.data });
      message.success(`Saved ${response.data.registrationNumber} (${response.data.province})`);
    } else {
      message.error(response.error.message);
    }
    return response;
  };

  const deleteCar = async (car: Car): Promise<boolean> => {
    const { success, error } = await CarService.delete(car.id);
    if (success) {
      message.success(`Deleted ${car.registrationNumber} (${car.province})`);
      return true;
    }
    message.error(error.message);
    return false;
  };

  return {
    listQuery,
    setListQuery,
    goToFirstPage,
    carList,
    total,
    summary,
    carDetail,
    detailError,
    loadingList,
    loadingDetail,
    fetchCarList,
    fetchSummary,
    fetchCarDetail,
    createCar,
    updateCar,
    deleteCar,
  };
};

export default useCar;
