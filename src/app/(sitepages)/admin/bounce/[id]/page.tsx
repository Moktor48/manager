"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
export default function BouncePage({ params }: {params: { id: string }}) {
const id = params.id
const router = useRouter()
router.push(`/admin`)
  return (
    <div>Loading...</div>
  )
}
