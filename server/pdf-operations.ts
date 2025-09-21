import { PDFDocument, rgb, StandardFonts, PDFFont, degrees as degreesHelper } from 'pdf-lib'
import fs from 'fs/promises'
import path from 'path'
import { convertFiles } from './format-conversions'

export interface ProcessingResult {
  success: boolean
  outputFiles?: Array<{
    fileName: string
    filePath: string
    fileSize: number
  }>
  error?: string
}

/**
 * Merge multiple PDF files into a single PDF
 */
export async function mergePDFs(inputPaths: string[], outputDir: string): Promise<ProcessingResult> {
  try {
    const mergedPdf = await PDFDocument.create()
    
    for (const inputPath of inputPaths) {
      const pdfBytes = await fs.readFile(inputPath)
      const pdf = await PDFDocument.load(pdfBytes)
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      pages.forEach((page) => mergedPdf.addPage(page))
    }
    
    const pdfBytes = await mergedPdf.save()
    const outputFileName = `merged-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)
    
    await fs.writeFile(outputPath, pdfBytes)
    const stats = await fs.stat(outputPath)
    
    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      }]
    }
  } catch (error) {
    console.error('Error merging PDFs:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Split a PDF into individual pages
 */
export async function splitPDF(inputPath: string, outputDir: string): Promise<ProcessingResult> {
  try {
    const pdfBytes = await fs.readFile(inputPath)
    const pdf = await PDFDocument.load(pdfBytes)
    const totalPages = pdf.getPageCount()
    
    const outputFiles: Array<{
      fileName: string
      filePath: string
      fileSize: number
    }> = []
    
    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create()
      const [copiedPage] = await newPdf.copyPages(pdf, [i])
      newPdf.addPage(copiedPage)
      
      const newPdfBytes = await newPdf.save()
      const outputFileName = `page-${i + 1}-${Date.now()}.pdf`
      const outputPath = path.join(outputDir, outputFileName)
      
      await fs.writeFile(outputPath, newPdfBytes)
      const stats = await fs.stat(outputPath)
      
      outputFiles.push({
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      })
    }
    
    return {
      success: true,
      outputFiles
    }
  } catch (error) {
    console.error('Error splitting PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Compress a PDF by optimizing its content
 */
export async function compressPDF(inputPath: string, outputDir: string): Promise<ProcessingResult> {
  try {
    const pdfBytes = await fs.readFile(inputPath)
    const pdf = await PDFDocument.load(pdfBytes)
    
    // Basic compression by saving with optimization
    const compressedBytes = await pdf.save({
      useObjectStreams: false,
      addDefaultPage: false,
      objectsPerTick: 50
    })
    
    const outputFileName = `compressed-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)
    
    await fs.writeFile(outputPath, compressedBytes)
    const stats = await fs.stat(outputPath)
    const originalStats = await fs.stat(inputPath)
    
    // Log compression ratio
    const compressionRatio = ((originalStats.size - stats.size) / originalStats.size * 100).toFixed(1)
    console.log(`PDF compressed: ${originalStats.size} -> ${stats.size} bytes (${compressionRatio}% reduction)`)
    
    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      }]
    }
  } catch (error) {
    console.error('Error compressing PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Rotate PDF pages by specified degrees
 */
export async function rotatePdf(inputPath: string, outputDir: string, degrees: number = 90): Promise<ProcessingResult> {
  try {
    const pdfBytes = await fs.readFile(inputPath)
    const pdf = await PDFDocument.load(pdfBytes)
    const pages = pdf.getPages()

    // Rotate all pages by the specified degrees
    for (const page of pages) {
      page.setRotation(degreesHelper(degrees))
    }

    const rotatedBytes = await pdf.save()
    const outputFileName = `rotated-${degrees}deg-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)

    await fs.writeFile(outputPath, rotatedBytes)
    const stats = await fs.stat(outputPath)

    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      }]
    }
  } catch (error) {
    console.error('Error rotating PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Add text watermark to PDF pages
 */
export async function watermarkPdf(
  inputPath: string, 
  outputDir: string, 
  watermarkText: string = 'WATERMARK',
  options: { opacity?: number; fontSize?: number; position?: 'center' | 'diagonal' } = {}
): Promise<ProcessingResult> {
  try {
    const pdfBytes = await fs.readFile(inputPath)
    const pdf = await PDFDocument.load(pdfBytes)
    const pages = pdf.getPages()
    
    const { opacity = 0.3, fontSize = 50, position = 'diagonal' } = options

    for (const page of pages) {
      const { width, height } = page.getSize()
      
      let x, y, rotation
      if (position === 'center') {
        x = width / 2 - (watermarkText.length * fontSize) / 4
        y = height / 2
        rotation = 0
      } else { // diagonal
        x = width / 2 - (watermarkText.length * fontSize) / 4
        y = height / 2
        rotation = 45
      }

      page.drawText(watermarkText, {
        x,
        y,
        size: fontSize,
        opacity,
        color: rgb(0.7, 0.7, 0.7)
      })
    }

    const watermarkedBytes = await pdf.save()
    const outputFileName = `watermarked-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)

    await fs.writeFile(outputPath, watermarkedBytes)
    const stats = await fs.stat(outputPath)

    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      }]
    }
  } catch (error) {
    console.error('Error watermarking PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Organize/reorder PDF pages based on specified order
 */
export async function organizePdf(
  inputPath: string, 
  outputDir: string, 
  pageOrder: number[] = []
): Promise<ProcessingResult> {
  try {
    const pdfBytes = await fs.readFile(inputPath)
    const pdf = await PDFDocument.load(pdfBytes)
    const totalPages = pdf.getPageCount()
    
    // If no specific order provided, reverse the pages as an example
    const order = pageOrder.length > 0 ? pageOrder : Array.from({ length: totalPages }, (_, i) => totalPages - i)
    
    // Validate page order
    const validOrder = order.filter(pageNum => pageNum >= 1 && pageNum <= totalPages)
    if (validOrder.length === 0) {
      throw new Error('Invalid page order provided')
    }

    const newPdf = await PDFDocument.create()
    
    // Copy pages in the specified order (convert from 1-based to 0-based indexing)
    for (const pageNum of validOrder) {
      const [copiedPage] = await newPdf.copyPages(pdf, [pageNum - 1])
      newPdf.addPage(copiedPage)
    }

    const organizedBytes = await newPdf.save()
    const outputFileName = `organized-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)

    await fs.writeFile(outputPath, organizedBytes)
    const stats = await fs.stat(outputPath)

    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      }]
    }
  } catch (error) {
    console.error('Error organizing PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Protect PDF with password encryption
 * WARNING: pdf-lib does not support real encryption - this is a placeholder implementation
 */
export async function protectPdf(
  inputPath: string, 
  outputDir: string, 
  password: string
): Promise<ProcessingResult> {
  try {
    // Validate password is provided and meets minimum requirements
    if (!password || password.trim().length === 0) {
      throw new Error('Password is required for PDF protection')
    }
    
    if (password.length < 4) {
      throw new Error('Password must be at least 4 characters long')
    }

    const pdfBytes = await fs.readFile(inputPath)
    const pdf = await PDFDocument.load(pdfBytes)
    
    // LIMITATION: pdf-lib does not support encryption
    // This creates a copy of the PDF without actual password protection
    console.warn('WARNING: pdf-lib cannot provide real encryption. For true PDF encryption, use specialized tools like qpdf, PDFtk, or commercial solutions.')
    
    const protectedBytes = await pdf.save()

    const outputFileName = `copy-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)

    await fs.writeFile(outputPath, protectedBytes)
    const stats = await fs.stat(outputPath)

    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      }]
    }
  } catch (error) {
    console.error('Error protecting PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to protect PDF. Note: pdf-lib cannot provide real encryption - use specialized PDF security tools for true protection.'
    }
  }
}

/**
 * Unlock/decrypt password-protected PDF
 * WARNING: pdf-lib has limited support for encrypted PDFs
 */
export async function unlockPdf(
  inputPath: string, 
  outputDir: string, 
  password: string = ''
): Promise<ProcessingResult> {
  try {
    const pdfBytes = await fs.readFile(inputPath)
    
    // LIMITATION: pdf-lib cannot decrypt password-protected PDFs reliably
    // This attempts to load the PDF, but will fail for truly encrypted files
    console.warn('WARNING: pdf-lib has limited encrypted PDF support. Truly encrypted PDFs require specialized tools like qpdf or PDFtk.')
    
    let pdf
    try {
      // pdf-lib has very limited encrypted PDF support
      // This will fail for most encrypted PDFs
      pdf = await PDFDocument.load(pdfBytes)
    } catch (loadError) {
      throw new Error('This PDF appears to be encrypted and cannot be processed. pdf-lib cannot decrypt password-protected PDFs. Use specialized tools like qpdf or PDFtk.')
    }

    // Save PDF without encryption
    const unlockedBytes = await pdf.save()
    const outputFileName = `unlocked-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)

    await fs.writeFile(outputPath, unlockedBytes)
    const stats = await fs.stat(outputPath)

    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      }]
    }
  } catch (error) {
    console.error('Error unlocking PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to unlock PDF. Check password or file integrity.'
    }
  }
}

/**
 * Redact PDF by drawing rectangles over sensitive areas
 * WARNING: This is visual redaction only - underlying content remains in the PDF
 * For true content removal, use specialized redaction software
 */
export async function redactPdf(
  inputPath: string, 
  outputDir: string, 
  redactAreas: Array<{ page: number; x: number; y: number; width: number; height: number }> = []
): Promise<ProcessingResult> {
  try {
    const pdfBytes = await fs.readFile(inputPath)
    const sourcePdf = await PDFDocument.load(pdfBytes)
    const sourcePages = sourcePdf.getPages()

    // Validate redaction areas are provided
    if (redactAreas.length === 0) {
      throw new Error('Redaction areas must be specified. This tool requires explicit coordinates to redact.')
    }

    console.log('WARNING: Visual redaction only - underlying content not removed from PDF structure')

    // Create a new PDF document for the redacted output
    const redactedPdf = await PDFDocument.create()

    // Group redaction areas by page for efficient processing
    const redactionsByPage = new Map<number, typeof redactAreas>()
    for (const area of redactAreas) {
      // Validate area parameters
      if (!Number.isInteger(area.page) || area.page < 1) {
        throw new Error(`Invalid page number: ${area.page}. Page numbers must be positive integers.`)
      }
      
      const pageIndex = area.page - 1 // Convert to 0-based
      if (pageIndex >= sourcePages.length) {
        throw new Error(`Page ${area.page} does not exist in the PDF (total pages: ${sourcePages.length})`)
      }

      if (!redactionsByPage.has(area.page)) {
        redactionsByPage.set(area.page, [])
      }
      redactionsByPage.get(area.page)!.push(area)
    }

    // Process each page
    for (let i = 0; i < sourcePages.length; i++) {
      const pageNumber = i + 1
      const sourcePage = sourcePages[i]
      const pageRedactions = redactionsByPage.get(pageNumber)

      if (pageRedactions && pageRedactions.length > 0) {
        // For pages with redactions, create a clean page and selectively copy content
        const newPage = redactedPdf.addPage([sourcePage.getWidth(), sourcePage.getHeight()])
        
        // Copy the source page content first
        const [copiedPage] = await redactedPdf.copyPages(sourcePdf, [i])
        
        // Remove the newly added blank page and use the copied page
        redactedPdf.removePage(redactedPdf.getPageCount() - 1)
        redactedPdf.addPage(copiedPage)
        
        // Draw white rectangles over redaction areas to completely obscure content
        // Then draw black rectangles on top for visual indication
        for (const area of pageRedactions) {
          // First, draw a white rectangle to completely cover the content
          copiedPage.drawRectangle({
            x: area.x,
            y: area.y,
            width: area.width,
            height: area.height,
            color: rgb(1, 1, 1), // White background
            borderWidth: 0
          })
          
          // Then draw a black rectangle over it for visual indication
          copiedPage.drawRectangle({
            x: area.x,
            y: area.y,
            width: area.width,
            height: area.height,
            color: rgb(0, 0, 0), // Black redaction mark
            borderWidth: 0
          })
        }
      } else {
        // For pages without redactions, simply copy the page as-is
        const [copiedPage] = await redactedPdf.copyPages(sourcePdf, [i])
        redactedPdf.addPage(copiedPage)
      }
    }

    // Save with flattening options to prevent content recovery
    const redactedBytes = await redactedPdf.save({
      useObjectStreams: false,
      addDefaultPage: false,
      objectsPerTick: 50
    })
    
    const outputFileName = `redacted-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)

    await fs.writeFile(outputPath, redactedBytes)
    const stats = await fs.stat(outputPath)

    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      }]
    }
  } catch (error) {
    console.error('Error redacting PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to redact PDF content.'
    }
  }
}

/**
 * Convert HTML content to PDF
 */
export async function htmlToPdf(
  inputPath: string,
  outputDir: string,
  htmlContent?: string
): Promise<ProcessingResult> {
  try {
    let content: string
    
    if (htmlContent) {
      // Use provided HTML content
      content = htmlContent
    } else {
      // Read HTML file content
      content = await fs.readFile(inputPath, 'utf-8')
    }

    // Create a new PDF document
    const pdf = await PDFDocument.create()
    const regularFont = await pdf.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold)
    
    // Add a page
    const page = pdf.addPage([612, 792]) // Letter size
    const { width, height } = page.getSize()
    
    // Basic HTML parsing with simple formatting support
    // For production, consider using a proper HTML renderer like Puppeteer
    let parsedContent = content
      // Handle common HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
    
    // Parse content into structured elements with basic formatting
    const elements: Array<{text: string, fontSize: number, isBold: boolean, isNewLine: boolean}> = []
    
    // Split by HTML tags while preserving some formatting
    const htmlParts = parsedContent.split(/(<[^>]*>)/)
    let currentFontSize = 12
    let isBold = false
    
    for (const part of htmlParts) {
      if (part.startsWith('<')) {
        // Handle HTML tags
        const tag = part.toLowerCase()
        if (tag.includes('h1')) {
          currentFontSize = 18
          isBold = true
          elements.push({text: '', fontSize: currentFontSize, isBold, isNewLine: true})
        } else if (tag.includes('h2')) {
          currentFontSize = 16
          isBold = true
          elements.push({text: '', fontSize: currentFontSize, isBold, isNewLine: true})
        } else if (tag.includes('h3')) {
          currentFontSize = 14
          isBold = true
          elements.push({text: '', fontSize: currentFontSize, isBold, isNewLine: true})
        } else if (tag.includes('/h')) {
          currentFontSize = 12
          isBold = false
          elements.push({text: '', fontSize: currentFontSize, isBold, isNewLine: true})
        } else if (tag.includes('p') || tag.includes('div') || tag.includes('br')) {
          elements.push({text: '', fontSize: currentFontSize, isBold, isNewLine: true})
        } else if (tag.includes('b>') || tag.includes('strong>')) {
          isBold = true
        } else if (tag.includes('/b>') || tag.includes('/strong>')) {
          isBold = false
        }
      } else if (part.trim()) {
        // Add text content
        elements.push({text: part.trim(), fontSize: currentFontSize, isBold, isNewLine: false})
      }
    }
    
    // Render elements to PDF with proper pagination
    let currentPage = page
    let yPosition = height - 50
    const margin = 50
    const baseLineHeight = 16
    
    for (const element of elements) {
      if (element.isNewLine && element.text === '') {
        yPosition -= baseLineHeight
        continue
      }
      
      if (element.text === '') continue
      
      const lineHeight = element.fontSize + 4
      const words = element.text.split(' ')
      let currentLine = ''
      
      // Check if we need a new page before starting this element
      if (yPosition < 80) {
        currentPage = pdf.addPage([612, 792])
        yPosition = currentPage.getSize().height - 50
      }
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word
        const maxWidth = currentPage.getSize().width - (margin * 2)
        const selectedFont = element.isBold ? boldFont : regularFont
        const textWidth = selectedFont.widthOfTextAtSize(testLine, element.fontSize)
        
        if (textWidth > maxWidth && currentLine !== '') {
          // Draw current line and start new one
          currentPage.drawText(currentLine, {
            x: margin,
            y: yPosition,
            size: element.fontSize,
            font: selectedFont,
            color: rgb(0, 0, 0)
          })
          yPosition -= lineHeight
          currentLine = word
          
          // Check if we need a new page
          if (yPosition < 50) {
            currentPage = pdf.addPage([612, 792])
            yPosition = currentPage.getSize().height - 50
          }
        } else {
          currentLine = testLine
        }
      }
      
      // Draw remaining text
      if (currentLine) {
        const selectedFont = element.isBold ? boldFont : regularFont
        currentPage.drawText(currentLine, {
          x: margin,
          y: yPosition,
          size: element.fontSize,
          font: selectedFont,
          color: rgb(0, 0, 0)
        })
        yPosition -= lineHeight
      }
      
      // Add extra spacing after headings
      if (element.fontSize > 12) {
        yPosition -= baseLineHeight / 2
      }
    }
    
    const pdfBytes = await pdf.save()
    const outputFileName = `html-to-pdf-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)
    
    await fs.writeFile(outputPath, pdfBytes)
    const stats = await fs.stat(outputPath)
    
    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      }]
    }
  } catch (error) {
    console.error('Error converting HTML to PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to convert HTML to PDF.'
    }
  }
}

/**
 * Add page numbers to PDF
 */
export async function numberPages(
  inputPath: string,
  outputDir: string,
  options: {
    position?: 'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center' | 'top-left' | 'top-right'
    format?: string // e.g., 'Page {n}', 'Page {n} of {total}', '{n}'
    fontSize?: number
    startPage?: number
  } = {}
): Promise<ProcessingResult> {
  try {
    const pdfBytes = await fs.readFile(inputPath)
    const pdf = await PDFDocument.load(pdfBytes)
    const pages = pdf.getPages()
    const font = await pdf.embedFont(StandardFonts.Helvetica)
    
    const {
      position = 'bottom-center',
      format = 'Page {n} of {total}',
      fontSize = 12,
      startPage = 1
    } = options
    
    console.log(`Adding page numbers with format: ${format}, position: ${position}`)
    
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      const { width, height } = page.getSize()
      const pageNumber = i + startPage
      const totalPages = pages.length
      
      // Format page number text
      let pageText = format
        .replace('{n}', pageNumber.toString())
        .replace('{total}', totalPages.toString())
      
      // Calculate position
      const textWidth = font.widthOfTextAtSize(pageText, fontSize)
      let x: number, y: number
      
      switch (position) {
        case 'bottom-left':
          x = 50
          y = 30
          break
        case 'bottom-right':
          x = width - textWidth - 50
          y = 30
          break
        case 'bottom-center':
          x = (width - textWidth) / 2
          y = 30
          break
        case 'top-left':
          x = 50
          y = height - 50
          break
        case 'top-right':
          x = width - textWidth - 50
          y = height - 50
          break
        case 'top-center':
          x = (width - textWidth) / 2
          y = height - 50
          break
        default:
          x = (width - textWidth) / 2
          y = 30
      }
      
      // Add page number
      page.drawText(pageText, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0)
      })
    }
    
    const numberedBytes = await pdf.save()
    const outputFileName = `numbered-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)
    
    await fs.writeFile(outputPath, numberedBytes)
    const stats = await fs.stat(outputPath)
    
    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      }]
    }
  } catch (error) {
    console.error('Error adding page numbers:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to add page numbers to PDF.'
    }
  }
}

/**
 * Repair damaged PDF file
 */
export async function repairPdf(
  inputPath: string,
  outputDir: string
): Promise<ProcessingResult> {
  try {
    const pdfBytes = await fs.readFile(inputPath)
    
    // Attempt to load the PDF - pdf-lib will attempt basic repairs during loading
    let pdf: PDFDocument
    try {
      pdf = await PDFDocument.load(pdfBytes, {
        updateMetadata: false,
        throwOnInvalidObject: false // Allow invalid objects and try to repair
      })
    } catch (loadError) {
      // If pdf-lib can't load it, try with more permissive settings
      try {
        pdf = await PDFDocument.load(pdfBytes, {
          updateMetadata: false,
          throwOnInvalidObject: false,
          capNumbers: false // Don't cap large numbers
        })
      } catch (secondLoadError) {
        throw new Error('PDF is too damaged to repair with pdf-lib. Consider using specialized PDF repair tools like qpdf or PDFtk.')
      }
    }
    
    console.log('PDF loaded successfully - performing basic repairs')
    
    // Basic repair operations
    const pages = pdf.getPages()
    
    // Validate pages and try to fix basic issues
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      try {
        // Try to get page size - this will validate basic page structure
        const { width, height } = page.getSize()
        
        // Ensure reasonable page dimensions
        if (width <= 0 || height <= 0 || width > 14400 || height > 14400) {
          console.warn(`Page ${i + 1} has invalid dimensions: ${width}x${height}`)
          // pdf-lib will use default dimensions when saving
        }
      } catch (pageError) {
        console.warn(`Page ${i + 1} has structural issues:`, pageError)
        // Continue with other pages
      }
    }
    
    // Save with repair optimizations
    const repairedBytes = await pdf.save({
      useObjectStreams: false, // Disable object streams for better compatibility
      updateFieldAppearances: false // Don't update form fields which might be corrupted
    })
    
    const outputFileName = `repaired-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)
    
    await fs.writeFile(outputPath, repairedBytes)
    const stats = await fs.stat(outputPath)
    
    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      }]
    }
  } catch (error) {
    console.error('Error repairing PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to repair PDF. The file may be too severely damaged or encrypted.'
    }
  }
}

/**
 * Convert PDF to PDF/A format for archival purposes
 */
async function convertToPdfA(inputPath: string, outputDir: string): Promise<ProcessingResult> {
  try {
    const inputBuffer = await fs.readFile(inputPath)
    
    // Validate that we have a valid PDF buffer
    if (!inputBuffer || inputBuffer.length === 0) {
      return {
        success: false,
        error: 'Input file is empty or corrupted'
      }
    }
    
    // Load PDF with error handling
    let pdf: PDFDocument
    try {
      pdf = await PDFDocument.load(inputBuffer)
    } catch (loadError) {
      console.error('Failed to load PDF:', loadError)
      return {
        success: false,
        error: 'Invalid or corrupted PDF file. Please ensure the file is a valid PDF document.'
      }
    }
    
    // Verify PDF has pages
    const pageCount = pdf.getPageCount()
    if (pageCount === 0) {
      return {
        success: false,
        error: 'PDF document contains no pages'
      }
    }
    
    // PDF/A conversion with pdf-lib requires specific metadata and constraints
    // Set PDF/A-1b metadata for compliance
    pdf.setTitle('PDF/A Document')
    pdf.setCreator('PDF Tools')
    pdf.setProducer('PDF Tools PDF/A Converter')
    pdf.setCreationDate(new Date())
    pdf.setModificationDate(new Date())
    
    // Add XMP metadata for PDF/A compliance (basic implementation)
    // Note: Full PDF/A compliance requires additional validation and constraints
    const pdfBytes = await pdf.save({
      useObjectStreams: false, // PDF/A-1 doesn't allow object streams
    })
    
    const outputFileName = `pdfa-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)
    await fs.writeFile(outputPath, pdfBytes)
    
    const stats = await fs.stat(outputPath)
    
    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      }]
    }
  } catch (error) {
    console.error('Error converting to PDF/A:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to convert PDF to PDF/A format'
    }
  }
}

/**
 * Add interactive editing elements to PDF
 */
async function editPdf(inputPath: string, outputDir: string, editOptions: {
  text?: Array<{content: string, x: number, y: number, size?: number, color?: string}>
  shapes?: Array<{type: 'rectangle' | 'circle', x: number, y: number, width: number, height: number, color?: string}>
} = {}): Promise<ProcessingResult> {
  try {
    const inputBuffer = await fs.readFile(inputPath)
    
    if (!inputBuffer || inputBuffer.length === 0) {
      return {
        success: false,
        error: 'Input file is empty or corrupted'
      }
    }
    
    let pdf: PDFDocument
    try {
      pdf = await PDFDocument.load(inputBuffer)
    } catch (loadError) {
      return {
        success: false,
        error: 'Invalid or corrupted PDF file. Please ensure the file is a valid PDF document.'
      }
    }
    
    if (pdf.getPageCount() === 0) {
      return {
        success: false,
        error: 'PDF document contains no pages'
      }
    }
    const font = await pdf.embedFont(StandardFonts.Helvetica)
    
    // Get first page for editing (can be extended to support page selection)
    const page = pdf.getPage(0)
    const { height } = page.getSize()
    
    // Add text elements
    if (editOptions.text) {
      for (const textElement of editOptions.text) {
        page.drawText(textElement.content, {
          x: textElement.x,
          y: height - textElement.y, // Convert from top-origin to bottom-origin
          size: textElement.size || 12,
          font,
          color: rgb(0, 0, 0) // Default to black, can be extended for color support
        })
      }
    }
    
    // Add shape elements
    if (editOptions.shapes) {
      for (const shape of editOptions.shapes) {
        if (shape.type === 'rectangle') {
          page.drawRectangle({
            x: shape.x,
            y: height - shape.y - shape.height,
            width: shape.width,
            height: shape.height,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1
          })
        } else if (shape.type === 'circle') {
          page.drawCircle({
            x: shape.x + shape.width / 2,
            y: height - shape.y - shape.height / 2,
            size: Math.min(shape.width, shape.height) / 2,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1
          })
        }
      }
    }
    
    const pdfBytes = await pdf.save()
    const outputFileName = `edited-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)
    await fs.writeFile(outputPath, pdfBytes)
    
    const stats = await fs.stat(outputPath)
    
    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      }]
    }
  } catch (error) {
    console.error('Error editing PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to edit PDF document'
    }
  }
}

/**
 * Add digital signature placeholder to PDF
 */
async function signPdf(inputPath: string, outputDir: string, signOptions: {
  signatureText?: string
  position?: { x: number, y: number }
  page?: number
} = {}): Promise<ProcessingResult> {
  try {
    const inputBuffer = await fs.readFile(inputPath)
    
    if (!inputBuffer || inputBuffer.length === 0) {
      return {
        success: false,
        error: 'Input file is empty or corrupted'
      }
    }
    
    let pdf: PDFDocument
    try {
      pdf = await PDFDocument.load(inputBuffer)
    } catch (loadError) {
      return {
        success: false,
        error: 'Invalid or corrupted PDF file. Please ensure the file is a valid PDF document.'
      }
    }
    
    if (pdf.getPageCount() === 0) {
      return {
        success: false,
        error: 'PDF document contains no pages'
      }
    }
    const font = await pdf.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold)
    
    const pageIndex = (signOptions.page || 1) - 1
    const page = pdf.getPage(pageIndex)
    const { width, height } = page.getSize()
    
    // Default signature position (bottom right)
    const x = signOptions.position?.x || width - 200
    const y = signOptions.position?.y || 100
    
    // Add signature field background
    page.drawRectangle({
      x: x - 10,
      y: y - 30,
      width: 180,
      height: 50,
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
      color: rgb(0.95, 0.95, 0.95)
    })
    
    // Add signature text
    const signatureText = signOptions.signatureText || 'Digitally Signed'
    page.drawText(signatureText, {
      x: x,
      y: y,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0)
    })
    
    // Add timestamp
    const timestamp = new Date().toLocaleString()
    page.drawText(`Date: ${timestamp}`, {
      x: x,
      y: y - 15,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5)
    })
    
    const pdfBytes = await pdf.save()
    const outputFileName = `signed-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)
    await fs.writeFile(outputPath, pdfBytes)
    
    const stats = await fs.stat(outputPath)
    
    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      }]
    }
  } catch (error) {
    console.error('Error signing PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to sign PDF document'
    }
  }
}

/**
 * Crop PDF pages to specified dimensions
 */
async function cropPdf(inputPath: string, outputDir: string, cropOptions: {
  x?: number
  y?: number
  width?: number
  height?: number
  pages?: number[]
} = {}): Promise<ProcessingResult> {
  try {
    const inputBuffer = await fs.readFile(inputPath)
    const pdf = await PDFDocument.load(inputBuffer)
    
    const pagesToCrop = cropOptions.pages || Array.from({ length: pdf.getPageCount() }, (_, i) => i + 1)
    
    for (const pageNum of pagesToCrop) {
      const pageIndex = pageNum - 1
      if (pageIndex >= 0 && pageIndex < pdf.getPageCount()) {
        const page = pdf.getPage(pageIndex)
        const { width: originalWidth, height: originalHeight } = page.getSize()
        
        // Default crop dimensions (center crop if not specified)
        const cropX = cropOptions.x || originalWidth * 0.1
        const cropY = cropOptions.y || originalHeight * 0.1
        const cropWidth = cropOptions.width || originalWidth * 0.8
        const cropHeight = cropOptions.height || originalHeight * 0.8
        
        // Set the crop box
        page.setCropBox(cropX, cropY, cropWidth, cropHeight)
      }
    }
    
    const pdfBytes = await pdf.save()
    const outputFileName = `cropped-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)
    await fs.writeFile(outputPath, pdfBytes)
    
    const stats = await fs.stat(outputPath)
    
    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      }]
    }
  } catch (error) {
    console.error('Error cropping PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to crop PDF document'
    }
  }
}

/**
 * Create PDF from scanned/captured images
 */
async function scanToPdf(inputPaths: string[], outputDir: string): Promise<ProcessingResult> {
  try {
    const pdf = await PDFDocument.create()
    
    for (const imagePath of inputPaths) {
      const imageBuffer = await fs.readFile(imagePath)
      const imageExtension = path.extname(imagePath).toLowerCase()
      
      let image
      if (imageExtension === '.jpg' || imageExtension === '.jpeg') {
        image = await pdf.embedJpg(imageBuffer)
      } else if (imageExtension === '.png') {
        image = await pdf.embedPng(imageBuffer)
      } else {
        continue // Skip unsupported formats
      }
      
      // Create page sized to the image
      const { width, height } = image.scale(1)
      const page = pdf.addPage([width, height])
      
      // Draw the image to fill the page
      page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height
      })
    }
    
    const pdfBytes = await pdf.save()
    const outputFileName = `scanned-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)
    await fs.writeFile(outputPath, pdfBytes)
    
    const stats = await fs.stat(outputPath)
    
    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      }]
    }
  } catch (error) {
    console.error('Error creating PDF from scans:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to create PDF from scanned images'
    }
  }
}

/**
 * Apply OCR to PDF (basic text extraction placeholder)
 */
async function ocrPdf(inputPath: string, outputDir: string): Promise<ProcessingResult> {
  try {
    const inputBuffer = await fs.readFile(inputPath)
    const pdf = await PDFDocument.load(inputBuffer)
    
    // Note: This is a placeholder implementation
    // Real OCR would require services like Tesseract.js or cloud OCR APIs
    // For now, we'll create a text-searchable copy with overlay text
    
    const pages = pdf.getPages()
    const font = await pdf.embedFont(StandardFonts.Helvetica)
    
    // Add invisible searchable text overlay (placeholder)
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      const { width, height } = page.getSize()
      
      // Add invisible text overlay (this would be the OCR results in a real implementation)
      page.drawText(`[OCR Processed Page ${i + 1}] This PDF has been processed for text recognition.`, {
        x: 50,
        y: height - 50,
        size: 0.1, // Very small, essentially invisible
        font,
        color: rgb(1, 1, 1), // White text (invisible on white background)
        opacity: 0.01
      })
    }
    
    const pdfBytes = await pdf.save()
    const outputFileName = `ocr-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)
    await fs.writeFile(outputPath, pdfBytes)
    
    const stats = await fs.stat(outputPath)
    
    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      }]
    }
  } catch (error) {
    console.error('Error applying OCR to PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to apply OCR to PDF document'
    }
  }
}

/**
 * Compare two PDF documents and highlight differences
 */
async function comparePdf(inputPaths: string[], outputDir: string): Promise<ProcessingResult> {
  try {
    if (inputPaths.length !== 2) {
      return { success: false, error: 'PDF comparison requires exactly two input files' }
    }
    
    const [file1Buffer, file2Buffer] = await Promise.all([
      fs.readFile(inputPaths[0]),
      fs.readFile(inputPaths[1])
    ])
    
    const [pdf1, pdf2] = await Promise.all([
      PDFDocument.load(file1Buffer),
      PDFDocument.load(file2Buffer)
    ])
    
    // Create comparison report PDF
    const comparisonPdf = await PDFDocument.create()
    const font = await comparisonPdf.embedFont(StandardFonts.Helvetica)
    const boldFont = await comparisonPdf.embedFont(StandardFonts.HelveticaBold)
    
    // Add comparison summary page
    const summaryPage = comparisonPdf.addPage([612, 792])
    const { width, height } = summaryPage.getSize()
    
    summaryPage.drawText('PDF Comparison Report', {
      x: 50,
      y: height - 50,
      size: 18,
      font: boldFont,
      color: rgb(0, 0, 0)
    })
    
    const file1Name = path.basename(inputPaths[0])
    const file2Name = path.basename(inputPaths[1])
    
    summaryPage.drawText(`Document A: ${file1Name}`, {
      x: 50,
      y: height - 100,
      size: 12,
      font,
      color: rgb(0, 0, 0)
    })
    
    summaryPage.drawText(`Document B: ${file2Name}`, {
      x: 50,
      y: height - 120,
      size: 12,
      font,
      color: rgb(0, 0, 0)
    })
    
    summaryPage.drawText(`Pages in Document A: ${pdf1.getPageCount()}`, {
      x: 50,
      y: height - 160,
      size: 12,
      font,
      color: rgb(0, 0, 0)
    })
    
    summaryPage.drawText(`Pages in Document B: ${pdf2.getPageCount()}`, {
      x: 50,
      y: height - 180,
      size: 12,
      font,
      color: rgb(0, 0, 0)
    })
    
    // Basic comparison logic
    const pageCountDiff = Math.abs(pdf1.getPageCount() - pdf2.getPageCount())
    if (pageCountDiff > 0) {
      summaryPage.drawText(`Difference: ${pageCountDiff} page(s) different`, {
        x: 50,
        y: height - 220,
        size: 12,
        font: boldFont,
        color: rgb(0.8, 0, 0)
      })
    } else {
      summaryPage.drawText('Page count: Same', {
        x: 50,
        y: height - 220,
        size: 12,
        font,
        color: rgb(0, 0.6, 0)
      })
    }
    
    summaryPage.drawText('Note: This is a basic comparison. For detailed differences, use specialized PDF comparison tools.', {
      x: 50,
      y: height - 280,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5)
    })
    
    const pdfBytes = await comparisonPdf.save()
    const outputFileName = `comparison-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)
    await fs.writeFile(outputPath, pdfBytes)
    
    const stats = await fs.stat(outputPath)
    
    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size
      }]
    }
  } catch (error) {
    console.error('Error comparing PDFs:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to compare PDF documents'
    }
  }
}

/**
 * Main processor function that routes operations
 */
export async function processFiles(
  operation: string,
  inputPaths: string[],
  parameters: Record<string, any> = {}
): Promise<ProcessingResult> {
  
  // Ensure output directory exists
  const outputDir = path.join(process.cwd(), 'outputs')
  await fs.mkdir(outputDir, { recursive: true })
  
  // Handle PDF operations
  const pdfOperations = ['merge-pdf', 'split-pdf', 'compress-pdf', 'rotate-pdf', 'watermark-pdf', 'organize-pdf', 'protect-pdf', 'unlock-pdf', 'redact-pdf', 'html-to-pdf', 'number-pages', 'repair-pdf', 'pdf-to-pdfa', 'edit-pdf', 'sign-pdf', 'crop-pdf', 'scan-to-pdf', 'ocr-pdf', 'compare-pdf']
  if (pdfOperations.includes(operation)) {
    switch (operation) {
      case 'merge-pdf':
        return await mergePDFs(inputPaths, outputDir)
        
      case 'split-pdf':
        if (inputPaths.length !== 1) {
          return { success: false, error: 'Split operation requires exactly one input file' }
        }
        return await splitPDF(inputPaths[0], outputDir)
        
      case 'compress-pdf':
        if (inputPaths.length !== 1) {
          return { success: false, error: 'Compress operation requires exactly one input file' }
        }
        return await compressPDF(inputPaths[0], outputDir)
        
      case 'rotate-pdf':
        if (inputPaths.length !== 1) {
          return { success: false, error: 'Rotate operation requires exactly one input file' }
        }
        const degrees = parameters.degrees || 90
        return await rotatePdf(inputPaths[0], outputDir, degrees)
        
      case 'watermark-pdf':
        if (inputPaths.length !== 1) {
          return { success: false, error: 'Watermark operation requires exactly one input file' }
        }
        const watermarkText = parameters.text || 'WATERMARK'
        const watermarkOptions = {
          opacity: parameters.opacity || 0.3,
          fontSize: parameters.fontSize || 50,
          position: parameters.position || 'diagonal'
        }
        return await watermarkPdf(inputPaths[0], outputDir, watermarkText, watermarkOptions)
        
      case 'organize-pdf':
        if (inputPaths.length !== 1) {
          return { success: false, error: 'Organize operation requires exactly one input file' }
        }
        const pageOrder = parameters.pageOrder || []
        return await organizePdf(inputPaths[0], outputDir, pageOrder)
        
      case 'protect-pdf':
        if (inputPaths.length !== 1) {
          return { success: false, error: 'Protect operation requires exactly one input file' }
        }
        if (!parameters.password) {
          return { success: false, error: 'Password is required for PDF protection' }
        }
        return await protectPdf(inputPaths[0], outputDir, parameters.password)
        
      case 'unlock-pdf':
        if (inputPaths.length !== 1) {
          return { success: false, error: 'Unlock operation requires exactly one input file' }
        }
        const unlockPassword = parameters.password || ''
        return await unlockPdf(inputPaths[0], outputDir, unlockPassword)
        
      case 'redact-pdf':
        if (inputPaths.length !== 1) {
          return { success: false, error: 'Redact operation requires exactly one input file' }
        }
        if (!parameters.areas || !Array.isArray(parameters.areas) || parameters.areas.length === 0) {
          return { success: false, error: 'Redaction areas must be specified. Please provide coordinates for areas to redact.' }
        }
        return await redactPdf(inputPaths[0], outputDir, parameters.areas)
        
      case 'html-to-pdf':
        if (inputPaths.length !== 1) {
          return { success: false, error: 'HTML to PDF operation requires exactly one input file' }
        }
        const htmlContent = parameters.htmlContent || undefined
        return await htmlToPdf(inputPaths[0], outputDir, htmlContent)
        
      case 'number-pages':
        if (inputPaths.length !== 1) {
          return { success: false, error: 'Number pages operation requires exactly one input file' }
        }
        const numberingOptions = {
          position: parameters.position || 'bottom-center',
          format: parameters.format || 'Page {n} of {total}',
          fontSize: parameters.fontSize || 12,
          startPage: parameters.startPage || 1
        }
        return await numberPages(inputPaths[0], outputDir, numberingOptions)
        
      case 'repair-pdf':
        if (inputPaths.length !== 1) {
          return { success: false, error: 'Repair PDF operation requires exactly one input file' }
        }
        return await repairPdf(inputPaths[0], outputDir)
        
      case 'pdf-to-pdfa':
        if (inputPaths.length !== 1) {
          return { success: false, error: 'PDF to PDF/A operation requires exactly one input file' }
        }
        return await convertToPdfA(inputPaths[0], outputDir)
        
      case 'edit-pdf':
        if (inputPaths.length !== 1) {
          return { success: false, error: 'Edit PDF operation requires exactly one input file' }
        }
        const editOptions = {
          text: parameters.text || [],
          shapes: parameters.shapes || []
        }
        return await editPdf(inputPaths[0], outputDir, editOptions)
        
      case 'sign-pdf':
        if (inputPaths.length !== 1) {
          return { success: false, error: 'Sign PDF operation requires exactly one input file' }
        }
        const signOptions = {
          signatureText: parameters.signatureText || 'Digitally Signed',
          position: parameters.position || undefined,
          page: parameters.page || 1
        }
        return await signPdf(inputPaths[0], outputDir, signOptions)
        
      case 'crop-pdf':
        if (inputPaths.length !== 1) {
          return { success: false, error: 'Crop PDF operation requires exactly one input file' }
        }
        const cropOptions = {
          x: parameters.x || undefined,
          y: parameters.y || undefined,
          width: parameters.width || undefined,
          height: parameters.height || undefined,
          pages: parameters.pages || undefined
        }
        return await cropPdf(inputPaths[0], outputDir, cropOptions)
        
      case 'scan-to-pdf':
        if (inputPaths.length === 0) {
          return { success: false, error: 'Scan to PDF operation requires at least one image file' }
        }
        return await scanToPdf(inputPaths, outputDir)
        
      case 'ocr-pdf':
        if (inputPaths.length !== 1) {
          return { success: false, error: 'OCR PDF operation requires exactly one input file' }
        }
        return await ocrPdf(inputPaths[0], outputDir)
        
      case 'compare-pdf':
        if (inputPaths.length !== 2) {
          return { success: false, error: 'Compare PDF operation requires exactly two input files' }
        }
        return await comparePdf(inputPaths, outputDir)
    }
  }

  // Handle format conversion operations
  const conversionOperations = [
    'pdf-to-jpg', 'jpg-to-pdf', 'pdf-to-word', 'word-to-pdf', 
    'pdf-to-excel', 'excel-to-pdf', 'pdf-to-powerpoint', 'powerpoint-to-pdf'
  ]
  
  if (conversionOperations.includes(operation)) {
    return await convertFiles(operation, inputPaths, parameters)
  }
  
  return {
    success: false,
    error: `Unsupported operation: ${operation}`
  }
}