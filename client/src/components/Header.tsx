import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { BsFiletypePdf } from 'react-icons/bs'
import { ThemeToggle } from './ThemeToggle'

const toolCategories = [
  { name: 'All Tools', category: 'All' },
  { name: 'Organize PDF', category: 'Organize PDF' },
  { name: 'Optimize PDF', category: 'Optimize PDF' },
  { name: 'Convert PDF', category: 'Convert PDF' },
  { name: 'Edit PDF', category: 'Edit PDF' },
  { name: 'PDF Security', category: 'PDF Security' },
  { name: 'Advanced', category: 'Advanced' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleCategoryClick = (category: string) => {
    // Scroll to tools section
    const toolsSection = document.getElementById('tools')
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' })
    }
    
    // Trigger category filter by dispatching a custom event
    window.dispatchEvent(new CustomEvent('categoryFilter', { detail: { category } }))
    
    // Close mobile menu if open
    setMobileMenuOpen(false)
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <BsFiletypePdf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Free Online PDF Tools</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {toolCategories.map((category) => (
              <Button
                key={category.name}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => handleCategoryClick(category.category)}
                data-testid={`nav-${category.name.toLowerCase().replace(' ', '-')}`}
              >
                {category.name}
              </Button>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-2">
              {toolCategories.map((category) => (
                <Button
                  key={category.name}
                  variant="ghost"
                  className="justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => handleCategoryClick(category.category)}
                  data-testid={`mobile-nav-${category.name.toLowerCase().replace(' ', '-')}`}
                >
                  {category.name}
                </Button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}