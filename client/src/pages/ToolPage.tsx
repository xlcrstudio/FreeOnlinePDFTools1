import { useState } from 'react'
import { useRoute } from 'wouter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Shield, Lock, Scissors, Globe, Hash, Wrench, Archive, FileEdit, Signature, Crop, ScanLine, FileSearch, Eye } from 'lucide-react'
import { Header } from '@/components/Header'
import { FileUpload } from '@/components/FileUpload'
import { Footer } from '@/components/Footer'
import { SEO } from '@/components/SEO'
import { toolSEOData } from '@/data/seoData'

const toolConfigs = {
  'merge-pdf': { title: 'Merge PDF', description: 'Combine PDFs in the order you want' },
  'split-pdf': { title: 'Split PDF', description: 'Separate pages into independent PDF files' },
  'compress-pdf': { title: 'Compress PDF', description: 'Reduce file size while optimizing quality' },
  'rotate-pdf': { title: 'Rotate PDF', description: 'Rotate your PDFs the way you need them' },
  'watermark-pdf': { title: 'Watermark PDF', description: 'Add watermarks to your PDF documents' },
  'organize-pdf': { title: 'Organize PDF', description: 'Sort pages of your PDF file however you like' },
  'protect-pdf': { title: 'Protect PDF', description: 'Protect PDF files with a password' },
  'unlock-pdf': { title: 'Unlock PDF', description: 'Remove PDF password security' },
  'redact-pdf': { title: 'Redact PDF', description: 'Redact text and graphics from PDF' },
  'pdf-to-word': { title: 'PDF to Word', description: 'Convert PDF files to DOC and DOCX' },
  'word-to-pdf': { title: 'Word to PDF', description: 'Convert DOC and DOCX files to PDF' },
  'pdf-to-excel': { title: 'PDF to Excel', description: 'Extract data to Excel spreadsheets' },
  'excel-to-pdf': { title: 'Excel to PDF', description: 'Convert Excel files to PDF' },
  'pdf-to-powerpoint': { title: 'PDF to PowerPoint', description: 'Convert PDF to PPT slides' },
  'powerpoint-to-pdf': { title: 'PowerPoint to PDF', description: 'Convert PPT files to PDF' },
  'pdf-to-jpg': { title: 'PDF to JPG', description: 'Convert PDF pages to JPG images' },
  'jpg-to-pdf': { title: 'JPG to PDF', description: 'Convert JPG images to PDF' },
  'html-to-pdf': { title: 'HTML to PDF', description: 'Convert HTML pages and content to PDF' },
  'number-pages': { title: 'Number Pages', description: 'Add page numbers to your PDF documents' },
  'repair-pdf': { title: 'Repair PDF', description: 'Fix corrupted or damaged PDF files' },
  'pdf-to-pdfa': { title: 'PDF to PDFA', description: 'Convert PDF to PDF/A for long-term archiving' },
  'edit-pdf': { title: 'Edit PDF', description: 'Add text, images, shapes to your PDF documents' },
  'sign-pdf': { title: 'Sign PDF', description: 'Add digital signatures to PDF documents' },
  'crop-pdf': { title: 'Crop PDF', description: 'Crop specific areas of your PDF pages' },
  'scan-to-pdf': { title: 'Scan to PDF', description: 'Capture document scans from your device' },
  'ocr-pdf': { title: 'OCR PDF', description: 'Make scanned PDFs searchable and selectable' },
  'compare-pdf': { title: 'Compare PDF', description: 'Compare two PDF documents side by side' },
} as const

export function ToolPage() {
  const [match, params] = useRoute<{ tool: string }>('/:tool')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [password, setPassword] = useState('')
  const [redactionAreas, setRedactionAreas] = useState('')
  const [htmlContent, setHtmlContent] = useState('')
  const [pageNumberPosition, setPageNumberPosition] = useState('bottom-center')
  const [pageNumberFormat, setPageNumberFormat] = useState('Page {n} of {total}')
  const [pageNumberFontSize, setPageNumberFontSize] = useState('12')
  const [pageNumberStartPage, setPageNumberStartPage] = useState('1')
  const [signatureText, setSignatureText] = useState('Digitally Signed')
  const [signaturePage, setSignaturePage] = useState('1')
  const [cropX, setCropX] = useState('')
  const [cropY, setCropY] = useState('')
  const [cropWidth, setCropWidth] = useState('')
  const [cropHeight, setCropHeight] = useState('')

  const toolKey = params?.tool as keyof typeof toolConfigs
  const config = toolConfigs[toolKey]
  const seoData = toolSEOData[toolKey]
  
  // Identify tools that need parameters
  const isSecurityTool = ['protect-pdf', 'unlock-pdf', 'redact-pdf'].includes(toolKey || '')
  const isAdvancedTool = ['html-to-pdf', 'number-pages', 'sign-pdf', 'crop-pdf'].includes(toolKey || '')
  const needsPassword = ['protect-pdf', 'unlock-pdf'].includes(toolKey || '')
  const needsRedactionAreas = toolKey === 'redact-pdf'
  const needsHtmlContent = toolKey === 'html-to-pdf'
  const needsPageNumbering = toolKey === 'number-pages'
  const needsSignatureOptions = toolKey === 'sign-pdf'
  const needsCropOptions = toolKey === 'crop-pdf'
  const showParameterForm = isSecurityTool || isAdvancedTool

  if (!match || !config) {
    return (
      <div className="min-h-screen bg-background">
        <SEO 
          title="Tool Not Found | Free Online PDF Tools"
          description="The requested PDF tool could not be found. Explore our complete collection of 25+ free PDF tools."
          noIndex={true}
        />
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Tool Not Found</h1>
            <p className="text-muted-foreground mb-8">The requested tool is not available.</p>
            <Button onClick={() => window.location.href = '/'}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tools
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleBackToTools = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={seoData?.title || `${config.title} | Free Online PDF Tools`}
        description={seoData?.description || config.description}
        keywords={seoData?.keywords}
        canonical={`https://free-online-pdf-tools.replit.app/${toolKey}`}
        schema={seoData?.schema}
      />
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToTools}
            className="mb-6"
            data-testid="button-back-to-tools"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Button>
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">{config.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {config.description}
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {/* Tool Parameters */}
          {showParameterForm && (
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  {toolKey === 'protect-pdf' && <Shield className="h-5 w-5 text-primary" />}
                  {toolKey === 'unlock-pdf' && <Lock className="h-5 w-5 text-primary" />}
                  {toolKey === 'redact-pdf' && <Scissors className="h-5 w-5 text-primary" />}
                  {toolKey === 'html-to-pdf' && <Globe className="h-5 w-5 text-primary" />}
                  {toolKey === 'number-pages' && <Hash className="h-5 w-5 text-primary" />}
                  {toolKey === 'sign-pdf' && <Signature className="h-5 w-5 text-primary" />}
                  {toolKey === 'crop-pdf' && <Crop className="h-5 w-5 text-primary" />}
                  <h3 className="text-lg font-semibold">
                    {isSecurityTool ? 'Security Parameters' : 'Tool Parameters'}
                  </h3>
                </div>

                {needsPassword && (
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      {toolKey === 'protect-pdf' ? 'New Password' : 'Current Password'}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={toolKey === 'protect-pdf' ? 'Enter password to protect PDF' : 'Enter password to unlock PDF'}
                      data-testid="input-password"
                    />
                    {toolKey === 'protect-pdf' && (
                      <>
                        <p className="text-sm text-muted-foreground">
                          Password must be at least 4 characters long
                        </p>
                        <Alert>
                          <AlertDescription>
                            <strong>Important:</strong> This tool has limited encryption capabilities. 
                            For production security, use specialized PDF encryption tools like qpdf, PDFtk, 
                            or commercial solutions that provide military-grade encryption.
                          </AlertDescription>
                        </Alert>
                      </>
                    )}
                    {toolKey === 'unlock-pdf' && (
                      <Alert>
                        <AlertDescription>
                          <strong>Note:</strong> This tool can only process certain types of password-protected PDFs. 
                          Heavily encrypted PDFs may require specialized unlocking software.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {needsRedactionAreas && (
                  <div className="space-y-2">
                    <Label htmlFor="redaction-areas">Redaction Areas</Label>
                    <Textarea
                      id="redaction-areas"
                      value={redactionAreas}
                      onChange={(e) => setRedactionAreas(e.target.value)}
                      placeholder='[{"page": 1, "x": 100, "y": 700, "width": 200, "height": 20}]'
                      className="min-h-24"
                      data-testid="textarea-redaction-areas"
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter JSON array of redaction areas with page, x, y, width, and height coordinates
                    </p>
                    <Alert>
                      <AlertDescription>
                        <strong>SECURITY WARNING:</strong> This tool provides VISUAL redaction only. 
                        Underlying text content remains in the PDF structure and may be recoverable. 
                        For true content removal on sensitive documents, use specialized security software.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {needsHtmlContent && (
                  <div className="space-y-2">
                    <Label htmlFor="html-content">HTML Content (Optional)</Label>
                    <Textarea
                      id="html-content"
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      placeholder='<h1>Your HTML content here</h1><p>Leave empty to convert uploaded HTML file</p>'
                      className="min-h-32"
                      data-testid="textarea-html-content"
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter HTML content directly, or leave empty to convert the uploaded HTML file
                    </p>
                  </div>
                )}

                {needsPageNumbering && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <select
                          id="position"
                          value={pageNumberPosition}
                          onChange={(e) => setPageNumberPosition(e.target.value)}
                          className="w-full p-2 border rounded-md bg-background"
                          data-testid="select-position"
                        >
                          <option value="bottom-center">Bottom Center</option>
                          <option value="bottom-left">Bottom Left</option>
                          <option value="bottom-right">Bottom Right</option>
                          <option value="top-center">Top Center</option>
                          <option value="top-left">Top Left</option>
                          <option value="top-right">Top Right</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="format">Format</Label>
                        <select
                          id="format"
                          value={pageNumberFormat}
                          onChange={(e) => setPageNumberFormat(e.target.value)}
                          className="w-full p-2 border rounded-md bg-background"
                          data-testid="select-format"
                        >
                          <option value="Page {n} of {total}">Page 1 of 10</option>
                          <option value="{n}">{"{n}"} (numbers only)</option>
                          <option value="Page {n}">Page 1</option>
                          <option value="{n} / {total}">1 / 10</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="font-size">Font Size</Label>
                        <Input
                          id="font-size"
                          type="number"
                          value={pageNumberFontSize}
                          onChange={(e) => setPageNumberFontSize(e.target.value)}
                          min="8"
                          max="24"
                          data-testid="input-font-size"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="start-page">Start Page Number</Label>
                        <Input
                          id="start-page"
                          type="number"
                          value={pageNumberStartPage}
                          onChange={(e) => setPageNumberStartPage(e.target.value)}
                          min="1"
                          data-testid="input-start-page"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {needsSignatureOptions && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signature-text">Signature Text</Label>
                      <Input
                        id="signature-text"
                        value={signatureText}
                        onChange={(e) => setSignatureText(e.target.value)}
                        placeholder="Digitally Signed"
                        data-testid="input-signature-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signature-page">Page Number</Label>
                      <Input
                        id="signature-page"
                        type="number"
                        value={signaturePage}
                        onChange={(e) => setSignaturePage(e.target.value)}
                        min="1"
                        data-testid="input-signature-page"
                      />
                    </div>
                  </div>
                )}

                {needsCropOptions && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Leave fields empty to use default center crop (10% margin on all sides)
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="crop-x">X Position</Label>
                        <Input
                          id="crop-x"
                          type="number"
                          value={cropX}
                          onChange={(e) => setCropX(e.target.value)}
                          placeholder="Auto"
                          data-testid="input-crop-x"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="crop-y">Y Position</Label>
                        <Input
                          id="crop-y"
                          type="number"
                          value={cropY}
                          onChange={(e) => setCropY(e.target.value)}
                          placeholder="Auto"
                          data-testid="input-crop-y"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="crop-width">Width</Label>
                        <Input
                          id="crop-width"
                          type="number"
                          value={cropWidth}
                          onChange={(e) => setCropWidth(e.target.value)}
                          placeholder="Auto"
                          data-testid="input-crop-width"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="crop-height">Height</Label>
                        <Input
                          id="crop-height"
                          type="number"
                          value={cropHeight}
                          onChange={(e) => setCropHeight(e.target.value)}
                          placeholder="Auto"
                          data-testid="input-crop-height"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          <FileUpload
            onFilesSelected={setSelectedFiles}
            accept={
              // PDF-only tools
              isSecurityTool || ['number-pages', 'repair-pdf', 'pdf-to-pdfa', 'edit-pdf', 'sign-pdf', 'crop-pdf', 'ocr-pdf'].includes(toolKey || '') ? '.pdf' :
              // Two PDF files for comparison
              toolKey === 'compare-pdf' ? '.pdf' :
              // HTML files
              toolKey === 'html-to-pdf' ? '.html,.htm' :
              // Images for scanning
              toolKey === 'scan-to-pdf' ? '.jpg,.jpeg,.png' :
              // Conversion tools
              toolKey.includes('pdf-to') ? '.pdf' : toolKey.includes('word') ? '.doc,.docx' : 
              toolKey.includes('excel') ? '.xls,.xlsx' : toolKey.includes('powerpoint') ? '.ppt,.pptx' : 
              toolKey.includes('jpg') ? '.jpg,.jpeg,.png' : 
              // Default fallback
              '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png'
            }
            parameters={{
              ...(needsPassword && { password }),
              ...(needsRedactionAreas && { 
                areas: (() => {
                  try {
                    // Only parse if the text looks like valid JSON (starts with [ and ends with ])
                    const trimmed = redactionAreas.trim()
                    if (!trimmed) return []
                    if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return []
                    return JSON.parse(trimmed)
                  } catch (e) {
                    // Don't log errors during typing - only when processing
                    return []
                  }
                })()
              }),
              ...(needsHtmlContent && htmlContent && { htmlContent }),
              ...(needsPageNumbering && {
                position: pageNumberPosition,
                format: pageNumberFormat,
                fontSize: parseInt(pageNumberFontSize) || 12,
                startPage: parseInt(pageNumberStartPage) || 1
              }),
              ...(needsSignatureOptions && {
                signatureText,
                page: parseInt(signaturePage) || 1
              }),
              ...(needsCropOptions && {
                ...(cropX && { x: parseInt(cropX) }),
                ...(cropY && { y: parseInt(cropY) }),
                ...(cropWidth && { width: parseInt(cropWidth) }),
                ...(cropHeight && { height: parseInt(cropHeight) })
              })
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}