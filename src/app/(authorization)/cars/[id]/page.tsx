import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/core/constants/permission";
import CarDetail from "@/modules/Car/Detail";
import Page403 from "@/modules/Page403";

export const metadata = { title: "Car details" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PermissionWrapper permission={PERMISSIONS.CAR_VIEW} fallback={<Page403 />}>
      <CarDetail id={id} />
    </PermissionWrapper>
  );
}
