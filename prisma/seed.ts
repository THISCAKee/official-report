import "dotenv/config";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL ?? "");
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("admin1234", 10);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      name: "System Admin",
      username: "admin",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
