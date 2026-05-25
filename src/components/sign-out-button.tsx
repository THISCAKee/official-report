"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      className="h-10 rounded-md bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700"
      onClick={() => signOut({ callbackUrl: "/login" })}
      type="button"
    >
      ออกจากระบบ
    </button>
  );
}
