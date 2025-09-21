import { ThemeProvider } from '../ThemeProvider'
import { ToolCard } from '../ToolCard'
import { FileText } from 'lucide-react'

export default function ToolCardExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background">
        <div className="max-w-xs">
          <ToolCard
            title="Merge PDF"
            description="Combine PDFs in the order you want with the easiest PDF merger available."
            icon={FileText}
            category="Organize PDF"
            onClick={() => console.log('Merge PDF clicked')}
          />
        </div>
      </div>
    </ThemeProvider>
  )
}