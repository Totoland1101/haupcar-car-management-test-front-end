import AppLayout from "@/components/Layouts";
import { PrivateProvider } from "@/core/context/PrivateProvider";

// Every page in this group needs a logged-in user.
export default function AuthorizedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PrivateProvider>
      <AppLayout>{children}</AppLayout>
    </PrivateProvider>
  );
}
