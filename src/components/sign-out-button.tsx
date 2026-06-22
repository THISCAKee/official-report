"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      className="flex h-11 items-center gap-2 rounded-xl bg-zinc-100 px-5 text-sm font-bold text-zinc-700 shadow-sm border border-zinc-200 transition duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-[0.98] cursor-pointer"
      onClick={() => signOut({ callbackUrl: "/login" })}
      type="button"
    >
      <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      ออกจากระบบ
    </button>
  );
}

