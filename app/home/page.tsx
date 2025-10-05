'use client'

import Link from 'next/link'
import { Button, Card } from '@/components/ui'
import { Upload, Search, Shield } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HomeLanding() {
  const router = useRouter()
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>('')

  const handleWalletConnect = (address: string) => {
    setWalletConnected(true)
    setWalletAddress(address)
  }

  const handleWalletDisconnect = () => {
    setWalletConnected(false)
    setWalletAddress('')
  }
  return (
    <main className="min-h-screen bg-gradient-subtle">
      <Navigation
        activeTab={''}
        onTabChange={(tab) => router.push(`/app?tab=${tab}`)}
        wallet={{
          isConnected: walletConnected,
          address: walletAddress,
          onConnect: handleWalletConnect,
          onDisconnect: handleWalletDisconnect
        }}
      />
      <section className="container mx-auto px-4 pt-16 pb-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
            Preserve Research Permanently on Filecoin
          </h1>
          <p className="text-gray-600 text-lg mb-10">
            ChronoPapers lets you upload, browse, and verify research papers stored on the decentralized Filecoin network.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/app?tab=upload">
              <Button size="lg">Upload Paper</Button>
            </Link>
            <Link href="/app?tab=browse">
              <Button size="lg" variant="outline">Browse Papers</Button>
            </Link>
            <Link href="/app?tab=verify">
              <Button size="lg" variant="secondary">Verify</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover className="p-6">
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Upload</h3>
            <p className="text-gray-600 mb-4">Store PDFs and documents permanently with metadata and ownership.</p>
            <Link href="/app?tab=upload" className="text-primary-600 font-medium">Go to Upload →</Link>
          </Card>
          <Card hover className="p-6">
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Browse</h3>
            <p className="text-gray-600 mb-4">Search and discover research papers by title, author, or status.</p>
            <Link href="/app?tab=browse" className="text-primary-600 font-medium">Go to Browse →</Link>
          </Card>
          <Card hover className="p-6">
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Verify</h3>
            <p className="text-gray-600 mb-4">Validate integrity and on-chain proofs for any stored paper.</p>
            <Link href="/app?tab=verify" className="text-primary-600 font-medium">Go to Verify →</Link>
          </Card>
        </div>
      </section>
    </main>
  )
}


