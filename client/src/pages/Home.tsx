import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { ToolsGrid } from '@/components/ToolsGrid'
import { Footer } from '@/components/Footer'
import { SEO } from '@/components/SEO'

export function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Free Online PDF Tools"
        description="100% free online PDF tools with 25+ features. Merge, compress, split, convert, edit, and secure PDFs instantly. No registration, no watermarks, no limits. Try now!"
        keywords="free PDF tools, merge PDF, compress PDF, split PDF, convert PDF, edit PDF, PDF converter, online PDF editor, PDF utilities, PDF manipulation"
        canonical="https://free-online-pdf-tools.replit.app/"
      />
      <Header />
      <main>
        <Hero />
        <ToolsGrid />
      </main>
      <Footer />
    </div>
  )
}