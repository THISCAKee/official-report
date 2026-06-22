import { ReportStatus } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/sign-out-button";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const roleLabels = {
  ADMIN: "ผู้ดูแลระบบ",
  STAFF: "บุคลากร",
  HEAD: "หัวหน้ากลุ่มงาน",
  EXECUTIVE: "ผู้บริหาร",
  PERSONNEL: "งานบุคคล",
};

const roleColors = {
  ADMIN: "bg-brand-gold/15 text-brand-gold-dark border-brand-gold/30",
  STAFF: "bg-zinc-100 text-zinc-700 border-zinc-200",
  HEAD: "bg-indigo-50 text-indigo-700 border-indigo-100",
  EXECUTIVE: "bg-blue-50 text-blue-700 border-blue-100",
  PERSONNEL: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
  }).format(value);
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function formatBudget(value: { toString(): string } | number | null) {
  if (value === null) {
    return "-";
  }

  return `${Number(value).toLocaleString("th-TH", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })} บาท`;
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  // Get user initials for avatar
  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";
  const userRole = user.role as keyof typeof roleLabels;
  const draftReports = await prisma.tripReport.findMany({
    where: {
      status: ReportStatus.DRAFT,
      userId: user.id,
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      location: true,
      province: true,
      startDate: true,
      endDate: true,
      budget: true,
      updatedAt: true,
    },
  });

  return (
    <main className="min-h-screen bg-zinc-50/50 text-zinc-900 pb-12 selection:bg-brand-gold selection:text-brand-dark">
      {/* Decorative top ambient glow */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-brand-dark/[0.03] to-transparent pointer-events-none" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:py-10 animate-fade-in-up">
        
        {/* Modern Premium Header Banner */}
        <header className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-md shadow-zinc-200/40 relative">
          {/* Accent Gold top bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-brand-dark via-brand-gold to-amber-500" />
          
          <div className="flex flex-col gap-6 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-8">
            <div className="flex items-center gap-4.5">
              {/* Profile Initials Avatar */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-dark to-zinc-700 text-brand-gold font-bold text-xl shadow-inner border border-zinc-700/20">
                {initials}
              </div>
              
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-2.5 py-0.5 text-xs font-bold tracking-wide text-brand-gold-dark">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse" />
                  ระบบรายงานไปราชการ
                </span>
                <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
                  {user.name}
                </h1>
                <p className="mt-1 text-sm text-zinc-500 flex items-center gap-2">
                  บทบาท:
                  <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-bold ${roleColors[userRole]}`}>
                    {roleLabels[userRole]}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-5 sm:border-t-0 sm:pt-0">
              {userRole === "ADMIN" ? (
                <Link
                  className="flex h-11 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-bold text-zinc-700 shadow-sm transition hover:border-brand-dark hover:bg-zinc-50 active:scale-[0.98]"
                  href="/admin/users"
                >
                  <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  จัดการผู้ใช้
                </Link>
              ) : null}
              {userRole === "ADMIN" || userRole === "PERSONNEL" ? (
                <Link
                  className="flex h-11 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-bold text-zinc-700 shadow-sm transition hover:border-emerald-600 hover:bg-emerald-50 active:scale-[0.98]"
                  href="/personnel/reports"
                >
                  <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  รายงานงานบุคคล
                </Link>
              ) : null}
              <SignOutButton />
            </div>
          </div>

          {/* Stat Widgets with Icons */}
          <div className="grid gap-4 border-t border-zinc-100 bg-zinc-50/50 px-6 py-5 sm:grid-cols-3 sm:px-8">
            <div className="flex items-center gap-4 rounded-xl border border-zinc-200/50 bg-white p-4 shadow-xs hover:shadow-sm transition duration-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">สถานะบัญชี</p>
                <p className="mt-0.5 text-sm font-bold text-emerald-600">พร้อมใช้งาน</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-zinc-200/50 bg-white p-4 shadow-xs hover:shadow-sm transition duration-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold-dark border border-brand-gold/20">
                <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 7a2 2 0 012 2m-5-4a5 5 0 015 5m-5-5a5 5 0 00-5 5m5-5V3m5 6h2m-2 0a5 5 0 01-5 5M9 9H7m2 0a5 5 0 005 5m-5 5v2m5-7a5 5 0 01-5 5m5-5H7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">สิทธิ์การเข้าถึง</p>
                <p className="mt-0.5 text-sm font-bold text-zinc-800">{roleLabels[userRole]}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-zinc-200/50 bg-white p-4 shadow-xs hover:shadow-sm transition duration-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">ระดับการอนุมัติรายงาน</p>
                <p className="mt-0.5 text-sm font-bold text-zinc-800">2 ระดับ (กลุ่มงาน & ผู้บริหาร)</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Action Section */}
        <section className="grid gap-6 md:grid-cols-3">
          
          {/* Card 1: My Reports */}
          <Link
            className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-gold/60 flex flex-col justify-between min-h-[220px]"
            href="/reports/new"
          >
            <div>
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-dark text-brand-gold group-hover:scale-110 transition-transform duration-300 shadow-md shadow-brand-dark/10">
                <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-zinc-950 tracking-tight">รายงานของฉัน</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 font-light">
                ระบบจัดการและส่งข้อมูลเอกสารรายงานไปราชการของคุณ รองรับประวัติและการดาวน์โหลดเอกสาร
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-brand-dark group-hover:text-brand-gold-dark transition-colors">
              <span>เปิดแบบฟอร์มขออนุมัติ</span>
              <span className="flex items-center gap-1">
                เปิดระบบ
                <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Card 2: Approval Queue */}
          <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-gold/60 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold-dark group-hover:scale-110 transition-transform duration-300 border border-brand-gold/25 shadow-sm">
                <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-zinc-950 tracking-tight">การตรวจสอบและอนุมัติ</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 font-light">
                สำหรับหัวหน้าและผู้บริหารในการติดตามคิวงานเพื่อพิจารณาความเหมาะสมและลงมติอนุมัติรายงาน
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-brand-dark group-hover:text-brand-gold-dark transition-colors">
              <span>เร็วๆ นี้: คิวอนุมัติบทบาท</span>
              <span className="flex items-center gap-1">
                เปิดระบบ
                <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </div>

          {/* Card 3: System Status */}
          <div className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-gold/60 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800 group-hover:scale-110 transition-transform duration-300 border border-zinc-200/60 shadow-sm">
                <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-zinc-950 tracking-tight">สถานะระบบการทำงาน</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 font-light">
                ภาพรวมการเชื่อมต่อฐานข้อมูล การตรวจสอบสิทธิ์ และสิทธิ์งานบุคคลสำหรับดูรายงานที่ส่งเข้ามา
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-zinc-500">
              <span>Database, Role & Personnel: Active</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-zinc-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-gold-dark">
                Draft Reports
              </p>
              <h2 className="mt-1 text-lg font-extrabold text-zinc-950">
                ฉบับร่างของฉัน
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                รายงานที่บันทึกไว้แต่ยังไม่ได้ส่งเข้าระบบอนุมัติ
              </p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">
              {draftReports.length} รายการ
            </span>
          </div>

          {draftReports.length > 0 ? (
            <div className="divide-y divide-zinc-100">
              {draftReports.map((report) => (
                <article
                  className="grid gap-4 px-6 py-5 transition hover:bg-brand-gold-light/50 lg:grid-cols-[1fr_auto]"
                  key={report.id}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-bold text-zinc-600">
                        แบบร่าง
                      </span>
                      <span className="text-xs font-medium text-zinc-400">
                        แก้ไขล่าสุด {formatDateTime(report.updatedAt)}
                      </span>
                    </div>
                    <h3 className="mt-3 text-base font-bold text-zinc-950">
                      {report.title}
                    </h3>
                    <dl className="mt-3 grid gap-3 text-sm text-zinc-600 sm:grid-cols-3">
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                          สถานที่
                        </dt>
                        <dd className="mt-1 font-semibold text-zinc-800">
                          {report.location}
                          {report.province ? `, ${report.province}` : ""}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                          วันที่เดินทาง
                        </dt>
                        <dd className="mt-1 font-semibold text-zinc-800">
                          {formatDate(report.startDate)} - {formatDate(report.endDate)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                          งบประมาณรวม
                        </dt>
                        <dd className="mt-1 font-semibold text-zinc-800">
                          {formatBudget(report.budget)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="flex items-center lg:justify-end">
                    <Link
                      className="inline-flex h-10 items-center rounded-xl border border-zinc-250 bg-white px-4 text-xs font-bold text-zinc-700 shadow-sm transition hover:border-brand-gold hover:bg-brand-gold-light"
                      href={`/reports/new?draftId=${report.id}`}
                    >
                      เปิดดูฉบับร่าง
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex min-h-44 flex-col items-center justify-center px-6 py-10 text-center">
              <h3 className="text-sm font-bold text-zinc-800">
                ยังไม่มีฉบับร่างที่บันทึกไว้
              </h3>
              <p className="mt-1.5 max-w-md text-sm leading-6 text-zinc-500">
                เมื่อคุณกดบันทึกแบบร่างจากแบบฟอร์มขออนุมัติ รายการจะแสดงในส่วนนี้
              </p>
              <Link
                className="mt-4 inline-flex h-10 items-center rounded-xl bg-brand-dark px-4 text-xs font-bold text-white shadow-sm transition hover:bg-brand-dark-hover hover:text-brand-gold"
                href="/reports/new"
              >
                สร้างรายงานใหม่
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
