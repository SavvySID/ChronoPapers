'use client'

import { motion } from 'framer-motion'
import { FileText, User, Calendar, Shield, Download, ArrowLeft, CheckCircle, AlertCircle, Hash } from 'lucide-react'
import { Card, Button } from '../ui'
import { PageContainer, Header } from '../layout'
import { ResearchPaper } from '@/types'

interface PaperDetailProps {
  paper: ResearchPaper
  onBack: () => void
  onDownload: (paper: ResearchPaper) => void
  onVerify: (paper: ResearchPaper) => void
  isVerifying?: boolean
}

export function PaperDetail({ 
  paper, 
  onBack, 
  onDownload, 
  onVerify, 
  isVerifying = false 
}: PaperDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <Button
            variant="secondary"
            onClick={onBack}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Button>
          
          <Header
            title={paper.title}
            subtitle={`by ${paper.author} • ${formatDate(paper.timestamp)}`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8">
              <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-6">
                Abstract
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {paper.abstract}
              </p>
            </Card>

            {paper.keywords && paper.keywords.length > 0 && (
              <Card className="p-8">
                <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-6">
                  Keywords
                </h2>
                <div className="flex flex-wrap gap-2">
                  {paper.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-8">
              <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-6">
                Actions
              </h2>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => onDownload(paper)}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Paper</span>
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={() => onVerify(paper)}
                  disabled={isVerifying}
                  className="flex items-center space-x-2"
                >
                  {isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Verify PDP</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-serif text-lg font-semibold text-gray-900 mb-4">
                Paper Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Author</p>
                    <p className="font-medium text-gray-900">{paper.author}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Published</p>
                    <p className="font-medium text-gray-900">{formatDate(paper.timestamp)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Version</p>
                    <p className="font-medium text-gray-900">v{paper.version}</p>
                  </div>
                </div>
                
                {paper.fileSize && (
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">File Size</p>
                      <p className="font-medium text-gray-900">{formatFileSize(paper.fileSize)}</p>
                    </div>
                  </div>
                )}
                
                {paper.doi && (
                  <div className="flex items-center space-x-3">
                    <Hash className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">DOI</p>
                      <p className="font-medium text-gray-900">{paper.doi}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-serif text-lg font-semibold text-gray-900 mb-4">
                Storage Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Hash className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Content ID (CID)</p>
                    <p className="font-mono text-sm text-gray-900 break-all">
                      {paper.CID}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Verification Status</p>
                    <div className="flex items-center space-x-2">
                      {paper.isVerified ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-600 font-medium">Verified</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                          <span className="text-yellow-600 font-medium">Pending</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {paper.parentCID && (
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Previous Version</p>
                      <p className="font-mono text-sm text-gray-900 break-all">
                        {paper.parentCID.slice(0, 20)}...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-primary text-white">
              <h3 className="font-serif text-lg font-semibold mb-4">
                Decentralized Storage
              </h3>
              <p className="text-sm opacity-90 mb-4">
                This paper is permanently stored on Filecoin, ensuring:
              </p>
              <ul className="text-sm space-y-2 opacity-90">
                <li>• Immutable preservation</li>
                <li>• Global accessibility</li>
                <li>• Tamper-proof verification</li>
                <li>• Censorship resistance</li>
              </ul>
            </Card>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  )
}
