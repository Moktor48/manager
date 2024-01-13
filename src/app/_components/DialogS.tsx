"use client"
import { useSearchParams } from "next/navigation"
import { useRef, useEffect } from "react"
import React from 'react'

type Props = {
    onClose: () => void
    id: string
    type: string
    title: string
    formData: {
        status: string
        id: string
        updated: string
    }
    setFormData: (formData: {status: string, id: string, updated: string}) => void
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    submit: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function Dialog({onClose, id, type, title, onChange, submit, formData, setFormData}: Props) {
  const searchParams = useSearchParams()
  const dialogRef = useRef<null | HTMLDialogElement>(null)
  const showDialogS = searchParams.get('showDialogS')

  useEffect(() => {
    setFormData({...formData, id: id, status: type})
  }, [])

  useEffect(() => {
    if (showDialogS === 'y') {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [showDialogS])

  const closeDialog = () => {
    dialogRef.current?.close()
    onClose()
  }

  const dialog: JSX.Element | null = showDialogS === 'y'
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
          <form onSubmit={submit} className="status-form">
            <label>
              <input onChange={onChange} type="radio" name="status" value="Assigned" checked={formData.status === 'Assigned'} />
              Assigned
            </label>
            <label>
              <input onChange={onChange} type="radio" name="status" value="In-Development" checked={formData.status === 'In-Development'} />
              In-Development
            </label>
            <label>
              <input onChange={onChange} type="radio" name="status" value="Review" checked={formData.status === 'Review'} />
              Review
            </label>
            <label>
              <input onChange={onChange} type="radio" name="status" value="Completed" checked={formData.status === 'Completed'} />
              Completed
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

    </dialog>
  ) : null

  return dialog
}
