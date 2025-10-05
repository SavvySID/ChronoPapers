'use client'

import { useState, useEffect } from 'react'
import { Web3Auth } from '@web3auth/modal'
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from '@web3auth/base'
import { ethers } from 'ethers'

interface WalletConnectionProps {
  onConnect: (address: string) => void
  onDisconnect: () => void
  isConnected: boolean
  address?: string
}

export function WalletConnection({ onConnect, onDisconnect, isConnected, address }: WalletConnectionProps) {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
  const [provider, setProvider] = useState<IProvider | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const init = async () => {
      try {
        const web3authInstance = new Web3Auth({
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || 'your-client-id',
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: '0x4cb2f', // Filecoin Calibration testnet (314159)
            rpcTarget: 'https://api.calibration.node.glif.io/rpc/v1',
            displayName: 'Filecoin Calibration',
            blockExplorer: 'https://calibration.filfox.info',
            ticker: 'tFIL',
            tickerName: 'Test Filecoin',
          },
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          sessionTime: 86400, // 24 hours
          enableLogging: true,
        })

        await web3authInstance.initModal()
        setWeb3auth(web3authInstance)
        console.log('Web3Auth initialized successfully')
      } catch (error) {
        console.error('Web3Auth initialization error:', error)
      }
    }

    init()
  }, [])

  const connectWalletWithRetry = async (attempt: number = 1): Promise<any> => {
    const maxRetries = 3
    const baseDelay = 1000 // 1 second
    
    try {
      if (!web3auth) {
        throw new Error('Web3Auth not initialized')
      }

      console.log(`Wallet connection attempt ${attempt}/${maxRetries}`)
      
      // Add timeout to prevent hanging connections
      const connectionPromise = web3auth.connect()
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout. Please try again.')), 15000)
      )
      
      const web3authProvider = await Promise.race([connectionPromise, timeoutPromise]) as any
      console.log('Web3Auth connected successfully')
      return web3authProvider
      
    } catch (error) {
      console.error(`Connection attempt ${attempt} failed:`, error)
      
      if (attempt < maxRetries && error instanceof Error && 
          (error.message.includes('Proposal expired') || error.message.includes('proposal expired'))) {
        
        const delay = baseDelay * Math.pow(2, attempt - 1) // Exponential backoff
        console.log(`Retrying in ${delay}ms...`)
        
        await new Promise(resolve => setTimeout(resolve, delay))
        return connectWalletWithRetry(attempt + 1)
      }
      
      throw error
    }
  }

  const connectWallet = async () => {
    if (!web3auth) {
      console.error('Web3Auth not initialized')
      return
    }

    setIsLoading(true)
    setConnectionError(null)
    setRetryCount(0)
    console.log('Starting wallet connection...')
    
    try {
      const web3authProvider = await connectWalletWithRetry()
      console.log('Web3Auth connected, provider:', web3authProvider)
      setProvider(web3authProvider)

      if (web3authProvider) {
        // Try to switch to Filecoin Calibration network
        try {
          console.log('Attempting to switch to Filecoin Calibration network...')
          await web3authProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x4cb2f' }],
          });
          console.log('Successfully switched to Filecoin Calibration network')
        } catch (switchError: any) {
          console.log('Switch error:', switchError)
          
          // If network doesn't exist, try to add it
          if (switchError.code === 4902) {
            console.log('Network not found, attempting to add Filecoin Calibration network...')
            try {
              await web3authProvider.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x4cb2f',
                    chainName: 'Filecoin Calibration',
                    rpcUrls: ['https://api.calibration.node.glif.io/rpc/v1'],
                    blockExplorerUrls: ['https://calibration.filfox.info'],
                    nativeCurrency: {
                      symbol: 'tFIL',
                      decimals: 18,
                    },
                  },
                ],
              });
              console.log('Successfully added Filecoin Calibration network')
            } catch (addError) {
              console.error("Failed to add Filecoin Calibration network:", addError);
              // Continue anyway - user can manually add the network
            }
          } else {
            console.error("Failed to switch to Filecoin Calibration network:", switchError);
            // Continue anyway - user might already be on the right network
          }
        }

        const ethersProvider = new ethers.BrowserProvider(web3authProvider)
        const signer = await ethersProvider.getSigner()
        const address = await signer.getAddress()
        console.log('Connected wallet address:', address)
        
        // Check network
        try {
          const network = await ethersProvider.getNetwork()
          console.log('Connected to network:', network.chainId, network.name)
          if (network.chainId !== BigInt(314159)) {
            console.warn('Connected to wrong network. Expected Filecoin Calibration (314159), got:', network.chainId)
          }
        } catch (networkError) {
          console.error('Error checking network:', networkError)
        }
        
        onConnect(address)
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      
      // Handle specific WalletConnect errors
      if (error instanceof Error) {
        if (error.message.includes('Proposal expired') || error.message.includes('proposal expired')) {
          setConnectionError('Connection request expired. Please try connecting again.')
        } else if (error.message.includes('User rejected') || error.message.includes('user rejected')) {
          setConnectionError('Connection was cancelled by user.')
        } else if (error.message.includes('timeout')) {
          setConnectionError('Connection timed out. Please try again.')
        } else {
          setConnectionError(`Wallet connection failed: ${error.message}`)
        }
      } else {
        setConnectionError('Wallet connection failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = async () => {
    if (!web3auth) return

    try {
      await web3auth.logout()
      setProvider(null)
      onDisconnect()
      console.log('Wallet disconnected')
    } catch (error) {
      console.error('Wallet disconnection error:', error)
    }
  }

  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''

  return (
    <div className="flex flex-col items-end space-y-2">
      <div className="flex items-center space-x-3">
        {isConnected ? (
          <>
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
              {truncatedAddress}
            </div>
            <button
              onClick={disconnectWallet}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={connectWallet}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Connecting to Filecoin...' : 'Connect Filecoin Wallet'}
          </button>
        )}
      </div>
      
      {connectionError && (
        <div className="text-right">
          <div className="text-red-600 text-sm mb-2 max-w-xs">
            {connectionError}
          </div>
          <button
            onClick={() => setConnectionError(null)}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}