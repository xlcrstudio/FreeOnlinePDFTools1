import { Card } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface ToolCardProps {
  title: string
  description: string
  icon: LucideIcon
  category: string
  isNew?: boolean
  onClick?: () => void
}

export function ToolCard({ title, description, icon: Icon, category, isNew = false, onClick }: ToolCardProps) {
  const handleClick = () => {
    console.log(`${title} tool clicked`)
    // Convert title to URL slug and handle special characters
    const slug = title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/\//g, '-')  // Convert '/' to '-' for PDF/A
      .replace(/[^\w-]/g, '') // Remove other special characters
    window.location.href = `/${slug}`
    onClick?.()
  }

  return (
    <Card 
      className="p-6 hover-elevate cursor-pointer transition-all duration-200 group relative"
      onClick={handleClick}
      data-testid={`tool-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {isNew && (
        <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full">
          New!
        </div>
      )}
      
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        
        <div className="text-xs text-muted-foreground/80 font-medium uppercase tracking-wide">
          {category}
        </div>
      </div>
    </Card>
  )
}