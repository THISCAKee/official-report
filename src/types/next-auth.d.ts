import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      username: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    username: string;
    role: Role;
  }
}
