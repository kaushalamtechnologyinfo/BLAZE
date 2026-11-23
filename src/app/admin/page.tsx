import { getData } from "@/lib/db";
import AdminApp from "@/components/admin/AdminApp";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getData();
  return <AdminApp initial={data} />;
}
