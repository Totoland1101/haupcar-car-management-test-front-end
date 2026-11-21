import { useCallback } from "react";
import { App } from "antd";
import { useDataContext } from "../context/DataContext";
import RoleService from "../services/role";
import UserService, { type User, type UserPayload } from "../services/user";
import type { ServiceResponse } from "../utils/http_response";

const namespace = "user";

interface State {
  userList: User[];
  loading: boolean;
  /** For the role dropdown in the user form */
  roleOptions: { value: number; label: string }[];
}

const initialState: State = {
  userList: [],
  loading: false,
  roleOptions: [],
};

const useUser = () => {
  const { state, updateState } = useDataContext();
  const { message } = App.useApp();

  const { userList, loading, roleOptions }: State = {
    ...initialState,
    ...(state[namespace] as Partial<State> | undefined),
  };

  const onChangeState = useCallback(
    (value: Partial<State>) => updateState(value, namespace),
    [updateState]
  );

  const fetchUsers = async () => {
    onChangeState({ loading: true });
    const { success, data, error } = await UserService.findAll();
    if (success) {
      onChangeState({ userList: data.data, loading: false });
    } else {
      onChangeState({ loading: false });
      message.error(error.message);
    }
  };

  const fetchRoleOptions = async () => {
    const { success, data } = await RoleService.findAll();
    if (success) {
      onChangeState({ roleOptions: data.data.map((role) => ({ value: role.id, label: role.name })) });
    }
  };

  const saveUser = async (id: number | null, payload: UserPayload): Promise<ServiceResponse<User>> => {
    const response = id ? await UserService.update(id, payload) : await UserService.create(payload);
    if (response.success) {
      message.success(`${id ? "Saved" : "Added"} ${response.data.username}`);
    } else {
      message.error(response.error.message);
    }
    return response;
  };

  const resetPassword = async (user: User, password: string): Promise<ServiceResponse<null>> => {
    const response = await UserService.resetPassword(user.id, password);
    if (response.success) message.success(`Set a new password for ${user.username}`);
    else message.error(response.error.message);
    return response;
  };

  const deleteUser = async (user: User): Promise<boolean> => {
    const { success, error } = await UserService.delete(user.id);
    if (success) {
      message.success(`Deleted ${user.username}`);
      return true;
    }
    message.error(error.message);
    return false;
  };

  return {
    userList,
    loading,
    roleOptions,
    fetchUsers,
    fetchRoleOptions,
    saveUser,
    resetPassword,
    deleteUser,
  };
};

export default useUser;
