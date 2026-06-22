"use client";

import { useActionState, useState } from "react";

import { deleteUser, updateUserRole } from "./actions";

const roleLabels = {
  ADMIN: "ผู้ดูแลระบบ",
  STAFF: "บุคลากร",
  HEAD: "หัวหน้ากลุ่มงาน",
  EXECUTIVE: "ผู้บริหาร",
  PERSONNEL: "งานบุคคล",
};

const roleColors = {
  ADMIN: "bg-brand-gold/15 text-brand-gold-dark border border-brand-gold/30",
  STAFF: "bg-zinc-100 text-zinc-700 border border-zinc-200",
  HEAD: "bg-indigo-50 text-indigo-700 border border-indigo-150",
  EXECUTIVE: "bg-blue-50 text-blue-700 border border-blue-150",
  PERSONNEL: "bg-emerald-50 text-emerald-700 border border-emerald-150",
};

const roles = [
  ["STAFF", "บุคลากร"],
  ["HEAD", "หัวหน้ากลุ่มงาน"],
  ["EXECUTIVE", "ผู้บริหาร"],
  ["PERSONNEL", "งานบุคคล"],
  ["ADMIN", "ผู้ดูแลระบบ"],
] as const;

interface User {
  id: number;
  name: string;
  username: string;
  role: "ADMIN" | "STAFF" | "HEAD" | "EXECUTIVE" | "PERSONNEL";
  isActive: boolean;
  createdAt: Date | string;
}

interface UserListProps {
  currentUserId: number;
  initialUsers: User[];
}

export function UserList({ currentUserId, initialUsers }: UserListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = initialUsers.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.name.toLowerCase().includes(query) ||
      item.username.toLowerCase().includes(query) ||
      roleLabels[item.role].toLowerCase().includes(query)
    );
  });

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm flex flex-col">
      {/* Search Header */}
      <div className="flex flex-col gap-4 border-b border-zinc-150 px-6 py-4.5 sm:flex-row sm:items-center sm:justify-between bg-zinc-50/50">
        <div>
          <h2 className="text-base font-bold text-zinc-900 tracking-tight">รายชื่อผู้ใช้ระบบ</h2>
          <p className="text-xs text-zinc-500 font-light mt-0.5">ค้นหาและจัดการสิทธิ์ของแต่ละบุคคล</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <svg className="h-4 w-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <input
              className="focus-ring-gold block h-10 w-full rounded-xl border border-zinc-250 bg-white pl-9 pr-4 text-xs placeholder-zinc-400 outline-none transition"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อ, ชื่อผู้ใช้, หรือบทบาท..."
              type="text"
              value={searchQuery}
            />
          </div>

          <span className="text-xs font-bold text-zinc-500 bg-zinc-200/60 px-3 py-1 rounded-full flex-shrink-0">
            {filteredUsers.length} บัญชี
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        {filteredUsers.length > 0 ? (
          <table className="w-full min-w-[840px] text-left text-sm border-collapse">
            <thead className="bg-zinc-50 text-zinc-600 border-b border-zinc-100">
              <tr>
                <th className="px-6 py-3.5 font-bold text-zinc-700 text-xs uppercase tracking-wider">ชื่อ-นามสกุล</th>
                <th className="px-6 py-3.5 font-bold text-zinc-700 text-xs uppercase tracking-wider">ชื่อผู้ใช้ (Username)</th>
                <th className="px-6 py-3.5 font-bold text-zinc-700 text-xs uppercase tracking-wider">สิทธิ์การเข้าถึง</th>
                <th className="px-6 py-3.5 font-bold text-zinc-700 text-xs uppercase tracking-wider">สถานะบัญชี</th>
                <th className="px-6 py-3.5 font-bold text-zinc-700 text-xs uppercase tracking-wider">ลงทะเบียนเมื่อ</th>
                <th className="px-6 py-3.5 text-right font-bold text-zinc-700 text-xs uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredUsers.map((item) => {
                const date = typeof item.createdAt === "string" ? new Date(item.createdAt) : item.createdAt;
                return (
                  <tr className="transition duration-150 hover:bg-zinc-50/70" key={item.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-brand-dark font-bold text-xs border border-zinc-200">
                          {item.name[0]?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-zinc-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-650 font-mono text-xs">{item.username}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold ${roleColors[item.role]}`}>
                        {roleLabels[item.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.isActive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-250/30 px-2.5 py-1 text-xs font-bold text-emerald-700 shadow-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          เปิดใช้งาน
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-50 border border-zinc-200 px-2.5 py-1 text-xs font-bold text-zinc-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-350" />
                          ปิดใช้งาน
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 text-xs">
                      {new Intl.DateTimeFormat("th-TH", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(date)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex min-w-56 flex-col items-end gap-3">
                        <UpdateRoleForm
                          currentRole={item.role}
                          isCurrentUser={item.id === currentUserId}
                          name={item.name}
                          userId={item.id}
                        />
                        <DeleteUserForm
                          isCurrentUser={item.id === currentUserId}
                          name={item.name}
                          userId={item.id}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 border border-zinc-200 mb-4.5">
              <svg className="h-6 w-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 4h.01" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-zinc-800">ไม่พบรายชื่อผู้ใช้ที่ค้นหา</h3>
            <p className="text-xs text-zinc-500 font-light mt-1.5 max-w-xs">
              ลองตรวจทานการสะกดชื่อ ชื่อผู้ใช้ หรือลองค้นหาด้วยคำสำคัญอื่นๆ อีกครั้ง
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function UpdateRoleForm({
  currentRole,
  isCurrentUser,
  name,
  userId,
}: {
  currentRole: User["role"];
  isCurrentUser: boolean;
  name: string;
  userId: number;
}) {
  const [state, action, pending] = useActionState(updateUserRole, {});

  return (
    <form
      action={action}
      className="flex w-full flex-col items-end gap-1.5"
      onSubmit={(event) => {
        if (isCurrentUser) {
          event.preventDefault();
          return;
        }

        if (!window.confirm(`ยืนยันปรับสิทธิ์ของ ${name}?`)) {
          event.preventDefault();
        }
      }}
    >
      <input name="userId" type="hidden" value={userId} />
      <div className="flex w-full items-center justify-end gap-2">
        <select
          className="focus-ring-gold h-9 min-w-36 rounded-lg border border-zinc-250 bg-white px-2.5 text-xs font-semibold text-zinc-700 outline-none disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400"
          defaultValue={currentRole}
          disabled={pending || isCurrentUser}
          name="role"
          title={isCurrentUser ? "ไม่สามารถปรับสิทธิ์บัญชีที่กำลังใช้งานอยู่ได้" : "เลือกสิทธิ์ใหม่"}
        >
          {roles.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-250 bg-white px-3 text-xs font-bold text-zinc-700 transition hover:border-brand-gold hover:bg-brand-gold-light disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-50 disabled:text-zinc-400"
          disabled={pending || isCurrentUser}
          type="submit"
        >
          {pending ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </div>
      {state.error ? (
        <p className="max-w-56 text-right text-xs font-medium text-red-600">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="max-w-56 text-right text-xs font-medium text-emerald-700">{state.success}</p>
      ) : null}
    </form>
  );
}

function DeleteUserForm({
  isCurrentUser,
  name,
  userId,
}: {
  isCurrentUser: boolean;
  name: string;
  userId: number;
}) {
  const [state, action, pending] = useActionState(deleteUser, {});

  return (
    <form
      action={action}
      className="flex flex-col items-end gap-1.5"
      onSubmit={(event) => {
        if (isCurrentUser) {
          event.preventDefault();
          return;
        }

        if (!window.confirm(`ยืนยันลบผู้ใช้ ${name}?`)) {
          event.preventDefault();
        }
      }}
    >
      <input name="userId" type="hidden" value={userId} />
      <button
        className="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 bg-white px-3 text-xs font-bold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-50 disabled:text-zinc-400"
        disabled={pending || isCurrentUser}
        title={isCurrentUser ? "ไม่สามารถลบบัญชีที่กำลังใช้งานอยู่ได้" : "ลบผู้ใช้"}
        type="submit"
      >
        {pending ? "กำลังลบ..." : "ลบ"}
      </button>
      {state.error ? (
        <p className="max-w-48 text-right text-xs font-medium text-red-600">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="max-w-48 text-right text-xs font-medium text-emerald-700">{state.success}</p>
      ) : null}
    </form>
  );
}
