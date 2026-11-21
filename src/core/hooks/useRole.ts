import { useCallback } from "react";
import { App } from "antd";
import { useDataContext } from "../context/DataContext";
import RoleService, { type Permission, type Role, type RolePayload } from "../services/role";
import type { ServiceResponse } from "../utils/http_response";

const namespace = "role";

interface State {
  roleList: Role[];
  permissionList: Permission[];
  loading: boolean;
}

const initialState: State = {
  roleList: [],
  permissionList: [],
  loading: false,
};

const useRole = () => {
  const { state, updateState } = useDataContext();
  const { message } = App.useApp();

  const { roleList, permissionList, loading }: State = {
    ...initialState,
    ...(state[namespace] as Partial<State> | undefined),
  };

  const onChangeState = useCallback(
    (value: Partial<State>) => updateState(value, namespace),
    [updateState]
  );

  const fetchRoles = async () => {
    onChangeState({ loading: true });
    const { success, data, error } = await RoleService.findAll();
    if (success) {
      onChangeState({ roleList: data.data, loading: false });
    } else {
      onChangeState({ loading: false });
      message.error(error.message);
    }
  };

  const fetchPermissions = async () => {
    const { success, data } = await RoleService.findPermissions();
    if (success) onChangeState({ permissionList: data.data });
  };

  const saveRole = async (id: number | null, payload: RolePayload): Promise<ServiceResponse<Role>> => {
    const response = id ? await RoleService.update(id, payload) : await RoleService.create(payload);
    if (response.success) {
      message.success(`${id ? "Saved" : "Added"} the ${response.data.name} role`);
    } else {
      message.error(response.error.message);
    }
    return response;
  };

  const deleteRole = async (role: Role): Promise<boolean> => {
    const { success, error } = await RoleService.delete(role.id);
    if (success) {
      message.success(`Deleted the ${role.name} role`);
      return true;
    }
    message.error(error.message);
    return false;
  };

  return {
    roleList,
    permissionList,
    loading,
    fetchRoles,
    fetchPermissions,
    saveRole,
    deleteRole,
  };
};

export default useRole;
