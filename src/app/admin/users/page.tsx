import { Role } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { CreateUserForm } from "./create-user-form";

const roleLabels = {
  ADMIN: "ผู้ดูแลระบบ",
  STAFF: "บุคลากร",
  HEAD: "หัวหน้ากลุ่มงาน",
  EXECUTIVE: "ผู้บริหาร",
};

export default async function AdminUsersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/admin/users");
  }

  if (user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:py-8">
        <header className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 border-t-4 border-t-brand-gold">
          <div>
            <Link
              className="inline-flex h-9 items-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-brand-dark transition hover:border-brand-dark hover:bg-zinc-50"
              href="/dashboard"
            >
              กลับแดชบอร์ด
            </Link>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-brand-dark">จัดการผู้ใช้</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
              สร้างบัญชีและจัดการสิทธิ์การเข้าใช้งานระบบสำหรับบุคลากรภายในหน่วยงาน
            </p>
          </div>
        </header>

        <CreateUserForm />

        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between bg-zinc-50/50">
            <h2 className="text-base font-bold text-brand-dark">ผู้ใช้ทั้งหมด</h2>
            <p className="text-sm font-semibold text-zinc-500 bg-zinc-200/60 px-2.5 py-0.5 rounded-full">
              {users.length} บัญชี
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-600 border-b border-zinc-100">
                <tr>
                  <th className="px-5 py-3 font-semibold text-brand-dark">ชื่อ</th>
                  <th className="px-5 py-3 font-semibold text-brand-dark">ชื่อผู้ใช้</th>
                  <th className="px-5 py-3 font-semibold text-brand-dark">สิทธิ์</th>
                  <th className="px-5 py-3 font-semibold text-brand-dark">สถานะ</th>
                  <th className="px-5 py-3 font-semibold text-brand-dark">สร้างเมื่อ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.map((item) => (
                  <tr className="transition hover:bg-brand-gold/5" key={item.id}>
                    <td className="px-5 py-3.5 font-medium text-zinc-900">{item.name}</td>
                    <td className="px-5 py-3.5 text-zinc-600 font-mono">{item.username}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700">
                        {roleLabels[item.role]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex rounded-md bg-brand-gold/15 px-2.5 py-1 text-xs font-bold text-brand-gold-dark border border-brand-gold/25">
                        {item.isActive ? "ใช้งาน" : "ปิดใช้งาน"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500">
                      {new Intl.DateTimeFormat("th-TH", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(item.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
