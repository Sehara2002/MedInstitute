"use client";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AuthGateModal } from "@/components/AuthGateModal";

interface Props {
  courseId: string;
  requiresAccount?: boolean;
  courseTitle: string;
}

export function RegisterButton({ courseId, requiresAccount, courseTitle }: Props) {
  const { data: session, status } = useSession();
  const [showGate, setShowGate] = useState(false);

  const href = `/register?id=${encodeURIComponent(courseId)}`;
  const className =
    "block w-full text-center py-3 rounded-xl bg-medical-green-600 text-white font-semibold shadow-sm hover:bg-medical-green-700 transition-colors";

  const needsGate = requiresAccount && status !== "loading" && !session?.user;

  if (needsGate) {
    return (
      <>
        <button onClick={() => setShowGate(true)} className={className}>
          Register / Inquire
        </button>
        {showGate && (
          <AuthGateModal courseTitle={courseTitle} onClose={() => setShowGate(false)} />
        )}
      </>
    );
  }

  return (
    <Link href={href} className={className}>
      Register / Inquire
    </Link>
  );
}
