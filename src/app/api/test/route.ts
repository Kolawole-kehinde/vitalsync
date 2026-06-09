import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const user = await prisma.user.create({
    data: {
      name: "Khenny",
      email: "khenny@test.com",
    },
  });

  return Response.json(user);
}