"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
export default function BouncePage({ params }: {params: { id: string }}) {
const userId = params.id
const router = useRouter()
router.push(`/user/${userId}`)
  return (
    <div>Loading...</div>
  )
}
