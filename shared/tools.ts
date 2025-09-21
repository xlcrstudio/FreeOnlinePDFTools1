import { slugifyTitle } from './slug'

export interface ToolInfo {
  title: string
  slug: string
  category: string
}

// Tool titles extracted from the main tools data
const toolTitles = [
  // Organize PDF
  'Merge PDF',
  'Split PDF', 
  'Organize PDF',
  'Rotate PDF',
  
  // Optimize PDF
  'Compress PDF',
  'Repair PDF',
  
  // Convert PDF  
  'PDF to Word',
  'PDF to PowerPoint',
  'PDF to Excel',
  'PDF to JPG',
  'Word to PDF',
  'PowerPoint to PDF',
  'Excel to PDF',
  'JPG to PDF',
  'HTML to PDF',
  'PDF to PDFA',
  
  // Edit PDF
  'Edit PDF',
  'Sign PDF',
  'Watermark',
  'Number Pages',
  'Crop PDF',
  
  // PDF Security
  'Protect PDF',
  'Unlock PDF',
  'Redact PDF',
  
  // Advanced
  'Scan to PDF',
  'OCR PDF',
  'Compare PDF'
]

// Generate tools with slugs and categories
export const tools: ToolInfo[] = toolTitles.map(title => {
  let category = 'General'
  
  // Categorize based on title patterns
  if (['Merge PDF', 'Split PDF', 'Organize PDF', 'Rotate PDF'].includes(title)) {
    category = 'Organize PDF'
  } else if (['Compress PDF', 'Repair PDF'].includes(title)) {
    category = 'Optimize PDF'
  } else if (title.includes('to') || title.includes('PDF to') || title.includes('to PDF')) {
    category = 'Convert PDF'
  } else if (['Edit PDF', 'Sign PDF', 'Watermark', 'Number Pages', 'Crop PDF'].includes(title)) {
    category = 'Edit PDF'
  } else if (['Protect PDF', 'Unlock PDF', 'Redact PDF'].includes(title)) {
    category = 'PDF Security'
  } else if (['Scan to PDF', 'OCR PDF', 'Compare PDF'].includes(title)) {
    category = 'Advanced'
  }
  
  return {
    title,
    slug: slugifyTitle(title),
    category
  }
})

// Export just the slugs for easy iteration
export const toolSlugs = tools.map(tool => tool.slug)