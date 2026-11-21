import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/core/constants/permission";
import CarEdit from "@/modules/Car/Edit";
import Page403 from "@/modules/Page403";

export const metadata = { title: "Edit car" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PermissionWrapper permission={PERMISSIONS.CAR_UPDATE} fallback={<Page403 />}>
      <CarEdit id={id} />
    </PermissionWrapper>
  );
}
