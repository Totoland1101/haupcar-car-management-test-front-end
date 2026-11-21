import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/core/constants/permission";
import CarCreate from "@/modules/Car/Create";
import Page403 from "@/modules/Page403";

export const metadata = { title: "Add a car" };

export default function Page() {
  return (
    <PermissionWrapper permission={PERMISSIONS.CAR_CREATE} fallback={<Page403 />}>
      <CarCreate />
    </PermissionWrapper>
  );
}
