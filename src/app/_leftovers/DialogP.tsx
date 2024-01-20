"use client"
import { useSearchParams } from "next/navigation"
import { useRef, useEffect } from "react"
import React from 'react'

type Props = {
    onClose: () => void
    formData: {
        priority: number
        id: string
        updated: string
    }
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    submit: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function DialogP({onClose, onChange, submit, formData}: Props) {
  const searchParams = useSearchParams()
  const dialogRef = useRef<null | HTMLDialogElement>(null)
  const showDialogP = searchParams.get('showDialogP')

  useEffect(() => {
    if (showDialogP === 'y') {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [showDialogP])

  const closeDialog = () => {
    dialogRef.current?.close()
    onClose()
  }

  const dialog: JSX.Element | null = showDialogP === 'y'
  ? (
    <dialog ref={dialogRef} className="backdrop:bg-gray-800/50">
      <div className="artboard phone-1 flex flex-col justify-center items-center w-1/2 h-1/2 m-auto">
        <div className="static top-0">
          <h1 className="justify-start">Change Priority</h1>
          <button 
          className="justify-end text-red-500"
          onClick={closeDialog}
          >X</button>
        </div>
        <div>
          <form onSubmit={submit} className="priority-form flex flex-col justify-center items-center">
        <select 
          name="priority"
          value={formData.priority}
          onChange={onChange}
        >
          {[...Array(10).keys()].map(n => (
            <option key={n+1} value={n+1}>
              {n+1}
            </option>
          ))}
        </select>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

    </dialog>
  ) : null

  return dialog
}

// Change radios to select pulldown!!! 1-10
