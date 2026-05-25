"use client";

import { useActionState } from "react";

import { createUser } from "./actions";

const roles = [
  ["STAFF", "บุคลากร"],
  ["HEAD", "หัวหน้ากลุ่มงาน"],
  ["EXECUTIVE", "ผู้บริหาร"],
  ["ADMIN", "ผู้ดูแลระบบ"],
] as const;

export function CreateUserForm() {
  const [state, action, pending] = useActionState(createUser, {});

  return (
    <form
      action={action}
      className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm md:grid-cols-2"
    >
      <div>
        <label className="text-sm font-semibold text-zinc-800" htmlFor="name">
          ชื่อ-สกุล
        </label>
        <input
          className="mt-2 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/20"
          id="name"
          name="name"
          required
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-zinc-800" htmlFor="username">
          ชื่อผู้ใช้
        </label>
        <input
          className="mt-2 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/20"
          id="username"
          name="username"
          required
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-zinc-800" htmlFor="password">
          รหัสผ่านเริ่มต้น
        </label>
        <input
          className="mt-2 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/20"
          id="password"
          minLength={8}
          name="password"
          required
          type="password"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-zinc-800" htmlFor="role">
          สิทธิ์
        </label>
        <select
          className="mt-2 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/20"
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
      </div>
      <div className="md:col-span-2">
        {state.error ? (
          <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className="mb-3 rounded-md border border-brand-gold/30 bg-brand-gold/10 px-3 py-2 text-sm font-semibold text-brand-gold-dark">
            {state.success}
          </p>
        ) : null}
        <button
          className="h-11 rounded-md bg-brand-dark px-5 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-brand-dark-hover hover:text-brand-gold active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-400 border border-zinc-700/30"
          disabled={pending}
          type="submit"
        >
          {pending ? "กำลังสร้าง..." : "สร้างผู้ใช้"}
        </button>
      </div>
    </form>
  );
}
