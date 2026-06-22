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
  const [showPassword, setShowPassword] = useState(false);

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
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-2" htmlFor="username">
          ชื่อผู้ใช้
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
            <svg className="h-5 w-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <input
            autoComplete="username"
            className="focus-ring-gold block h-12 w-full rounded-lg border border-zinc-300 bg-white pl-11 pr-4 text-sm text-zinc-950 placeholder-zinc-400 outline-none transition"
            id="username"
            name="username"
            placeholder="เช่น msu_staff"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-2" htmlFor="password">
          รหัสผ่าน
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
            <svg className="h-5 w-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <input
            autoComplete="current-password"
            className="focus-ring-gold block h-12 w-full rounded-lg border border-zinc-300 bg-white pl-11 pr-12 text-sm text-zinc-950 placeholder-zinc-400 outline-none transition"
            id="password"
            name="password"
            placeholder="••••••••"
            required
            type={showPassword ? "text" : "password"}
          />
          <button
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-brand-dark transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
          >
            {showPassword ? (
              <svg className="h-5 w-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className="h-5 w-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {error ? (
        <div className="flex gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 animate-fade-in">
          <svg className="h-5 w-5 stroke-current stroke-2 fill-none flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="font-medium">{error}</p>
        </div>
      ) : null}

      <button
        className="relative flex h-12 w-full items-center justify-center rounded-lg bg-brand-dark px-4 text-sm font-bold text-white shadow-lg shadow-zinc-800/10 transition-all duration-200 hover:bg-brand-dark-hover hover:text-brand-gold active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-400 border border-zinc-700/25"
        disabled={pending}
        type="submit"
      >
        {pending ? (
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 animate-spin text-brand-gold" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>กำลังเข้าสู่ระบบ...</span>
          </div>
        ) : (
          <span>เข้าสู่ระบบ</span>
        )}
      </button>
    </form>
  );
}

