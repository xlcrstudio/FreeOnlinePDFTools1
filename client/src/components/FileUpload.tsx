import { useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileText, X, CheckCircle, Download } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import { useToast } from '@/hooks/use-toast'

interface FileWithProgress {
  file: File
  fileId?: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
}

interface UploadedFile {
  id: string
  originalName: string
  fileType: string
  fileSize: number
  status: string
}

interface JobStatus {
  id: string
  operation: string
  status: string
  progress: number
  createdAt: string
  completedAt?: string
  errorMessage?: string
}

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxFiles?: number
  onFilesSelected?: (files: File[]) => void
  parameters?: Record<string, any>
}

// Component to handle job output files and downloads
function JobOutputFiles({ jobId }: { jobId: string }) {
  const { data: jobDetails } = useQuery({
    queryKey: ['/api/jobs', jobId, 'details'],
    queryFn: async () => {
      const response = await fetch(`/api/jobs/${jobId}`)
      if (!response.ok) throw new Error('Failed to fetch job details')
      return response.json()
    }
  })

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}/download`)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  if (!jobDetails || !jobDetails.outputFiles || jobDetails.outputFiles.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <h5 className="font-medium text-sm">Download Results:</h5>
      {jobDetails.outputFiles.map((fileId: string, index: number) => (
        <Button
          key={fileId}
          variant="outline"
          size="sm"
          onClick={() => handleDownload(fileId, `processed-file-${index + 1}.pdf`)}
          className="w-full justify-start"
          data-testid={`button-download-${index}`}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Processed File {index + 1}
        </Button>
      ))}
    </div>
  )
}

export function FileUpload({ 
  accept = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png', 
  multiple = true,
  maxFiles = 10,
  onFilesSelected,
  parameters = {} 
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<FileWithProgress[]>([])
  const [processingJobId, setProcessingJobId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Poll job status
  const { data: jobStatus } = useQuery({
    queryKey: ['/api/jobs', processingJobId],
    enabled: !!processingJobId,
    refetchInterval: (data: any) => {
      if (!data || !data.status || ['pending', 'processing'].includes(data.status)) {
        return 2000 // Poll every 2 seconds
      }
      return false // Stop polling when completed/failed
    },
    refetchIntervalInBackground: false
  })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).slice(0, maxFiles)
      handleFiles(files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, maxFiles)
      handleFiles(files)
    }
  }

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const data = await response.json()
      return data as { success: boolean; files: UploadedFile[] }
    },
    onSuccess: (data, files) => {
      setUploadedFiles(prev => prev.map((f, index) => {
        if (files.includes(f.file)) {
          const uploadedFile = data.files.find(uf => uf.originalName === f.file.name)
          return {
            ...f,
            fileId: uploadedFile?.id,
            progress: 100,
            status: 'completed' as const
          }
        }
        return f
      }))
      toast({
        title: 'Files uploaded successfully',
        description: `${data.files.length} file(s) uploaded`
      })
    },
    onError: (error) => {
      console.error('Upload error:', error)
      setUploadedFiles(prev => prev.map(f => ({ ...f, status: 'error' as const })))
      toast({
        title: 'Upload failed',
        description: 'Failed to upload files. Please try again.',
        variant: 'destructive'
      })
    }
  })

  const processMutation = useMutation({
    mutationFn: async (params: { operation: string; fileIds: string[]; parameters: Record<string, any> }) => {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: params.operation,
          inputFiles: params.fileIds,
          parameters: params.parameters
        })
      })
      
      if (!response.ok) {
        throw new Error('Processing failed')
      }
      
      const data = await response.json()
      return data as { jobId: string; status: string; progress: number }
    },
    onSuccess: (data) => {
      setProcessingJobId(data.jobId)
      toast({
        title: 'Processing started',
        description: 'Your files are being processed...'
      })
      // Invalidate queries to refresh the specific job status
      queryClient.invalidateQueries({ queryKey: ['/api/jobs', data.jobId] })
    },
    onError: (error) => {
      console.error('Process error:', error)
      toast({
        title: 'Processing failed',
        description: 'Failed to start processing. Please try again.',
        variant: 'destructive'
      })
    }
  })

  const handleFiles = (files: File[]) => {
    console.log('Files selected:', files.map(f => f.name))
    onFilesSelected?.(files)

    const newFiles: FileWithProgress[] = files.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])
    uploadMutation.mutate(files)
  }

  const handleProcessFiles = () => {
    // For security tools, validate parameters before processing
    const operation = window.location.pathname.slice(1) || 'merge-pdf'
    const isSecurityTool = ['protect-pdf', 'unlock-pdf', 'redact-pdf'].includes(operation)
    
    if (isSecurityTool) {
      const needsPassword = ['protect-pdf', 'unlock-pdf'].includes(operation)
      const needsRedactionAreas = operation === 'redact-pdf'
      
      if (needsPassword && (!parameters.password || parameters.password.length < 4)) {
        toast({
          title: 'Password required',
          description: 'Please enter a password with at least 4 characters.',
          variant: 'destructive'
        })
        return
      }
      
      if (needsRedactionAreas && (!parameters.areas || !Array.isArray(parameters.areas) || parameters.areas.length === 0)) {
        toast({
          title: 'Redaction areas required',
          description: 'Please specify valid redaction areas.',
          variant: 'destructive'
        })
        return
      }
    }

    const completedFiles = uploadedFiles.filter(f => f.status === 'completed' && f.fileId)
    if (completedFiles.length === 0) {
      toast({
        title: 'No files to process',
        description: 'Please upload files first.',
        variant: 'destructive'
      })
      return
    }

    const fileIds = completedFiles.map(f => f.fileId!)
    processMutation.mutate({ operation, fileIds, parameters })
  }

  const resetProcessing = () => {
    setProcessingJobId(null)
    setUploadedFiles([])
  }

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => prev.filter(f => f.file !== fileToRemove))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card
        className={`relative border-2 border-dashed transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="p-12 text-center space-y-4">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
            dragActive ? 'bg-primary/20' : 'bg-muted'
          }`}>
            <Upload className={`h-8 w-8 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Drag and drop your files here
            </h3>
            <p className="text-muted-foreground">
              or click to select files from your computer
            </p>
            <p className="text-sm text-muted-foreground">
              Supports PDF, Word, PowerPoint, Excel, and image files
            </p>
          </div>

          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="mt-4"
            data-testid="button-select-files"
          >
            Select Files
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
            data-testid="input-file-upload"
          />
        </div>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-foreground">Uploaded Files</h4>
          {uploadedFiles.map((fileWithProgress, index) => (
            <Card key={`${fileWithProgress.file.name}-${index}`} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {fileWithProgress.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(fileWithProgress.file.size)}
                    </p>
                    {fileWithProgress.status === 'uploading' && (
                      <Progress value={fileWithProgress.progress} className="mt-2 h-2" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {fileWithProgress.status === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(fileWithProgress.file)}
                    data-testid={`button-remove-file-${index}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          
          {uploadedFiles.every(f => f.status === 'completed') && uploadedFiles.length > 0 && !processingJobId && (
            <Button 
              className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={handleProcessFiles}
              disabled={processMutation.isPending}
              data-testid="button-process-files"
            >
              {processMutation.isPending ? 'Processing...' : 'Process Files'}
            </Button>
          )}
          
          {/* Show job status */}
          {processingJobId && jobStatus && (
            <div className="w-full mt-4 p-4 bg-muted rounded-lg" data-testid="job-status">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Job Status: {(jobStatus as JobStatus)?.status || 'pending'}</span>
                <span className="text-sm text-muted-foreground">{(jobStatus as JobStatus)?.progress || 0}%</span>
              </div>
              {(jobStatus as JobStatus)?.status === 'processing' && (
                <Progress value={(jobStatus as JobStatus)?.progress || 0} className="w-full" />
              )}
              {(jobStatus as JobStatus)?.status === 'completed' && (
                <div className="space-y-3">
                  <div className="text-green-600 font-medium">Processing completed successfully!</div>
                  {/* Get job details for output files */}
                  <JobOutputFiles jobId={processingJobId} />
                </div>
              )}
              {(jobStatus as JobStatus)?.status === 'failed' && (
                <div className="text-red-600 font-medium">Processing failed: {(jobStatus as JobStatus)?.errorMessage || 'Unknown error'}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}