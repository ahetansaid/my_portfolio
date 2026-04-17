import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const deleted = await prisma.timelineItem.deleteMany({
    where: { year: { in: ["2022", "2023", "2024", "2026"] } },
  });
  console.log("Deleted old timeline items:", deleted.count);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
