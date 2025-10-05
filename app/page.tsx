'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home page when site is opened
    router.replace('/home')
  }, [router])

  return null
}