"use server";

import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type CreateUserState = {
  error?: string;
  success?: string;
};

const allowedRoles = new Set<Role>([
  Role.STAFF,
  Role.HEAD,
  Role.EXECUTIVE,
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

  if (password.length < 8) {
    return { error: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" };
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
