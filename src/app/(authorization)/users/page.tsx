import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/core/constants/permission";
import Page403 from "@/modules/Page403";
import UserList from "@/modules/User";

export const metadata = { title: "Users" };

export default function Page() {
  return (
    <PermissionWrapper permission={PERMISSIONS.USER_MANAGE} fallback={<Page403 />}>
      <UserList />
    </PermissionWrapper>
  );
}
