"use client";
import Link from "next/link";
import { X } from "lucide-react";

interface Props {
  courseTitle: string;
  onClose: () => void;
}

export function AuthGateModal({ courseTitle, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Create a free account first</h3>
        <p className="text-sm text-gray-600 mb-6">
          You need to sign up to register for <span className="font-semibold">{courseTitle}</span>.
          It only takes a minute, and you'll get instant access to your student dashboard.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/signup"
            className="w-full py-3 rounded-xl bg-medical-green-600 text-white font-semibold hover:bg-medical-green-500 transition-colors"
          >
            Sign Up Free
          </Link>
          <Link
            href="/login"
            className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            I already have an account — Log In
          </Link>
        </div>
      </div>
    </div>
  );
}