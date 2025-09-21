import { type User, type InsertUser, type File, type InsertFile, type ProcessingJob, type InsertProcessingJob } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // File operations
  createFile(file: InsertFile): Promise<File>;
  getFile(id: string): Promise<File | undefined>;
  updateFileStatus(id: string, status: string): Promise<void>;
  deleteFile(id: string): Promise<void>;
  
  // Processing job operations
  createProcessingJob(job: InsertProcessingJob): Promise<ProcessingJob>;
  getProcessingJob(id: string): Promise<ProcessingJob | undefined>;
  updateProcessingJob(id: string, updates: Partial<ProcessingJob>): Promise<void>;
  deleteProcessingJob(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private files: Map<string, File>;
  private processingJobs: Map<string, ProcessingJob>;

  constructor() {
    this.users = new Map();
    this.files = new Map();
    this.processingJobs = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // File operations
  async createFile(insertFile: InsertFile): Promise<File> {
    const id = randomUUID();
    const file: File = { 
      ...insertFile, 
      id, 
      status: insertFile.status || "uploaded",
      metadata: insertFile.metadata || null,
      createdAt: new Date() 
    };
    this.files.set(id, file);
    return file;
  }

  async getFile(id: string): Promise<File | undefined> {
    return this.files.get(id);
  }

  async updateFileStatus(id: string, status: string): Promise<void> {
    const file = this.files.get(id);
    if (file) {
      this.files.set(id, { ...file, status });
    }
  }

  async deleteFile(id: string): Promise<void> {
    this.files.delete(id);
  }
  
  // Processing job operations
  async createProcessingJob(insertJob: InsertProcessingJob): Promise<ProcessingJob> {
    const id = randomUUID();
    const job: ProcessingJob = { 
      ...insertJob, 
      id, 
      status: insertJob.status || "pending",
      progress: insertJob.progress || 0,
      errorMessage: insertJob.errorMessage || null,
      outputFiles: insertJob.outputFiles || null,
      parameters: insertJob.parameters || null,
      createdAt: new Date(),
      completedAt: null
    };
    this.processingJobs.set(id, job);
    return job;
  }

  async getProcessingJob(id: string): Promise<ProcessingJob | undefined> {
    return this.processingJobs.get(id);
  }

  async updateProcessingJob(id: string, updates: Partial<ProcessingJob>): Promise<void> {
    const job = this.processingJobs.get(id);
    if (job) {
      this.processingJobs.set(id, { ...job, ...updates });
    }
  }

  async deleteProcessingJob(id: string): Promise<void> {
    this.processingJobs.delete(id);
  }
}

export const storage = new MemStorage();
