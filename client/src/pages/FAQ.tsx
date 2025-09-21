import { useState, useMemo } from 'react'
import { SEO } from '@/components/SEO'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import { faqData, faqCategories, FAQItem } from '@/data/faqData'

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  // Filter FAQs based on search term and category
  const filteredFAQs = useMemo(() => {
    return faqData.filter(faq => {
      const matchesSearch = 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  // Group FAQs by category for display
  const groupedFAQs = useMemo(() => {
    if (selectedCategory !== 'all') {
      return { [selectedCategory]: filteredFAQs }
    }
    
    return filteredFAQs.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = []
      }
      acc[faq.category].push(faq)
      return acc
    }, {} as Record<string, FAQItem[]>)
  }, [filteredFAQs, selectedCategory])

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  const expandAll = () => {
    setOpenItems(new Set(filteredFAQs.map(faq => faq.id)))
  }

  const collapseAll = () => {
    setOpenItems(new Set())
  }

  // Generate structured data for SEO
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqData.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  }

  return (
    <>
      <SEO
        title="Frequently Asked Questions | Free Online PDF Tools"
        description="Find answers to all your questions about our free PDF tools. Learn about security, features, file formats, technical support, and how to use our 25+ PDF processing tools."
        keywords="PDF tools FAQ, PDF converter questions, PDF merger help, PDF security, PDF processing support, free PDF tools help"
        canonical={`${window.location.origin}/faq`}
        schema={faqStructuredData}
      />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background to-secondary/30 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <HelpCircle className="h-16 w-16 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Find answers to common questions about our free PDF tools, security, features, and technical support.
              </p>
              
              {/* Search and Filter */}
              <div className="space-y-4 max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-base"
                    data-testid="input-faq-search"
                  />
                </div>
                
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                    data-testid="filter-all"
                  >
                    All Questions
                  </Button>
                  {faqCategories.map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      data-testid={`filter-${category.id}`}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Info and Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <div className="text-muted-foreground">
                Showing {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''}
                {searchTerm && ` for "${searchTerm}"`}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={expandAll}
                  data-testid="button-expand-all"
                >
                  Expand All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={collapseAll}
                  data-testid="button-collapse-all"
                >
                  Collapse All
                </Button>
              </div>
            </div>

            {/* FAQ Items */}
            {Object.keys(groupedFAQs).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground text-lg">
                    No questions found matching your search criteria.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('all')
                    }}
                    data-testid="button-clear-filters"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedFAQs).map(([categoryId, faqs]) => {
                  const category = faqCategories.find(c => c.id === categoryId)
                  
                  return (
                    <div key={categoryId} className="space-y-4">
                      {selectedCategory === 'all' && category && (
                        <div className="flex items-center gap-3 mb-6">
                          <Badge variant="secondary" className="text-sm">
                            {category.name}
                          </Badge>
                          <div className="flex-1 h-px bg-border"></div>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        {faqs.map((faq) => (
                          <Card key={faq.id} className="hover-elevate">
                            <Collapsible
                              open={openItems.has(faq.id)}
                              onOpenChange={() => toggleItem(faq.id)}
                            >
                              <CollapsibleTrigger className="w-full" data-testid={`faq-question-${faq.id}`}>
                                <CardContent className="p-6">
                                  <div className="flex items-start justify-between text-left">
                                    <h3 className="text-lg font-semibold text-foreground pr-4 leading-relaxed">
                                      {faq.question}
                                    </h3>
                                    <div className="flex-shrink-0 mt-1">
                                      {openItems.has(faq.id) ? (
                                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                      ) : (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <CardContent className="px-6 pb-6 pt-0">
                                  <div className="border-t border-border pt-4">
                                    <p className="text-muted-foreground leading-relaxed" data-testid={`faq-answer-${faq.id}`}>
                                      {faq.answer}
                                    </p>
                                  </div>
                                </CardContent>
                              </CollapsibleContent>
                            </Collapsible>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Contact Support Section */}
            <div className="mt-16 text-center">
              <Card className="bg-secondary/50">
                <CardContent className="py-12">
                  <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Still Have Questions?
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    If you couldn't find the answer you're looking for, feel free to contact our support team. 
                    We're here to help you with any questions about our PDF tools.
                  </p>
                  <Button 
                    size="lg"
                    data-testid="button-contact-support"
                  >
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}