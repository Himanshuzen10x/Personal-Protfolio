"use server";

import { db } from "@/lib/db";
import { profile, skills, projects, experience, education, contactMessages } from "@/lib/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ── Public Data Fetching ────────────────────────────────────────

export async function getProfile() {
  const results = await db.select().from(profile).limit(1);
  return results[0] || null;
}

export async function getSkills() {
  return db.select().from(skills).orderBy(asc(skills.category), asc(skills.displayOrder));
}

export async function getProjects() {
  return db.select().from(projects).orderBy(asc(projects.displayOrder));
}

export async function getFeaturedProjects() {
  return db.select().from(projects).where(eq(projects.featured, 1)).orderBy(asc(projects.displayOrder));
}

export async function getExperience() {
  return db.select().from(experience).orderBy(asc(experience.displayOrder));
}

export async function getEducation() {
  return db.select().from(education).orderBy(asc(education.displayOrder));
}

export async function getMessages() {
  return db.select().from(contactMessages).orderBy(desc(contactMessages.id));
}

export async function getUnreadMessageCount() {
  const results = await db.select().from(contactMessages).where(eq(contactMessages.isRead, 0));
  return results.length;
}

// ── Contact Form ────────────────────────────────────────────────

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Name, email, and message are required." };
  }

  try {
    await db.insert(contactMessages).values({
      name,
      email,
      subject: subject || null,
      message,
    });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Contact form error:", error);
    return { error: "Failed to send message. Please try again." };
  }
}

// ── Admin Actions (Protected) ───────────────────────────────────

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

// Profile
export async function updateProfile(formData: FormData) {
  await requireAuth();

  const data = {
    fullName: formData.get("fullName") as string,
    title: formData.get("title") as string,
    bio: formData.get("bio") as string,
    handle: formData.get("handle") as string,
    rating: parseInt(formData.get("rating") as string) || 0,
    rank: formData.get("rank") as string,
    location: formData.get("location") as string,
    githubUrl: formData.get("githubUrl") as string,
    linkedinUrl: formData.get("linkedinUrl") as string,
    resumeUrl: formData.get("resumeUrl") as string,
  };

  const existing = await db.select().from(profile).limit(1);
  if (existing.length > 0) {
    await db.update(profile).set(data).where(eq(profile.id, existing[0].id));
  } else {
    await db.insert(profile).values({ ...data, userId: 1 });
  }

  revalidatePath("/");
  revalidatePath("/admin/profile");
  return { success: true };
}

// Projects
export async function createProject(formData: FormData) {
  await requireAuth();

  await db.insert(projects).values({
    userId: 1,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    techStack: formData.get("techStack") as string,
    liveUrl: (formData.get("liveUrl") as string) || null,
    githubUrl: (formData.get("githubUrl") as string) || null,
    status: formData.get("status") as string || "completed",
    featured: formData.get("featured") === "on" ? 1 : 0,
    displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
  });

  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function updateProject(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);

  await db.update(projects).set({
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    techStack: formData.get("techStack") as string,
    liveUrl: (formData.get("liveUrl") as string) || null,
    githubUrl: (formData.get("githubUrl") as string) || null,
    status: formData.get("status") as string || "completed",
    featured: formData.get("featured") === "on" ? 1 : 0,
    displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
  }).where(eq(projects.id, id));

  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function deleteProject(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  return { success: true };
}

// Skills
export async function createSkill(formData: FormData) {
  await requireAuth();

  await db.insert(skills).values({
    userId: 1,
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    proficiency: parseInt(formData.get("proficiency") as string) || 0,
    displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
  });

  revalidatePath("/skills");
  revalidatePath("/admin/skills");
  return { success: true };
}

export async function updateSkill(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);

  await db.update(skills).set({
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    proficiency: parseInt(formData.get("proficiency") as string) || 0,
    displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
  }).where(eq(skills.id, id));

  revalidatePath("/skills");
  revalidatePath("/admin/skills");
  return { success: true };
}

export async function deleteSkill(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  await db.delete(skills).where(eq(skills.id, id));
  revalidatePath("/skills");
  revalidatePath("/admin/skills");
  return { success: true };
}

// Experience
export async function createExperience(formData: FormData) {
  await requireAuth();

  await db.insert(experience).values({
    userId: 1,
    company: formData.get("company") as string,
    role: formData.get("role") as string,
    description: formData.get("description") as string,
    startDate: formData.get("startDate") as string,
    endDate: (formData.get("endDate") as string) || null,
    location: formData.get("location") as string,
    displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
  });

  revalidatePath("/experience");
  revalidatePath("/admin/experience");
  return { success: true };
}

export async function updateExperience(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);

  await db.update(experience).set({
    company: formData.get("company") as string,
    role: formData.get("role") as string,
    description: formData.get("description") as string,
    startDate: formData.get("startDate") as string,
    endDate: (formData.get("endDate") as string) || null,
    location: formData.get("location") as string,
    displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
  }).where(eq(experience.id, id));

  revalidatePath("/experience");
  revalidatePath("/admin/experience");
  return { success: true };
}

export async function deleteExperience(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  await db.delete(experience).where(eq(experience.id, id));
  revalidatePath("/experience");
  revalidatePath("/admin/experience");
  return { success: true };
}

// Messages
export async function markMessageRead(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  const isRead = parseInt(formData.get("isRead") as string);
  await db.update(contactMessages).set({ isRead }).where(eq(contactMessages.id, id));
  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function deleteMessage(formData: FormData) {
  await requireAuth();
  const id = parseInt(formData.get("id") as string);
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");
  return { success: true };
}
