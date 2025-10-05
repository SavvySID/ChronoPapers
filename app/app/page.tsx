'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../../components/navigation'
import { FileUpload } from '../../components/upload/FileUpload'
import { SearchPage } from '../../components/search/SearchPage'
import { PaperDetail } from '../../components/paper/PaperDetail'
import { ResearchPaper, UploadMetadata, SearchFilters } from '@/types'

type TabType = 'upload' | 'browse' | 'papers' | 'verify'

export default function App() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabType>('browse')
  const [papers, setPapers] = useState<ResearchPaper[]>([])
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>('')

  // Load papers on component mount
  useEffect(() => {
    // Initialize tab from URL if present
    const tabParam = searchParams?.get('tab') as TabType | null
    if (tabParam && ['upload','browse','papers','verify'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
    loadPapers()
  }, [])

  // Keep URL in sync with current tab for sharable links
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('tab', activeTab)
      window.history.replaceState({}, '', url.toString())
    }
  }, [activeTab])

  const loadPapers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/papers')
      const result = await response.json()
      if (result.success) {
        setPapers(result.data.papers)
      }
    } catch (error) {
      console.error('Failed to load papers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (filters: SearchFilters) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.query) params.append('query', filters.query)
      if (filters.author) params.append('author', filters.author)
      if (filters.verified !== undefined) params.append('verified', filters.verified.toString())
      
      const response = await fetch(`/api/papers?${params}`)
      const result = await response.json()
      if (result.success) {
        setPapers(result.data.papers)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (file: File, metadata: UploadMetadata) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('metadata', JSON.stringify(metadata))

      const response = await fetch('/api/papers', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      if (result.success) {
        // Add new paper to the list
        setPapers(prev => [result.data, ...prev])
        setActiveTab('browse')
        alert('Paper uploaded successfully!')
      } else {
        alert(`Upload failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleViewPaper = (paper: ResearchPaper) => {
    setSelectedPaper(paper)
    setActiveTab('papers')
  }

  const handleDownloadPaper = async (paper: ResearchPaper) => {
    try {
      const response = await fetch(`/api/papers/${paper.id}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        
        // Get file extension from Content-Disposition header or default to pdf
        const contentDisposition = response.headers.get('Content-Disposition')
        let filename = `${paper.title.replace(/[^a-z0-9]/gi, '_')}.pdf`
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/)
          if (filenameMatch) {
            filename = filenameMatch[1]
          }
        }
        
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(`Download failed: ${errorData.error || 'Please try again.'}`)
      }
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    }
  }

  const handleVerifyPaper = async (paper: ResearchPaper) => {
    setIsVerifying(true)
    try {
      const response = await fetch(`/api/papers/${paper.id}/verify`, {
        method: 'POST'
      })
      const result = await response.json()
      
      if (result.success) {
        // Update paper verification status
        setPapers(prev => prev.map(p => 
          p.id === paper.id ? { ...p, isVerified: result.data.isValid } : p
        ))
        
        if (selectedPaper?.id === paper.id) {
          setSelectedPaper(prev => prev ? { ...prev, isVerified: result.data.isValid } : null)
        }
        
        alert(result.data.message)
      } else {
        alert(`Verification failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Verification failed:', error)
      alert('Verification failed. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleWalletConnect = (address: string) => {
    setWalletConnected(true)
    setWalletAddress(address)
  }

  const handleWalletDisconnect = () => {
    setWalletConnected(false)
    setWalletAddress('')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <FileUpload
            onUpload={handleUpload}
            isUploading={isUploading}
            walletConnected={walletConnected}
            walletAddress={walletAddress}
            onWalletConnect={handleWalletConnect}
            onWalletDisconnect={handleWalletDisconnect}
          />
        )
      case 'browse':
        return (
          <SearchPage
            papers={papers}
            onSearch={handleSearch}
            onViewPaper={handleViewPaper}
            onDownloadPaper={handleDownloadPaper}
            onVerifyPaper={handleVerifyPaper}
            isLoading={isLoading}
          />
        )
      case 'papers':
        return selectedPaper ? (
          <PaperDetail
            paper={selectedPaper}
            onBack={() => setActiveTab('browse')}
            onDownload={handleDownloadPaper}
            onVerify={handleVerifyPaper}
            isVerifying={isVerifying}
          />
        ) : (
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
                  Paper Details
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
                  Select a paper from the Browse tab to view its detailed information, metadata, and verification status.
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Go to Browse Papers
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">View Details</h3>
                  <p className="text-gray-600 text-sm">
                    Access comprehensive paper information including title, authors, abstract, and publication details.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Verify Integrity</h3>
                  <p className="text-gray-600 text-sm">
                    Check the cryptographic proof and verify that the paper hasn't been tampered with.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Download Paper</h3>
                  <p className="text-gray-600 text-sm">
                    Download the original PDF file directly from the decentralized Filecoin storage.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-8 border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-4">How to get started</h3>
                    <ol className="text-gray-700 space-y-3">
                      <li className="flex items-start">
                        <span className="bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
                        <span>Go to the <strong>Browse</strong> tab to search for papers</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
                        <span>Use the search filters to find papers by title, author, or verification status</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
                        <span>Click on any paper to view its detailed information here</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'verify':
        return (
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
                  Verification Dashboard
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
                  Verify the integrity and authenticity of research papers stored on the decentralized Filecoin network.
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Browse Papers to Verify
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Cryptographic Proof</h3>
                  <p className="text-gray-600 text-sm">
                    Verify papers using cryptographic hashes and blockchain proofs to ensure data integrity.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Tamper Detection</h3>
                  <p className="text-gray-600 text-sm">
                    Detect any unauthorized modifications or corruption in the stored research papers.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Blockchain Verification</h3>
                  <p className="text-gray-600 text-sm">
                    Confirm papers are stored on Filecoin network with immutable blockchain records.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-200">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-4">How verification works</h3>
                    <ol className="text-gray-700 space-y-3">
                      <li className="flex items-start">
                        <span className="bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
                        <span>Go to the <strong>Browse</strong> tab to find papers you want to verify</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
                        <span>Click on any paper to view its details and verification status</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
                        <span>Use the verify button to check cryptographic proofs and blockchain integrity</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
        <Navigation
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as TabType)}
          wallet={{
            isConnected: walletConnected,
            address: walletAddress,
            onConnect: handleWalletConnect,
            onDisconnect: handleWalletDisconnect
          }}
        />

      {/* @ts-ignore */}
      <AnimatePresence mode="wait">
        {/* @ts-ignore */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
