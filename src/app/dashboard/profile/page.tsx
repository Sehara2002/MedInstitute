import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true, passwordHash: true },
  });

  const hasPassword = !!user?.passwordHash;

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