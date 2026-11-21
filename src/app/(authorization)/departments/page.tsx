import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/core/constants/permission";
import DepartmentList from "@/modules/Department";
import Page403 from "@/modules/Page403";

export const metadata = { title: "Departments" };

export default function Page() {
  return (
    <PermissionWrapper permission={PERMISSIONS.USER_MANAGE} fallback={<Page403 />}>
      <DepartmentList />
    </PermissionWrapper>
  );
}
