import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/core/constants/permission";
import Approval from "@/modules/Approval";
import Page403 from "@/modules/Page403";

export const metadata = { title: "Approvals" };

export default function Page() {
  return (
    <PermissionWrapper permission={PERMISSIONS.USER_APPROVE} fallback={<Page403 />}>
      <Approval />
    </PermissionWrapper>
  );
}
