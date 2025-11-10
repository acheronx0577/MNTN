import ProfileForm from "@/components/account/ProfileForm";
import { requireAuth } from "@/lib/auth";

export const metadata = {
  title: "Account | MNTN",
};

export default async function AccountPage() {
  const user = await requireAuth();

  return (
    <>
      <h1 className="account-welcome">Your account</h1>
      <ProfileForm user={user} />
    </>
  );
}
