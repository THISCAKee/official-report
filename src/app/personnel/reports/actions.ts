"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

type DeleteReportState = {
  error?: string;
  success?: string;
};

export async function deleteTripReport(
  _prevState: DeleteReportState,
  formData: FormData,
): Promise<DeleteReportState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
  }

  // Only ADMIN and PERSONNEL are allowed to delete reports
  if (currentUser.role !== Role.ADMIN && currentUser.role !== Role.PERSONNEL) {
    return { error: "คุณไม่มีสิทธิ์ในการลบรายงานนี้" };
  }

  const reportId = Number(formData.get("reportId"));

  if (!Number.isInteger(reportId) || reportId <= 0) {
    return { error: "ไม่พบรายงานที่ต้องการลบ" };
  }

  const report = await prisma.tripReport.findUnique({
    where: { id: reportId },
    select: { id: true, title: true },
  });

  if (!report) {
    return { error: "ไม่พบรายงานที่ต้องการลบ" };
  }

  try {
    await prisma.tripReport.delete({
      where: { id: reportId },
    });
  } catch (error) {
    console.error("Failed to delete report:", error);
    return { error: "เกิดข้อผิดพลาดในการลบรายงาน" };
  }

  revalidatePath("/personnel/reports");

  return { success: `ลบรายงาน "${report.title}" เรียบร้อยแล้ว` };
}
