import { FileText, Shield, Zap, Heart } from 'lucide-react'

const footerSections = [
  {
    title: 'Product',
    links: [
      { name: 'All Tools', href: '#' },
      { name: 'Features', href: '#' },
      { name: 'Pricing', href: '#' },
      { name: 'API', href: '#' }
    ]
  },
  {
    title: 'Solutions',
    links: [
      { name: 'For Business', href: '#' },
      { name: 'For Education', href: '#' },
      { name: 'For Developers', href: '#' },
      { name: 'Workflows', href: '#' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Help Center', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Tutorials', href: '#' },
      { name: 'Templates', href: '#' }
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' }
    ]
  }
]

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">PDF Tools</span>
            </div>
            <p className="text-muted-foreground max-w-md">
              The most trusted PDF editor used by millions worldwide. 
              Process your documents with confidence and ease.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-green-500" />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-green-500" />
                <span>HTTPS Secure</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      data-testid={`footer-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              <span>© 2025 Free Online PDF Tools</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Made with love for document processing</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}