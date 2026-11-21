import { useCallback } from "react";
import { App } from "antd";
import { useDataContext } from "../context/DataContext";
import DepartmentService, { type DepartmentRow } from "../services/department";
import type { ServiceResponse } from "../utils/http_response";

const namespace = "department";

interface State {
  departmentList: DepartmentRow[];
  loading: boolean;
}

const initialState: State = {
  departmentList: [],
  loading: false,
};

const useDepartment = () => {
  const { state, updateState } = useDataContext();
  const { message } = App.useApp();

  const { departmentList, loading }: State = {
    ...initialState,
    ...(state[namespace] as Partial<State> | undefined),
  };

  const onChangeState = useCallback(
    (value: Partial<State>) => updateState(value, namespace),
    [updateState]
  );

  const fetchDepartments = async () => {
    onChangeState({ loading: true });
    const { success, data, error } = await DepartmentService.findAll();
    if (success) {
      onChangeState({ departmentList: data.data, loading: false });
    } else {
      onChangeState({ loading: false });
      message.error(error.message);
    }
  };

  const saveDepartment = async (id: number | null, name: string): Promise<ServiceResponse<DepartmentRow>> => {
    const response = id ? await DepartmentService.update(id, name) : await DepartmentService.create(name);
    if (response.success) {
      message.success(`${id ? "Saved" : "Added"} ${response.data.name}`);
    } else {
      message.error(response.error.message);
    }
    return response;
  };

  const deleteDepartment = async (department: DepartmentRow): Promise<boolean> => {
    const { success, error } = await DepartmentService.delete(department.id);
    if (success) {
      message.success(`Deleted ${department.name}`);
      return true;
    }
    message.error(error.message);
    return false;
  };

  return {
    departmentList,
    // For department pickers
    departmentOptions: departmentList.map((department) => ({ value: department.id, label: department.name })),
    loading,
    fetchDepartments,
    saveDepartment,
    deleteDepartment,
  };
};

export default useDepartment;
