import CarDetail from "@/modules/Car/Detail";

export const metadata = { title: "Car details" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CarDetail id={id} />;
}
