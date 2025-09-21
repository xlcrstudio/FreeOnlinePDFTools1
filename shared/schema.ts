import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const files = pgTable("files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalName: text("original_name").notNull(),
  fileName: text("file_name").notNull(), // stored filename
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadPath: text("upload_path").notNull(),
  status: text("status").notNull().default("uploaded"), // uploaded, processing, completed, error
  metadata: jsonb("metadata"), // additional file info
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const processingJobs = pgTable("processing_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  operation: text("operation").notNull(), // merge, split, convert, etc.
  inputFiles: jsonb("input_files").notNull(), // array of file IDs
  outputFiles: jsonb("output_files"), // array of generated file info
  parameters: jsonb("parameters"), // operation-specific params
  status: text("status").notNull().default("pending"), // pending, processing, completed, error
  progress: integer("progress").default(0),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFileSchema = createInsertSchema(files).pick({
  originalName: true,
  fileName: true,
  fileType: true,
  fileSize: true,
  uploadPath: true,
  status: true,
  metadata: true,
});

export const insertProcessingJobSchema = createInsertSchema(processingJobs).pick({
  operation: true,
  inputFiles: true,
  outputFiles: true,
  parameters: true,
  status: true,
  progress: true,
  errorMessage: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;
export type InsertProcessingJob = z.infer<typeof insertProcessingJobSchema>;
export type ProcessingJob = typeof processingJobs.$inferSelect;
