import { Button } from '@/components/ui/button'
import { ArrowRight, FileText } from 'lucide-react'
import { useLocation } from 'wouter'

export function Hero() {
  const [, setLocation] = useLocation()
  
  const handleGetStarted = () => {
    console.log('Get Started clicked')
    // Scroll to tools section
    document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleLearnMore = () => {
    setLocation('/faq')
  }

  return (
    <section className="bg-gradient-to-br from-background to-secondary/30 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Every tool you need to work with{' '}
                <span className="text-primary">PDFs</span> in one place
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, 
                unlock and watermark PDFs with just a few clicks.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={handleGetStarted}
                data-testid="button-get-started"
              >
                <FileText className="mr-2 h-5 w-5" />
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={handleLearnMore}
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </div>

            <div className="flex items-center justify-center flex-wrap gap-x-8 gap-y-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>No Registration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Free Forever</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}