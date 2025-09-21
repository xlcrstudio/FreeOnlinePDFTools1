import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { storage } from "./storage";
import { insertFileSchema, insertProcessingJobSchema } from "@shared/schema";
import { z } from "zod";
import { processFiles } from "./pdf-operations";
import { toolSlugs } from "@shared/tools";

// Validation schemas
const processJobSchema = z.object({
  operation: z.string().min(1),
  inputFiles: z.array(z.string().uuid()),
  parameters: z.record(z.any()).optional()
});

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");

// Ensure upload directory exists
const ensureUploadDir = async () => {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
};

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'text/html'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not supported`));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  await ensureUploadDir();

  // File upload endpoint
  app.post("/api/upload", upload.array("files", 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files provided" });
      }

      const uploadedFiles = [];

      for (const file of files) {
        // Validate file data before storage
        const fileData = {
          originalName: file.originalname,
          fileName: file.filename,
          fileType: file.mimetype,
          fileSize: file.size,
          uploadPath: file.path,
          status: "uploaded",
          metadata: {
            encoding: file.encoding,
            fieldname: file.fieldname
          }
        };

        const validatedData = insertFileSchema.parse(fileData);
        const fileRecord = await storage.createFile(validatedData);

        uploadedFiles.push({
          id: fileRecord.id,
          originalName: fileRecord.originalName,
          fileType: fileRecord.fileType,
          fileSize: fileRecord.fileSize,
          status: fileRecord.status
        });
      }

      res.json({
        success: true,
        files: uploadedFiles
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ 
        error: "Failed to upload files",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get file info
  app.get("/api/files/:id", async (req, res) => {
    try {
      const file = await storage.getFile(req.params.id);
      
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      res.json({
        id: file.id,
        originalName: file.originalName,
        fileType: file.fileType,
        fileSize: file.fileSize,
        status: file.status,
        createdAt: file.createdAt
      });
    } catch (error) {
      console.error("Get file error:", error);
      res.status(500).json({ error: "Failed to get file info" });
    }
  });

  // Download processed file
  app.get("/api/files/:id/download", async (req, res) => {
    try {
      const file = await storage.getFile(req.params.id);
      
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      // Check if file exists on disk
      try {
        await fs.access(file.uploadPath);
      } catch {
        return res.status(404).json({ error: "File not found on disk" });
      }

      // Sanitize filename for Content-Disposition header
      const sanitizedName = file.originalName.replace(/[\r\n"]/g, '');
      res.setHeader('Content-Disposition', `attachment; filename="${sanitizedName}"`);
      res.setHeader('Content-Type', file.fileType);
      res.sendFile(path.resolve(file.uploadPath));
    } catch (error) {
      console.error("Download error:", error);
      res.status(500).json({ error: "Failed to download file" });
    }
  });

  // Create processing job
  app.post("/api/process", async (req, res) => {
    try {
      // Validate request body
      const validatedData = processJobSchema.parse(req.body);
      const { operation, inputFiles, parameters } = validatedData;

      // Validate that all input files exist
      for (const fileId of inputFiles) {
        const file = await storage.getFile(fileId);
        if (!file) {
          return res.status(400).json({ error: `File ${fileId} not found` });
        }
      }

      const jobData = {
        operation,
        inputFiles: inputFiles,
        parameters: parameters || {},
        status: "pending",
        progress: 0
      };

      const validatedJobData = insertProcessingJobSchema.parse(jobData);
      const job = await storage.createProcessingJob(validatedJobData);

      res.json({
        jobId: job.id,
        status: job.status,
        progress: job.progress
      });

      // Process files asynchronously
      setTimeout(async () => {
        try {
          // Get input file paths
          const inputPaths: string[] = [];
          for (const fileId of inputFiles) {
            const file = await storage.getFile(fileId);
            if (file) {
              inputPaths.push(file.uploadPath);
            }
          }

          // Process the files
          const result = await processFiles(operation, inputPaths, parameters);
          
          if (result.success && result.outputFiles) {
            // Store output files in storage
            const outputFileIds: string[] = [];
            for (const outputFile of result.outputFiles) {
              const fileRecord = await storage.createFile({
                originalName: outputFile.fileName,
                fileName: outputFile.fileName,
                fileType: 'application/pdf',
                fileSize: outputFile.fileSize,
                uploadPath: outputFile.filePath,
                status: "processed",
                metadata: { operation, createdFrom: inputFiles }
              });
              outputFileIds.push(fileRecord.id);
            }

            // Update job with success
            await storage.updateProcessingJob(job.id, {
              status: "completed",
              progress: 100,
              completedAt: new Date(),
              outputFiles: outputFileIds
            });
          } else {
            // Update job with error
            await storage.updateProcessingJob(job.id, {
              status: "failed",
              progress: 0,
              errorMessage: result.error,
              completedAt: new Date()
            });
          }
        } catch (error) {
          console.error("Processing error:", error);
          await storage.updateProcessingJob(job.id, {
            status: "failed",
            progress: 0,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
            completedAt: new Date()
          });
        }
      }, 1000);

    } catch (error) {
      console.error("Process error:", error);
      res.status(500).json({ error: "Failed to create processing job" });
    }
  });

  // Get processing job status
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getProcessingJob(req.params.id);
      
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      res.json({
        id: job.id,
        operation: job.operation,
        status: job.status,
        progress: job.progress,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
        errorMessage: job.errorMessage
      });
    } catch (error) {
      console.error("Get job error:", error);
      res.status(500).json({ error: "Failed to get job info" });
    }
  });

  // Delete file
  app.delete("/api/files/:id", async (req, res) => {
    try {
      const file = await storage.getFile(req.params.id);
      
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      // Delete file from disk
      try {
        await fs.unlink(file.uploadPath);
      } catch (error) {
        console.warn("Failed to delete file from disk:", error);
      }

      // Delete from storage
      await storage.deleteFile(req.params.id);

      res.json({ success: true });
    } catch (error) {
      console.error("Delete file error:", error);
      res.status(500).json({ error: "Failed to delete file" });
    }
  });

  // Sitemap.xml endpoint
  app.get("/sitemap.xml", (req, res) => {
    try {
      // Get base URL from environment or request
      const protocol = req.protocol;
      const host = req.get('host');
      const baseUrl = process.env.SITE_URL || `${protocol}://${host}`;
      
      // Generate sitemap XML
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/faq</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
${toolSlugs.map(slug => `  <url>
    <loc>${baseUrl}/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

      res.set('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error("Sitemap generation error:", error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // Robots.txt endpoint  
  app.get("/robots.txt", (req, res) => {
    try {
      const protocol = req.protocol;
      const host = req.get('host');
      const baseUrl = process.env.SITE_URL || `${protocol}://${host}`;
      
      const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

      res.set('Content-Type', 'text/plain');
      res.send(robotsTxt);
    } catch (error) {
      console.error("Robots.txt generation error:", error);
      res.status(500).send('Error generating robots.txt');
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
