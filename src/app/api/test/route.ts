import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  const user = await prisma.user.create({
    data: {
      name: "Khenny",
      email: "khenny@test.com",
    },
  });

  return NextResponse.json(user);
}