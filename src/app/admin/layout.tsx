import Link from "next/link";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar userName={session.user.name || "Admin"} />
      <div className="admin-content">{children}</div>
    </div>
  );
}
