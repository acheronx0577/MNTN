import AccountNav from "@/components/account/AccountNav";
import { requireAuth } from "@/lib/auth";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <div className="page-shell">
      <div className="page-shell-inner container account-layout">
        <AccountNav userName={user.name ?? user.email} />
        <div className="account-content">{children}</div>
      </div>
    </div>
  );
}
