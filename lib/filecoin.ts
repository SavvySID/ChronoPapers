// Lazily import Synapse to avoid build-time issues on platforms like Vercel
// that attempt to analyze/bundle server-only SDKs during static analysis.

export interface FilecoinUploadResult {
  cid: string
  size: number
  provider: string
  dealId?: string
}

export interface FilecoinDownloadResult {
  data: ArrayBuffer
  cid: string
  size: number
}

export class FilecoinStorage {
  private static instance: FilecoinStorage
  private synapse: any | null = null
  private storageService: any = null

  constructor() {}

  static getInstance(): FilecoinStorage {
    if (!FilecoinStorage.instance) {
      FilecoinStorage.instance = new FilecoinStorage()
    }
    return FilecoinStorage.instance
  }

  private async initializeSynapse() {
    if (this.synapse) return

    // Check if private key is properly configured
    const privateKey = process.env.PRIVATE_KEY
    if (!privateKey || privateKey === 'your_filecoin_private_key_here' || privateKey.startsWith('0xyour_filecoin_private_key_here')) {
      throw new Error('Filecoin private key not configured. Please set PRIVATE_KEY in .env.local with a valid private key.')
    }

    try {
      // Dynamic import to ensure the SDK is only loaded at runtime on the server
      const { Synapse } = await import('@filoz/synapse-sdk')
      this.synapse = await Synapse.create({
        withCDN: true,
        privateKey: privateKey,
        rpcURL: process.env.RPC_URL || 'https://api.calibration.node.glif.io/rpc/v1'
      })

      this.storageService = await this.synapse.createStorage({
        callbacks: {
          onProviderSelected: (provider: any) => {
            console.log(`✓ Selected storage provider: ${provider.owner}`)
          },
        },
      })
    } catch (error) {
      console.error('Synapse initialization error:', error)
      throw new Error(`Failed to initialize Synapse: ${error}`)
    }
  }

  async uploadFile(file: File): Promise<FilecoinUploadResult> {
    try {
      await this.initializeSynapse()
      
      // Convert file to buffer
      const buffer = await file.arrayBuffer()
      
      // Run preflight checks
      const preflight = await this.storageService.preflightUpload(buffer.byteLength)
      
      if (!preflight.allowanceCheck.sufficient) {
        throw new Error('Allowance not sufficient. Please increase your storage allowance.')
      }

      // Upload to Filecoin using Synapse SDK
      const result = await this.storageService.upload(buffer)

      return {
        cid: result.commp,
        size: buffer.byteLength,
        provider: 'filecoin-pdp',
        dealId: result.dealId
      }
    } catch (error) {
      console.error('Filecoin upload error:', error)
      throw new Error(`Failed to upload file to Filecoin: ${error}`)
    }
  }

  async downloadFile(cid: string): Promise<FilecoinDownloadResult> {
    try {
      await this.initializeSynapse()
      
      // Download from Filecoin using Synapse SDK
      const data = await this.synapse!.download(cid)
      // Ensure we return a true ArrayBuffer (copy from SharedArrayBuffer if needed)
      let arrayBuffer: ArrayBuffer
      const tag = (v: unknown) => Object.prototype.toString.call(v)
      if (data instanceof Uint8Array) {
        const copy = new Uint8Array(data.byteLength)
        copy.set(data)
        arrayBuffer = copy.buffer
      } else if (tag(data) === '[object ArrayBuffer]') {
        arrayBuffer = data
      } else if (typeof SharedArrayBuffer !== 'undefined' && tag(data) === '[object SharedArrayBuffer]') {
        const view = new Uint8Array(data as any)
        const copy = new Uint8Array(view.byteLength)
        copy.set(view)
        arrayBuffer = copy.buffer
      } else {
        // Fallback: try to coerce via Uint8Array
        const view = new Uint8Array((data as ArrayBufferLike) as any)
        const copy = new Uint8Array(view.byteLength)
        copy.set(view)
        arrayBuffer = copy.buffer
      }
      
      return {
        data: arrayBuffer,
        cid: cid,
        size: arrayBuffer.byteLength
      }
    } catch (error) {
      console.error('Filecoin download error:', error)
      throw new Error(`Failed to download file from Filecoin: ${error}`)
    }
  }

  async verifyFile(cid: string): Promise<boolean> {
    try {
      await this.initializeSynapse()
      
      // Try to download the file to verify it exists
      await this.synapse!.download(cid)
      return true
    } catch (error) {
      console.error('Filecoin verification error:', error)
      return false
    }
  }

  async getFileInfo(cid: string): Promise<{
    cid: string
    size: number
    provider: string
    deals: any[]
  }> {
    try {
      await this.initializeSynapse()
      
      // Download file to get size info
      const data = await this.synapse!.download(cid)
      
      return {
        cid: cid,
        size: data.byteLength,
        provider: 'filecoin-pdp',
        deals: []
      }
    } catch (error) {
      console.error('Filecoin info error:', error)
      throw new Error(`Failed to get file info: ${error}`)
    }
  }
}

// Export singleton instance
export const filecoinStorage = FilecoinStorage.getInstance()
