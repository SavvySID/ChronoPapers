'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Upload, Search, FileText, Shield } from 'lucide-react'
import { Button } from '../ui'
import Link from 'next/link'
import { WalletConnection } from '../wallet/WalletConnection'
import WalletErrorBoundary from '../wallet/WalletErrorBoundary'

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  wallet?: {
    isConnected: boolean
    address?: string
    onConnect: (address: string) => void
    onDisconnect: () => void
  }
}

export function Navigation({ activeTab, onTabChange, wallet }: NavigationProps) {
  const tabs = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'browse', label: 'Browse', icon: Search },
    { id: 'papers', label: 'Papers', icon: FileText },
    { id: 'verify', label: 'Verify', icon: Shield }
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-3"
          >
            <Link href="/home" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-gray-900">
                ChronoPapers
              </h1>
            </Link>
          </motion.div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          <div className="ml-4">
            {wallet && (
              <WalletErrorBoundary>
                <WalletConnection
                  isConnected={wallet.isConnected}
                  address={wallet.address}
                  onConnect={wallet.onConnect}
                  onDisconnect={wallet.onDisconnect}
                />
              </WalletErrorBoundary>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

interface WalletButtonProps {
  isConnected: boolean
  address?: string
  onConnect: () => void
  onDisconnect: () => void
}

export function WalletButton({ isConnected, address, onConnect, onDisconnect }: WalletButtonProps) {
  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isConnected ? (
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
            {truncatedAddress}
          </div>
          <Button variant="secondary" onClick={onDisconnect}>
            Disconnect
          </Button>
        </div>
      ) : (
        <Button onClick={onConnect}>
          Connect Wallet
        </Button>
      )}
    </motion.div>
  )
}
