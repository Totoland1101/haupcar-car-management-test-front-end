import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/core/constants/permission";
import CarList from "@/modules/Car/List";
import Page403 from "@/modules/Page403";

export default function Page() {
  return (
    <PermissionWrapper permission={PERMISSIONS.CAR_VIEW} fallback={<Page403 />}>
      <CarList />
    </PermissionWrapper>
  );
}
