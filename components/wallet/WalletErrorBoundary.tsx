'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

class WalletErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Wallet Error Boundary caught an error:', error, errorInfo)
    
    // Handle specific WalletConnect errors
    if (error.message.includes('Proposal expired') || error.message.includes('proposal expired')) {
      console.log('WalletConnect proposal expired - this is a known issue')
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />
      }

      return (
        <div className="flex flex-col items-center space-y-4 p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-600 font-semibold">Wallet Connection Error</div>
          <div className="text-red-500 text-sm text-center">
            {this.state.error?.message.includes('Proposal expired') 
              ? 'Connection request expired. Please try again.'
              : this.state.error?.message || 'An unexpected error occurred'
            }
          </div>
          <button
            onClick={this.resetError}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default WalletErrorBoundary
