import CarEdit from "@/modules/Car/Edit";

export const metadata = { title: "Edit car" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CarEdit id={id} />;
}
