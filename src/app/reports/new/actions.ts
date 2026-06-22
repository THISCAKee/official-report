"use server";

import { ReportStatus } from "@prisma/client";
import type { TransportMode, TripPurpose } from "@prisma/client";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type FormState = {
  error?: string;
};

const purposeValues = new Set<string>([
  "MEETING",
  "TRAINING_SEMINAR",
  "STUDY_VISIT",
  "OTHER",
]);

const transportValues = new Set<string>([
  "AIRPLANE",
  "TRAIN",
  "BUS",
  "PRIVATE_CAR",
  "GOVERNMENT_CAR",
  "OTHER",
]);

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

function requiredText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function numberValue(formData: FormData, key: string) {
  const rawValue = String(formData.get(key) ?? "").trim();

  if (!rawValue) {
    return null;
  }

  const value = Number(rawValue);

  return Number.isFinite(value) ? value : null;
}

function integerValue(formData: FormData, key: string) {
  const value = numberValue(formData, key);

  return value === null ? null : Math.trunc(value);
}

function dateValue(formData: FormData, key: string) {
  const value = requiredText(formData, key);

  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function sumExpenses(formData: FormData) {
  const keys = [
    "allowanceAmount",
    "accommodationAmount",
    "transportAmount",
    "driverCompensationAmount",
    "registrationFeeAmount",
    "otherExpenseAmount",
  ];

  return keys.reduce((total, key) => total + (numberValue(formData, key) ?? 0), 0);
}

function reportData(formData: FormData, status: ReportStatus) {
  const purposeType = requiredText(formData, "purposeType");
  const transportMode = text(formData, "transportMode");
  const startDate = dateValue(formData, "startDate");
  const endDate = dateValue(formData, "endDate");
  const totalBudget = sumExpenses(formData);

  if (!startDate || !endDate) {
    return null;
  }

  return {
    title: requiredText(formData, "title"),
    objective: requiredText(formData, "objective"),
    location: requiredText(formData, "location"),
    province: text(formData, "province"),
    startDate,
    endDate,
    budget: totalBudget > 0 ? totalBudget : null,
    requesterPosition: text(formData, "requesterPosition"),
    companions: text(formData, "companions"),
    purposeType: purposeType as TripPurpose,
    purposeOther: text(formData, "purposeOther"),
    transportMode: transportMode ? (transportMode as TransportMode) : null,
    vehicleRegistration: text(formData, "vehicleRegistration"),
    driverName: text(formData, "driverName"),
    distanceKm: numberValue(formData, "distanceKm"),
    allowanceDays: integerValue(formData, "allowanceDays"),
    allowanceAmount: numberValue(formData, "allowanceAmount"),
    accommodationDays: integerValue(formData, "accommodationDays"),
    accommodationAmount: numberValue(formData, "accommodationAmount"),
    transportAmount: numberValue(formData, "transportAmount"),
    driverCompensationAmount: numberValue(formData, "driverCompensationAmount"),
    registrationFeeAmount: numberValue(formData, "registrationFeeAmount"),
    otherExpenseDetail: text(formData, "otherExpenseDetail"),
    otherExpenseAmount: numberValue(formData, "otherExpenseAmount"),
    totalBudgetText: text(formData, "totalBudgetText"),
    budgetSource: text(formData, "budgetSource"),
    budgetCategory: text(formData, "budgetCategory"),
    budgetProjectName: text(formData, "budgetProjectName"),
    status,
  };
}

export async function createTripReport(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "กรุณาเข้าสู่ระบบก่อนสร้างรายงาน" };
  }

  const title = requiredText(formData, "title");
  const objective = requiredText(formData, "objective");
  const location = requiredText(formData, "location");
  const startDate = dateValue(formData, "startDate");
  const endDate = dateValue(formData, "endDate");
  const purposeType = requiredText(formData, "purposeType");
  const transportMode = text(formData, "transportMode");
  const intent = requiredText(formData, "intent");
  const draftId = Number(formData.get("draftId"));

  if (!title || !objective || !location || !startDate || !endDate) {
    return { error: "กรุณากรอกเรื่อง วัตถุประสงค์ สถานที่ และวันที่เดินทางให้ครบ" };
  }

  if (endDate < startDate) {
    return { error: "วันที่สิ้นสุดต้องไม่อยู่ก่อนวันที่เริ่มเดินทาง" };
  }

  if (!purposeValues.has(purposeType)) {
    return { error: "ประเภทการเดินทางไม่ถูกต้อง" };
  }

  if (transportMode && !transportValues.has(transportMode)) {
    return { error: "ประเภทพาหนะไม่ถูกต้อง" };
  }

  const status = intent === "submit" ? ReportStatus.SUBMITTED : ReportStatus.DRAFT;
  const data = reportData(formData, status);

  if (!data) {
    return { error: "วันที่เดินทางไม่ถูกต้อง" };
  }

  if (Number.isInteger(draftId) && draftId > 0) {
    const draftReport = await prisma.tripReport.findFirst({
      where: {
        id: draftId,
        status: ReportStatus.DRAFT,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!draftReport) {
      return { error: "ไม่พบฉบับร่างที่ต้องการแก้ไข" };
    }

    await prisma.tripReport.update({
      where: { id: draftReport.id },
      data,
    });
  } else {
    await prisma.tripReport.create({
      data: {
        ...data,
        userId: user.id,
      },
    });
  }

  redirect("/dashboard");
}
