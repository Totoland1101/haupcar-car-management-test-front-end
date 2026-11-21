import { useCallback } from "react";
import { App } from "antd";
import { useDataContext } from "../context/DataContext";
import RegistrationService, { type RegistrationStatus } from "../services/registration";
import type { User } from "../services/user";
import type { ServiceResponse } from "../utils/http_response";

const namespace = "registration";

interface State {
  registrationList: User[];
  /** Also read by the sidebar to show how many people are waiting */
  counts: Record<RegistrationStatus, number>;
  loading: boolean;
}

const initialState: State = {
  registrationList: [],
  counts: { pending: 0, rejected: 0 },
  loading: false,
};

const useRegistration = () => {
  const { state, updateState } = useDataContext();
  const { message } = App.useApp();

  const { registrationList, counts, loading }: State = {
    ...initialState,
    ...(state[namespace] as Partial<State> | undefined),
  };

  const onChangeState = useCallback(
    (value: Partial<State>) => updateState(value, namespace),
    [updateState]
  );

  const fetchRegistrations = async (status: RegistrationStatus) => {
    onChangeState({ loading: true });
    const { success, data, error } = await RegistrationService.findAll(status);
    if (success) {
      onChangeState({ registrationList: data.data, counts: data.counts, loading: false });
    } else {
      onChangeState({ loading: false });
      message.error(error.message);
    }
  };

  // Only the counts, for the sidebar badge.
  const fetchCounts = async () => {
    const { success, data } = await RegistrationService.findAll("pending");
    if (success) onChangeState({ counts: data.counts });
  };

  const approve = async (user: User, roleId: number): Promise<ServiceResponse<User>> => {
    const response = await RegistrationService.approve(user.id, roleId);
    if (response.success) {
      message.success(`Approved ${user.username} as ${response.data.role?.name}`);
    } else {
      message.error(response.error.message);
    }
    return response;
  };

  const reject = async (user: User): Promise<boolean> => {
    const { success, error } = await RegistrationService.reject(user.id);
    if (success) {
      message.success(`Rejected ${user.username}`);
      return true;
    }
    message.error(error.message);
    return false;
  };

  return {
    registrationList,
    counts,
    loading,
    fetchRegistrations,
    fetchCounts,
    approve,
    reject,
  };
};

export default useRegistration;
