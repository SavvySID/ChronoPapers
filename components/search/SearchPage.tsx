'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FileText, User, Calendar, Shield, Download, Eye } from 'lucide-react'
import { Card, Button, Input } from '../ui'
import { PageContainer, Header, Section, Grid } from '../layout'
import { ResearchPaper, SearchFilters } from '@/types'

interface PaperCardProps {
  paper: ResearchPaper
  onView: (paper: ResearchPaper) => void
  onDownload: (paper: ResearchPaper) => void
  onVerify: (paper: ResearchPaper) => void
}

function PaperCard({ paper, onView, onDownload, onVerify }: PaperCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-serif text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {paper.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <User className="w-4 h-4 mr-1" />
              <span>{paper.author}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{new Date(paper.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {paper.isVerified && (
              <div className="flex items-center text-green-600 text-sm">
                <Shield className="w-4 h-4 mr-1" />
                <span>Verified</span>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
          {paper.abstract}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>CID: {paper.CID.slice(0, 12)}...</span>
          <span>v{paper.version}</span>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView(paper)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onDownload(paper)}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onVerify(paper)}
            className="flex-1"
          >
            <Shield className="w-4 h-4 mr-1" />
            Verify
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

interface SearchPageProps {
  papers: ResearchPaper[]
  onSearch: (filters: SearchFilters) => Promise<void>
  onViewPaper: (paper: ResearchPaper) => void
  onDownloadPaper: (paper: ResearchPaper) => void
  onVerifyPaper: (paper: ResearchPaper) => void
  isLoading?: boolean
}

export function SearchPage({ 
  papers, 
  onSearch, 
  onViewPaper, 
  onDownloadPaper, 
  onVerifyPaper,
  isLoading = false 
}: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    author: '',
    verified: undefined
  })

  // Search suggestions based on demo papers
  const searchSuggestions = {
    keywords: [
      'blockchain', 'cryptography', 'decentralized', 'filecoin', 'consensus',
      'quantum computing', 'post-quantum', 'sustainability', 'mining',
      'identity management', 'Web3', 'privacy', 'academic publishing'
    ],
    authors: [
      'Dr. Sarah Chen', 'Prof. Michael Rodriguez', 'Dr. Alex Thompson',
      'Dr. Maria Garcia', 'Prof. James Wilson', 'Dr. Lisa Park',
      'Dr. Emily Zhang', 'Prof. Robert Brown', 'Dr. Kevin Lee'
    ],
    topics: [
      'Decentralized Storage', 'Cryptographic Proofs', 'Academic Credentials',
      'Quantum Resistance', 'Green Mining', 'Identity Verification'
    ]
  }

  const handleSearch = async (customQuery?: string, customFilters?: Partial<SearchFilters>) => {
    const searchFilters = {
      ...filters,
      ...customFilters,
      query: customQuery !== undefined ? customQuery : searchQuery
    }
    await onSearch(searchFilters)
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <PageContainer>
      <Header
        title="Browse Research Papers"
        subtitle="Discover and access academic papers preserved on Filecoin"
      />

      <div className="max-w-7xl mx-auto">
        <Section title="Search & Filter">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by title, author, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-200"
                    />
                  </div>
                </div>
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
              
              {/* Search Suggestions */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {searchSuggestions.keywords.map((keyword) => (
                      <button
                        key={keyword}
                        onClick={() => {
                          setSearchQuery(keyword)
                          handleSearch(keyword)
                        }}
                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 rounded-full transition-colors duration-200"
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Featured Authors</h4>
                  <div className="flex flex-wrap gap-2">
                    {searchSuggestions.authors.slice(0, 6).map((author) => (
                      <button
                        key={author}
                        onClick={() => {
                          setFilters(prev => ({ ...prev, author }))
                          handleSearch(undefined, { author })
                        }}
                        className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors duration-200"
                      >
                        {author}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Research Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {searchSuggestions.topics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => {
                          setSearchQuery(topic)
                          handleSearch(topic)
                        }}
                        className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded-full transition-colors duration-200"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Author Filter"
                  placeholder="Filter by author"
                  value={filters.author || ''}
                  onChange={(value) => handleFilterChange('author', value)}
                />
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Verification Status
                  </label>
                  <select
                    value={filters.verified === undefined ? '' : filters.verified.toString()}
                    onChange={(e) => handleFilterChange('verified', e.target.value === '' ? undefined : e.target.value === 'true')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-200"
                  >
                    <option value="">All Papers</option>
                    <option value="true">Verified Only</option>
                    <option value="false">Unverified Only</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Button variant="secondary" onClick={() => {
                    setSearchQuery('')
                    setFilters({ query: '', author: '', verified: undefined })
                    onSearch({})
                  }}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Section>

        <Section title="Research Papers">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-500 mx-auto mb-4" />
                <p className="text-gray-600">Searching papers...</p>
              </motion.div>
            ) : papers.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No papers found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or upload a new paper.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-6">
                  <p className="text-gray-600">
                    Found {papers.length} paper{papers.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <Grid cols={3} gap="lg">
                  {papers.map((paper) => (
                    <PaperCard
                      key={paper.id}
                      paper={paper}
                      onView={onViewPaper}
                      onDownload={onDownloadPaper}
                      onVerify={onVerifyPaper}
                    />
                  ))}
                </Grid>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>
      </div>
    </PageContainer>
  )
}
