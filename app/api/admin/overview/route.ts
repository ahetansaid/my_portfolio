import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const [
    projects,
    projectsPublished,
    technologies,
    services,
    testimonials,
    testimonialsPublished,
    playground,
    messages,
    messagesUnread,
    bookings,
    bookingsPending,
    skillCategories,
    skillItems,
    timelineItems,
    aboutValues,
    documents,
    availability,
    lastMessages,
    lastBookings,
    lastProjects,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { isPublished: true } }),
    prisma.technology.count(),
    prisma.service.count(),
    prisma.testimonial.count(),
    prisma.testimonial.count({ where: { isPublished: true } }),
    prisma.playgroundItem.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.skillCategory.count(),
    prisma.skillItem.count(),
    prisma.timelineItem.count(),
    prisma.aboutValue.count(),
    prisma.document.count(),
    prisma.availabilityStatus.findFirst(),
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, subject: true, createdAt: true, isRead: true },
    }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, topic: true, status: true, createdAt: true },
    }),
    prisma.project.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true, slug: true, isPublished: true, updatedAt: true },
    }),
  ]);

  return NextResponse.json({
    counts: {
      projects: { total: projects, published: projectsPublished },
      technologies: { total: technologies },
      services: { total: services },
      testimonials: { total: testimonials, published: testimonialsPublished },
      playground: { total: playground },
      messages: { total: messages, unread: messagesUnread },
      bookings: { total: bookings, pending: bookingsPending },
      skills: { categories: skillCategories, items: skillItems },
      about: { timeline: timelineItems, values: aboutValues },
      documents: { total: documents },
    },
    availability: availability
      ? {
          status: availability.status,
          message: availability.message,
          updatedAt: availability.updatedAt,
        }
      : null,
    recent: {
      messages: lastMessages,
      bookings: lastBookings,
      projects: lastProjects,
    },
  });
}
