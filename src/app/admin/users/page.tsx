import { Role } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { CreateUserForm } from "./create-user-form";
import { UserList } from "./user-list";

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
    <main className="min-h-screen bg-zinc-50/50 text-zinc-900 pb-12 selection:bg-brand-gold selection:text-brand-dark">
      {/* Ambient top glow */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-brand-dark/[0.02] to-transparent pointer-events-none" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:py-10 animate-fade-in-up">
        
        {/* Modern Header Banner */}
        <header className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-md shadow-zinc-200/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-gold" />
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-zinc-250 bg-white px-3.5 text-xs font-bold text-zinc-700 shadow-sm transition hover:border-brand-dark hover:bg-zinc-50 active:scale-[0.98]"
                href="/dashboard"
              >
                <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                กลับไปแดชบอร์ด
              </Link>
              <h1 className="mt-4.5 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
                จัดการบัญชีผู้ใช้งาน
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-500 font-light">
                สร้างผู้ใช้ใหม่ กำหนดสิทธิ์ตามบทบาทหน้าที่ (Staff, Head, Executive, Admin) และตรวจสอบการใช้งานของสมาชิก
              </p>
            </div>
          </div>
        </header>

        {/* User Registration Form Card */}
        <CreateUserForm />

        {/* Dynamic Interactive User Directory */}
        <UserList currentUserId={user.id} initialUsers={users} />

      </div>
    </main>
  );
}
