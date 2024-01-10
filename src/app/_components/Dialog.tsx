"use client"
import { useSearchParams } from "next/navigation"
import { useRef, useEffect, useState } from "react"
import React from 'react'

type Props = {
    onClose: () => void,
    children: React.ReactNode,
    id: string
    type: string
    title: string
    userId: string
}

export default function Dialog({onClose, id, type, userId, children, title}: Props) {

  const searchParams = useSearchParams()
  const dialogRef = useRef<null | HTMLDialogElement>(null)
  const showDialog = searchParams.get('showDialog')

  useEffect(() => {
    if (showDialog === 'y') {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [showDialog])

  const closeDialog = () => {
    dialogRef.current?.close()
    onClose()
  }

  const dialog: JSX.Element | null = showDialog === 'y'
  ? (
    <dialog ref={dialogRef} className="backdrop:bg-gray-800/50">
      <div className="artboard phone-1 flex flex-col justify-center items-center w-1/2 h-1/2 m-auto">
        <div className="static top-0">
          <h1 className="justify-start">{title}</h1>
          <button 
          className="justify-end text-red-500"
          onClick={closeDialog}
          >X</button>
        </div>
        <div>
          {children}
        </div>
      </div>

    </dialog>
  ) : null

  return dialog
}
