import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const profile = sqliteTable("profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  fullName: text("full_name").notNull(),
  title: text("title"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  handle: text("handle"),
  rating: integer("rating").default(0),
  rank: text("rank").default("newbie"),
  location: text("location"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  resumeUrl: text("resume_url"),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
});

export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  category: text("category"),
  proficiency: integer("proficiency").default(0),
  displayOrder: integer("display_order").default(0),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  techStack: text("tech_stack"),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  imageUrl: text("image_url"),
  status: text("status").default("completed"),
  featured: integer("featured").default(0),
  displayOrder: integer("display_order").default(0),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const experience = sqliteTable("experience", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  company: text("company").notNull(),
  role: text("role").notNull(),
  description: text("description"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  location: text("location"),
  displayOrder: integer("display_order").default(0),
});

export const education = sqliteTable("education", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  field: text("field"),
  startYear: integer("start_year"),
  endYear: integer("end_year"),
  gpa: text("gpa"),
  displayOrder: integer("display_order").default(0),
});

export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  isRead: integer("is_read").default(0),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});
