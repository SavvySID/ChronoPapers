'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, CheckCircle, AlertCircle, Wallet } from 'lucide-react'
import { Card, Button, Input, Textarea } from '../ui'
import { PageContainer, Header, Section } from '../layout'
import { WalletConnection } from '../wallet/WalletConnection'
import WalletErrorBoundary from '../wallet/WalletErrorBoundary'
import { UploadMetadata } from '@/types'

interface FileUploadProps {
  onUpload: (file: File, metadata: UploadMetadata) => Promise<void>
  isUploading?: boolean
  walletConnected?: boolean
  walletAddress?: string
  onWalletConnect?: (address: string) => void
  onWalletDisconnect?: () => void
}

export function FileUpload({ 
  onUpload, 
  isUploading = false, 
  walletConnected = false, 
  walletAddress,
  onWalletConnect,
  onWalletDisconnect 
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState<UploadMetadata>({
    title: '',
    author: '',
    abstract: '',
    keywords: [],
    doi: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      setErrors({})
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: !walletConnected
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!file) {
      newErrors.file = 'Please select a file to upload'
    }
    if (!metadata.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!metadata.author.trim()) {
      newErrors.author = 'Author is required'
    }
    if (!metadata.abstract.trim()) {
      newErrors.abstract = 'Abstract is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet before uploading a paper.')
      return
    }
    
    if (!validateForm() || !file) return
    
    try {
      await onUpload(file, metadata)
      // Reset form after successful upload
      setFile(null)
      setMetadata({
        title: '',
        author: '',
        abstract: '',
        keywords: [],
        doi: ''
      })
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  return (
    <PageContainer>
      <Header
        title="Upload Research Paper"
        subtitle="Preserve your research permanently on the decentralized Filecoin network"
      />

      <div className="max-w-4xl mx-auto">
        <Section title="Wallet Connection Required">
          <Card className="p-8">
            <div className="text-center">
              {walletConnected ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Wallet Connected
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connected'}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      ✓ You can now upload papers to the decentralized network
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <Wallet className="w-16 h-16 text-gray-400 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Connect Your Wallet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      You need to connect your wallet to upload papers to the decentralized Filecoin network.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Wallet connection is required to authenticate your identity and enable decentralized storage.
                      </p>
                    </div>
                    {onWalletConnect && onWalletDisconnect && (
                      <div className="flex justify-center">
                        <WalletErrorBoundary>
                          <WalletConnection
                            onConnect={onWalletConnect}
                            onDisconnect={onWalletDisconnect}
                            isConnected={walletConnected}
                            address={walletAddress}
                          />
                        </WalletErrorBoundary>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </Section>

        <Section title="File Upload">
          <Card className="p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                !walletConnected 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'cursor-pointer'
              } ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : file
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              
              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div
                    key="file-selected"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-4"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        File Selected
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                      <Button variant="secondary" onClick={removeFile}>
                        <X className="w-4 h-4 mr-2" />
                        Remove File
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload-area"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-4"
                  >
                    <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {isDragActive ? 'Drop your file here' : 'Drag & drop your research paper'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        or click to browse files
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports PDF, DOC, DOCX, TXT (max 50MB)
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {errors.file && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center space-x-2 text-red-600"
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errors.file}</span>
              </motion.div>
            )}
          </Card>
        </Section>

        <Section title="Paper Metadata">
          <Card className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Title"
                placeholder="Enter paper title"
                value={metadata.title}
                onChange={(value) => setMetadata(prev => ({ ...prev, title: value }))}
                required
                error={errors.title}
              />
              
              <Input
                label="Author"
                placeholder="Enter author name"
                value={metadata.author}
                onChange={(value) => setMetadata(prev => ({ ...prev, author: value }))}
                required
                error={errors.author}
              />
              
              <Input
                label="DOI (Optional)"
                placeholder="e.g., 10.1000/182"
                value={metadata.doi || ''}
                onChange={(value) => setMetadata(prev => ({ ...prev, doi: value }))}
                className="md:col-span-2"
              />
              
              <Textarea
                label="Abstract"
                placeholder="Enter paper abstract"
                value={metadata.abstract}
                onChange={(value) => setMetadata(prev => ({ ...prev, abstract: value }))}
                required
                rows={6}
                error={errors.abstract}
                className="md:col-span-2"
              />
              
              <Input
                label="Keywords (Optional)"
                placeholder="Enter keywords separated by commas"
                value={metadata.keywords?.join(', ') || ''}
                onChange={(value) => setMetadata(prev => ({ 
                  ...prev, 
                  keywords: value.split(',').map(k => k.trim()).filter(k => k) 
                }))}
                className="md:col-span-2"
              />
            </div>
          </Card>
        </Section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Button
            onClick={handleSubmit}
            disabled={isUploading || !file || !walletConnected}
            className="px-12 py-4 text-lg"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                Uploading to Filecoin...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 mr-2" />
                Upload & Preserve Paper
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </PageContainer>
  )
}
