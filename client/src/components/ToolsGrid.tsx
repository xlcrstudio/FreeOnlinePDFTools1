import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ToolCard } from './ToolCard'
import { 
  FileText, FileUp, Combine, SplitSquareVertical, Archive, 
  FileImage, ImageIcon, FileEdit, Signature, Droplets, RotateCw,
  Globe, Lock, Unlock, Building, FileType, Wrench,
  Hash, ScanLine, Eye, Copy, Scissors, Crop, 
  FileSearch, PlusCircle, Settings2
} from 'lucide-react'

const allTools = [
  // Organize PDF
  { title: 'Merge PDF', description: 'Combine PDFs in the order you want with the easiest PDF merger available.', icon: Combine, category: 'Organize PDF' },
  { title: 'Split PDF', description: 'Separate one page or a whole set for easy conversion into independent PDF files.', icon: SplitSquareVertical, category: 'Organize PDF' },
  { title: 'Organize PDF', description: 'Sort pages of your PDF file however you like. Delete PDF pages or add PDF pages to your document at your convenience.', icon: Building, category: 'Organize PDF' },
  { title: 'Rotate PDF', description: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!', icon: RotateCw, category: 'Organize PDF' },
  
  // Optimize PDF
  { title: 'Compress PDF', description: 'Reduce file size while optimizing for maximal PDF quality.', icon: Archive, category: 'Optimize PDF' },
  { title: 'Repair PDF', description: 'Fix corrupted or damaged PDF files and recover data from broken documents.', icon: Wrench, category: 'Optimize PDF' },
  
  // Convert PDF
  { title: 'PDF to Word', description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents. The converted WORD document is almost 100% accurate.', icon: FileText, category: 'Convert PDF' },
  { title: 'PDF to PowerPoint', description: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.', icon: FileUp, category: 'Convert PDF' },
  { title: 'PDF to Excel', description: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.', icon: FileType, category: 'Convert PDF' },
  { title: 'PDF to JPG', description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.', icon: FileImage, category: 'Convert PDF' },
  { title: 'Word to PDF', description: 'Make DOC and DOCX files easy to read by converting them to PDF.', icon: FileText, category: 'Convert PDF' },
  { title: 'PowerPoint to PDF', description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.', icon: FileUp, category: 'Convert PDF' },
  { title: 'Excel to PDF', description: 'Make EXCEL spreadsheets easy to read by converting them to PDF.', icon: FileType, category: 'Convert PDF' },
  { title: 'JPG to PDF', description: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.', icon: ImageIcon, category: 'Convert PDF' },
  { title: 'HTML to PDF', description: 'Convert HTML content to PDF with basic formatting support (headings, paragraphs, bold text).', icon: Globe, category: 'Convert PDF' },
  { title: 'PDF to PDFA', description: 'Transform your PDF to PDF/A, the ISO-standardized version of PDF for long-term archiving.', icon: FileType, category: 'Convert PDF' },
  
  // Edit PDF
  { title: 'Edit PDF', description: 'Add text, images, shapes or freehand annotations to a PDF document. Edit the size, font, and color of the added content.', icon: FileEdit, category: 'Edit PDF', isNew: true },
  { title: 'Sign PDF', description: 'Sign yourself or request electronic signatures from others.', icon: Signature, category: 'Edit PDF' },
  { title: 'Watermark', description: 'Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.', icon: Droplets, category: 'Edit PDF' },
  { title: 'Number Pages', description: 'Add page numbers to your PDF documents with customizable positioning and formatting.', icon: Hash, category: 'Edit PDF' },
  { title: 'Crop PDF', description: 'Crop margins of PDF documents or select specific areas, then apply the changes to one page or the whole document.', icon: Crop, category: 'Edit PDF', isNew: true },
  
  // PDF Security
  { title: 'Protect PDF', description: 'Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.', icon: Lock, category: 'PDF Security' },
  { title: 'Unlock PDF', description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.', icon: Unlock, category: 'PDF Security' },
  { title: 'Redact PDF', description: 'Redact text and graphics to permanently remove sensitive information from a PDF.', icon: Scissors, category: 'PDF Security', isNew: true },
  
  // Advanced
  { title: 'Scan to PDF', description: 'Capture document scans from your mobile device and send them instantly to your browser.', icon: ScanLine, category: 'Advanced' },
  { title: 'OCR PDF', description: 'Easily convert scanned PDF into searchable and selectable documents.', icon: FileSearch, category: 'Advanced' },
  { title: 'Compare PDF', description: 'Show a side-by-side document comparison and easily spot changes between different file versions.', icon: Eye, category: 'Advanced', isNew: true },
]

const categories = ['All', 'Organize PDF', 'Optimize PDF', 'Convert PDF', 'Edit PDF', 'PDF Security', 'Advanced']

export function ToolsGrid() {
  const [activeCategory, setActiveCategory] = useState('All')
  
  useEffect(() => {
    const handleCategoryFilter = (event: CustomEvent) => {
      setActiveCategory(event.detail.category)
    }
    
    window.addEventListener('categoryFilter', handleCategoryFilter as EventListener)
    
    return () => {
      window.removeEventListener('categoryFilter', handleCategoryFilter as EventListener)
    }
  }, [])

  const filteredTools = activeCategory === 'All' 
    ? allTools 
    : allTools.filter(tool => tool.category === activeCategory)

  return (
    <section id="tools" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose the perfect tool for your PDF needs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional-grade PDF tools that work seamlessly in your browser. No downloads required.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              className={activeCategory === category ? 'bg-primary text-primary-foreground' : ''}
              onClick={() => setActiveCategory(category)}
              data-testid={`filter-${category.toLowerCase().replace(' ', '-')}`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.title}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              category={tool.category}
              isNew={tool.isNew}
            />
          ))}
        </div>

        {/* Workflows Section */}
        <div className="mt-16 p-8 bg-secondary/30 rounded-xl">
          <div className="text-center space-y-4">
            <Settings2 className="h-12 w-12 text-primary mx-auto" />
            <h3 className="text-2xl font-bold text-foreground">Create Custom Workflows</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chain multiple PDF operations together to automate your document processing workflow.
            </p>
            <Button 
              variant="outline" 
              size="lg"
              data-testid="button-create-workflow"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Workflow
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}