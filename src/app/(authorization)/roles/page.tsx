import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/core/constants/permission";
import Page403 from "@/modules/Page403";
import RoleList from "@/modules/Role";

export const metadata = { title: "Roles" };

export default function Page() {
  return (
    <PermissionWrapper permission={PERMISSIONS.ROLE_MANAGE} fallback={<Page403 />}>
      <RoleList />
    </PermissionWrapper>
  );
}
