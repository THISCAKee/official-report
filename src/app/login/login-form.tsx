"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl,
    });

    setPending(false);

    if (!result?.ok) {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    router.push(result.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-semibold text-zinc-800" htmlFor="username">
          ชื่อผู้ใช้
        </label>
        <input
          autoComplete="username"
          className="mt-2 h-12 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/20"
          id="username"
          name="username"
          required
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-zinc-800" htmlFor="password">
          รหัสผ่าน
        </label>
        <input
          autoComplete="current-password"
          className="mt-2 h-12 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/20"
          id="password"
          name="password"
          required
          type="password"
        />
      </div>
      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <button
        className="h-12 w-full rounded-md bg-brand-dark px-4 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-brand-dark-hover hover:text-brand-gold active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-400 border border-zinc-700/30"
        disabled={pending}
        type="submit"
      >
        {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}
