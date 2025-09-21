import { PDFDocument } from 'pdf-lib'
import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import mammoth from 'mammoth'
import XLSX from 'xlsx'

export interface ConversionResult {
  success: boolean
  outputFiles?: Array<{
    fileName: string
    filePath: string
    fileSize: number
    fileType: string
  }>
  error?: string
}

/**
 * Convert PDF pages to JPG images
 */
export async function pdfToJpg(inputPath: string, outputDir: string): Promise<ConversionResult> {
  try {
    const pdfBytes = await fs.readFile(inputPath)
    const pdf = await PDFDocument.load(pdfBytes)
    const pageCount = pdf.getPageCount()
    
    const outputFiles: Array<{
      fileName: string
      filePath: string
      fileSize: number
      fileType: string
    }> = []

    // Note: pdf-lib doesn't have direct image rendering capability
    // For a complete implementation, we'd need pdf2pic or similar
    // For now, we'll create a placeholder implementation
    
    for (let i = 0; i < pageCount; i++) {
      const outputFileName = `page-${i + 1}-${Date.now()}.jpg`
      const outputPath = path.join(outputDir, outputFileName)
      
      // Placeholder: Create a simple image indicating the conversion
      // In production, you'd use a library like pdf2pic or similar
      const placeholderBuffer = await sharp({
        create: {
          width: 800,
          height: 1000,
          channels: 3,
          background: { r: 255, g: 255, b: 255 }
        }
      })
      .jpeg()
      .toBuffer()
      
      await fs.writeFile(outputPath, placeholderBuffer)
      const stats = await fs.stat(outputPath)
      
      outputFiles.push({
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size,
        fileType: 'image/jpeg'
      })
    }
    
    return { success: true, outputFiles }
  } catch (error) {
    console.error('Error converting PDF to JPG:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Convert JPG images to PDF
 */
export async function jpgToPdf(inputPaths: string[], outputDir: string): Promise<ConversionResult> {
  try {
    const pdfDoc = await PDFDocument.create()
    
    for (const inputPath of inputPaths) {
      console.log('Processing image:', inputPath)
      const imageBytes = await fs.readFile(inputPath)
      
      // Get file extension and original name for better error reporting
      const fileExt = path.extname(inputPath).toLowerCase()
      const fileName = path.basename(inputPath)
      
      console.log('File extension detected:', fileExt, 'for file:', fileName)
      
      let image
      
      // Try to embed image based on extension, with fallback logic
      try {
        if (fileExt === '.jpg' || fileExt === '.jpeg') {
          image = await pdfDoc.embedJpg(imageBytes)
        } else if (fileExt === '.png') {
          image = await pdfDoc.embedPng(imageBytes)
        } else {
          // Try JPG first as fallback, then PNG
          try {
            console.log('Unknown extension, trying JPG format for:', fileName)
            image = await pdfDoc.embedJpg(imageBytes)
          } catch (jpgError) {
            console.log('JPG failed, trying PNG format for:', fileName)
            try {
              image = await pdfDoc.embedPng(imageBytes)
            } catch (pngError) {
              throw new Error(`Unsupported image format: ${fileExt} for file ${fileName}. Neither JPG nor PNG embedding worked.`)
            }
          }
        }
      } catch (embedError) {
        throw new Error(`Failed to embed image ${fileName} (${fileExt}): ${embedError instanceof Error ? embedError.message : 'Unknown embed error'}`)
      }
      
      // Create page sized to image
      const page = pdfDoc.addPage([image.width, image.height])
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height
      })
      
      console.log('Successfully processed image:', fileName)
    }
    
    const pdfBytes = await pdfDoc.save()
    const outputFileName = `images-to-pdf-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)
    
    await fs.writeFile(outputPath, pdfBytes)
    const stats = await fs.stat(outputPath)
    
    console.log('PDF created successfully:', outputFileName)
    
    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size,
        fileType: 'application/pdf'
      }]
    }
  } catch (error) {
    console.error('Error converting JPG to PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Convert PDF to Word document
 */
export async function pdfToWord(inputPath: string, outputDir: string): Promise<ConversionResult> {
  try {
    // Note: Direct PDF to Word conversion is complex and would require OCR
    // This is a simplified implementation that creates a basic Word document
    // In production, you'd use a service like Adobe API or implement OCR
    
    const pdfBytes = await fs.readFile(inputPath)
    const pdf = await PDFDocument.load(pdfBytes)
    const pageCount = pdf.getPageCount()
    
    // Create a simple text document
    const content = `Converted PDF Document\n\nThis document was converted from PDF.\nOriginal PDF had ${pageCount} pages.\n\nNote: This is a basic conversion. Full PDF to Word conversion requires OCR technology.`
    
    const outputFileName = `converted-${Date.now()}.txt`
    const outputPath = path.join(outputDir, outputFileName)
    
    await fs.writeFile(outputPath, content, 'utf8')
    const stats = await fs.stat(outputPath)
    
    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size,
        fileType: 'text/plain'
      }]
    }
  } catch (error) {
    console.error('Error converting PDF to Word:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Convert Word document to PDF
 */
export async function wordToPdf(inputPath: string, outputDir: string): Promise<ConversionResult> {
  try {
    // Extract text from Word document
    const result = await mammoth.extractRawText({ path: inputPath })
    const text = result.value
    
    // Create PDF with the extracted text
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842]) // A4 size
    const fontSize = 12
    const margin = 50
    const maxWidth = 595 - 2 * margin
    
    // Split text into lines that fit the page width
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word
      if (testLine.length * fontSize * 0.6 > maxWidth) {
        if (currentLine) {
          lines.push(currentLine)
          currentLine = word
        } else {
          lines.push(word)
        }
      } else {
        currentLine = testLine
      }
    }
    if (currentLine) lines.push(currentLine)
    
    // Draw text on PDF
    let yPosition = 842 - margin - fontSize
    for (const line of lines) {
      if (yPosition < margin) {
        // Add new page if needed
        const newPage = pdfDoc.addPage([595, 842])
        yPosition = 842 - margin - fontSize
        newPage.drawText(line, {
          x: margin,
          y: yPosition,
          size: fontSize
        })
      } else {
        page.drawText(line, {
          x: margin,
          y: yPosition,
          size: fontSize
        })
      }
      yPosition -= fontSize + 4
    }
    
    const pdfBytes = await pdfDoc.save()
    const outputFileName = `word-to-pdf-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)
    
    await fs.writeFile(outputPath, pdfBytes)
    const stats = await fs.stat(outputPath)
    
    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size,
        fileType: 'application/pdf'
      }]
    }
  } catch (error) {
    console.error('Error converting Word to PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Convert Excel to PDF
 */
export async function excelToPdf(inputPath: string, outputDir: string): Promise<ConversionResult> {
  try {
    console.log('Processing Excel file:', inputPath)
    
    // Check if XLSX.readFile exists, otherwise try alternative methods
    let workbook
    if (typeof XLSX.readFile === 'function') {
      workbook = XLSX.readFile(inputPath)
    } else {
      // Try reading as buffer and then parsing
      const buffer = await fs.readFile(inputPath)
      workbook = XLSX.read(buffer, { type: 'buffer' })
    }
    
    const sheetNames = workbook.SheetNames
    console.log('Excel sheets found:', sheetNames)
    
    // Create PDF with Excel data
    const pdfDoc = await PDFDocument.create()
    
    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName]
      const csvData = XLSX.utils.sheet_to_csv(worksheet)
      
      const page = pdfDoc.addPage([842, 595]) // A4 landscape for better table fit
      const fontSize = 10
      const margin = 30
      
      // Split CSV into lines and draw on PDF
      const lines = csvData.split('\n').slice(0, 50) // Limit lines to fit page
      let yPosition = 595 - margin - fontSize
      
      page.drawText(`Sheet: ${sheetName}`, {
        x: margin,
        y: yPosition,
        size: fontSize + 2
      })
      yPosition -= fontSize + 10
      
      for (const line of lines) {
        if (yPosition < margin) break
        
        const cells = line.split(',').slice(0, 8) // Limit columns to fit width
        let xPosition = margin
        
        for (const cell of cells) {
          if (xPosition > 800) break
          page.drawText(cell.substring(0, 15), { // Limit cell text length
            x: xPosition,
            y: yPosition,
            size: fontSize
          })
          xPosition += 90
        }
        yPosition -= fontSize + 2
      }
    }
    
    const pdfBytes = await pdfDoc.save()
    const outputFileName = `excel-to-pdf-${Date.now()}.pdf`
    const outputPath = path.join(outputDir, outputFileName)
    
    await fs.writeFile(outputPath, pdfBytes)
    const stats = await fs.stat(outputPath)
    
    return {
      success: true,
      outputFiles: [{
        fileName: outputFileName,
        filePath: outputPath,
        fileSize: stats.size,
        fileType: 'application/pdf'
      }]
    }
  } catch (error) {
    console.error('Error converting Excel to PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Main conversion processor function
 */
export async function convertFiles(
  operation: string,
  inputPaths: string[],
  parameters: Record<string, any> = {}
): Promise<ConversionResult> {
  
  // Ensure output directory exists
  const outputDir = path.join(process.cwd(), 'outputs')
  await fs.mkdir(outputDir, { recursive: true })
  
  switch (operation) {
    case 'pdf-to-jpg':
      if (inputPaths.length !== 1) {
        return { success: false, error: 'PDF to JPG conversion requires exactly one input file' }
      }
      return await pdfToJpg(inputPaths[0], outputDir)
      
    case 'jpg-to-pdf':
      return await jpgToPdf(inputPaths, outputDir)
      
    case 'pdf-to-word':
      if (inputPaths.length !== 1) {
        return { success: false, error: 'PDF to Word conversion requires exactly one input file' }
      }
      return await pdfToWord(inputPaths[0], outputDir)
      
    case 'word-to-pdf':
      if (inputPaths.length !== 1) {
        return { success: false, error: 'Word to PDF conversion requires exactly one input file' }
      }
      return await wordToPdf(inputPaths[0], outputDir)
      
    case 'excel-to-pdf':
      if (inputPaths.length !== 1) {
        return { success: false, error: 'Excel to PDF conversion requires exactly one input file' }
      }
      return await excelToPdf(inputPaths[0], outputDir)
      
    default:
      return {
        success: false,
        error: `Unsupported conversion operation: ${operation}`
      }
  }
}