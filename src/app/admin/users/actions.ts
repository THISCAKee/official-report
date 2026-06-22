"use server";

import { Prisma, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type CreateUserState = {
  error?: string;
  success?: string;
};

type DeleteUserState = {
  error?: string;
  success?: string;
};

type UpdateUserRoleState = {
  error?: string;
  success?: string;
};

const allowedRoles = new Set<Role>([
  Role.STAFF,
  Role.HEAD,
  Role.EXECUTIVE,
  Role.PERSONNEL,
  Role.ADMIN,
]);

export async function createUser(
  _prevState: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== Role.ADMIN) {
    return { error: "ไม่มีสิทธิ์สร้างผู้ใช้" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? Role.STAFF) as Role;

  if (!name || !username || !password) {
    return { error: "กรุณากรอกชื่อ ชื่อผู้ใช้ และรหัสผ่าน" };
  }

  if (username.length < 3) {
    return { error: "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร" };
  }

  if (password.length < 6) {
    return { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" };
  }

  if (!allowedRoles.has(role)) {
    return { error: "role ไม่ถูกต้อง" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (existingUser) {
    return { error: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      username,
      passwordHash,
      role,
    },
  });

  revalidatePath("/admin/users");

  return { success: `สร้างผู้ใช้ ${username} แล้ว` };
}

export async function deleteUser(
  _prevState: DeleteUserState,
  formData: FormData,
): Promise<DeleteUserState> {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== Role.ADMIN) {
    return { error: "ไม่มีสิทธิ์ลบผู้ใช้" };
  }

  const userId = Number(formData.get("userId"));

  if (!Number.isInteger(userId) || userId <= 0) {
    return { error: "ไม่พบผู้ใช้ที่ต้องการลบ" };
  }

  if (userId === currentUser.id) {
    return { error: "ไม่สามารถลบบัญชีที่กำลังใช้งานอยู่ได้" };
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      role: true,
    },
  });

  if (!targetUser) {
    return { error: "ไม่พบผู้ใช้ที่ต้องการลบ" };
  }

  if (targetUser.role === Role.ADMIN) {
    const adminCount = await prisma.user.count({
      where: { role: Role.ADMIN },
    });

    if (adminCount <= 1) {
      return { error: "ไม่สามารถลบผู้ดูแลระบบคนสุดท้ายได้" };
    }
  }

  try {
    await prisma.user.delete({
      where: { id: targetUser.id },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return {
        error:
          "ไม่สามารถลบผู้ใช้นี้ได้ เนื่องจากมีรายงานหรือข้อมูลอื่นที่เชื่อมโยงอยู่",
      };
    }

    throw error;
  }

  revalidatePath("/admin/users");

  return { success: `ลบผู้ใช้ ${targetUser.username} แล้ว` };
}

export async function updateUserRole(
  _prevState: UpdateUserRoleState,
  formData: FormData,
): Promise<UpdateUserRoleState> {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== Role.ADMIN) {
    return { error: "ไม่มีสิทธิ์ปรับสิทธิ์ผู้ใช้" };
  }

  const userId = Number(formData.get("userId"));
  const role = String(formData.get("role") ?? "") as Role;

  if (!Number.isInteger(userId) || userId <= 0) {
    return { error: "ไม่พบผู้ใช้ที่ต้องการปรับสิทธิ์" };
  }

  if (!allowedRoles.has(role)) {
    return { error: "role ไม่ถูกต้อง" };
  }

  if (userId === currentUser.id) {
    return { error: "ไม่สามารถปรับสิทธิ์บัญชีที่กำลังใช้งานอยู่ได้" };
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      role: true,
    },
  });

  if (!targetUser) {
    return { error: "ไม่พบผู้ใช้ที่ต้องการปรับสิทธิ์" };
  }

  if (targetUser.role === role) {
    return { success: `สิทธิ์ของ ${targetUser.name} เป็นค่านี้อยู่แล้ว` };
  }

  if (targetUser.role === Role.ADMIN && role !== Role.ADMIN) {
    const adminCount = await prisma.user.count({
      where: { role: Role.ADMIN },
    });

    if (adminCount <= 1) {
      return { error: "ไม่สามารถลดสิทธิ์ผู้ดูแลระบบคนสุดท้ายได้" };
    }
  }

  await prisma.user.update({
    where: { id: targetUser.id },
    data: { role },
  });

  revalidatePath("/admin/users");

  return { success: `ปรับสิทธิ์ของ ${targetUser.name} แล้ว` };
}
