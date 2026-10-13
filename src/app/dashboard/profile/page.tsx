import { auth } from "@/auth";
import { getUser } from "@/lib/websiteUsers";
import { ProfileForm } from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const user = await getUser(userId);

  const hasPassword = !!user?.hasPassword;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
      <p className="text-gray-600 mb-8">Manage your account details.</p>
      <ProfileForm
        initialName={user?.name || ""}
        email={user?.email || ""}
        hasPassword={hasPassword}
      />
    </div>
  );
}