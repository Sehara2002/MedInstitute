"use client";
import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { useRouter } from "next/navigation";

interface Props {
  initialName: string;
  email: string;
  hasPassword: boolean;
}

export function ProfileForm({ initialName, email, hasPassword }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  async function handleNameSave(e: React.FormEvent) {
    e.preventDefault();
    setSavingName(true);
    setNameMsg("");
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setSavingName(false);
    if (res.ok) {
      setNameMsg("Saved!");
      router.refresh();
    } else {
      setNameMsg("Failed to save. Try again.");
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMsg("");
    setPasswordErr("");

    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setSavingPassword(false);

    if (res.ok) {
      setPasswordMsg("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } else {
      setPasswordErr(data.error || "Failed to update password");
    }
  }

  return (
    <div className="space-y-6">
      <GlassCard className="p-6" variant="panel">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Account Details</h2>
        <form onSubmit={handleNameSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white/60 focus:outline-none focus:ring-2 focus:ring-medical-green-200 focus:border-medical-green-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              value={email}
              disabled
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-gray-100 text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
          </div>
          <button
            type="submit"
            disabled={savingName}
            className="px-5 py-2.5 rounded-xl bg-medical-green-600 text-white font-semibold hover:bg-medical-green-500 transition-colors disabled:opacity-60"
          >
            {savingName ? "Saving..." : "Save Changes"}
          </button>
          {nameMsg && <p className="text-sm text-gray-600">{nameMsg}</p>}
        </form>
      </GlassCard>

      {hasPassword ? (
        <GlassCard className="p-6" variant="panel">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                required
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white/60 focus:outline-none focus:ring-2 focus:ring-medical-green-200 focus:border-medical-green-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                required
                minLength={6}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white/60 focus:outline-none focus:ring-2 focus:ring-medical-green-200 focus:border-medical-green-500 transition"
              />
            </div>
            {passwordErr && <p className="text-sm text-red-600">{passwordErr}</p>}
            {passwordMsg && <p className="text-sm text-medical-green-700">{passwordMsg}</p>}
            <button
              type="submit"
              disabled={savingPassword}
              className="px-5 py-2.5 rounded-xl bg-medical-green-600 text-white font-semibold hover:bg-medical-green-500 transition-colors disabled:opacity-60"
            >
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        </GlassCard>
      ) : (
        <GlassCard className="p-6" variant="panel">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Sign-in Method</h2>
          <p className="text-sm text-gray-600">
            You're signed in with Google. Password changes aren't applicable to your account.
          </p>
        </GlassCard>
      )}
    </div>
  );
}