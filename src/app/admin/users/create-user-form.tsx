"use client";

import { useActionState } from "react";

import { createUser } from "./actions";

const roles = [
  ["STAFF", "บุคลากร"],
  ["HEAD", "หัวหน้ากลุ่มงาน"],
  ["EXECUTIVE", "ผู้บริหาร"],
  ["PERSONNEL", "งานบุคคล"],
  ["ADMIN", "ผู้ดูแลระบบ"],
] as const;

export function CreateUserForm() {
  const [state, action, pending] = useActionState(createUser, {});

  return (
    <form
      action={action}
      className="grid gap-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:grid-cols-2"
    >
      <div className="md:col-span-2 border-b border-zinc-100 pb-3">
        <h2 className="text-base font-bold text-zinc-900 tracking-tight">เพิ่มบัญชีผู้ใช้ใหม่</h2>
        <p className="text-xs text-zinc-500 font-light mt-0.5">กรอกข้อมูลผู้ใช้งานเพื่อขึ้นทะเบียนในระบบ</p>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-2" htmlFor="name">
          ชื่อ-สกุล
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
            <svg className="h-4.5 w-4.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <input
            className="focus-ring-gold block h-11 w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-4 text-sm text-zinc-950 placeholder-zinc-400 outline-none transition"
            id="name"
            name="name"
            placeholder="เช่น สมชาย ใจดี"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-2" htmlFor="username">
          ชื่อผู้ใช้ (Username)
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
            <svg className="h-4.5 w-4.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <input
            className="focus-ring-gold block h-11 w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-4 text-sm text-zinc-950 placeholder-zinc-450 outline-none transition"
            id="username"
            name="username"
            placeholder="เช่น somch_j (อังกฤษเท่านั้น)"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-2" htmlFor="password">
          รหัสผ่านเริ่มต้น
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
            <svg className="h-4.5 w-4.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <input
            className="focus-ring-gold block h-11 w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-4 text-sm text-zinc-950 placeholder-zinc-400 outline-none transition"
            id="password"
            minLength={6}
            name="password"
            placeholder="อย่างน้อย 6 ตัวอักษร"
            required
            type="password"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 block mb-2" htmlFor="role">
          สิทธิ์การเข้าถึง (Role)
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
            <svg className="h-4.5 w-4.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <select
            className="focus-ring-gold block h-11 w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-10 text-sm text-zinc-950 outline-none transition appearance-none cursor-pointer"
            defaultValue="STAFF"
            id="role"
            name="role"
          >
            {roles.map(([value, label]) => (
              <option key={value} value={value}>
                 {label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-450">
            <svg className="h-4 w-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div className="md:col-span-2 border-t border-zinc-50 pt-3">
        {state.error ? (
          <div className="mb-4 flex gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 animate-fade-in">
            <svg className="h-5 w-5 stroke-current stroke-2 fill-none flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-medium">{state.error}</p>
          </div>
        ) : null}
        
        {state.success ? (
          <div className="mb-4 flex gap-2.5 rounded-lg border border-emerald-250 bg-emerald-50 p-3 text-sm text-emerald-700 animate-fade-in">
            <svg className="h-5 w-5 stroke-current stroke-2 fill-none flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-medium">{state.success}</p>
          </div>
        ) : null}

        <button
          className="relative flex h-11 items-center justify-center rounded-xl bg-brand-dark px-5 text-sm font-bold text-white shadow-md transition duration-205 hover:bg-brand-dark-hover hover:text-brand-gold active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-400 border border-zinc-700/25 cursor-pointer"
          disabled={pending}
          type="submit"
        >
          {pending ? (
            <div className="flex items-center gap-2">
              <svg className="h-4.5 w-4.5 animate-spin text-brand-gold" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>กำลังสร้างบัญชี...</span>
            </div>
          ) : (
            <span>สร้างผู้ใช้งาน</span>
          )}
        </button>
      </div>
    </form>
  );
}
