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
        priority: string
        id: string
        updated: string
    }
    setFormData: (formData: {priority: string, id: string, updated: string}) => void
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    submit: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function Dialog({onClose, id, type, title, onChange, submit, formData, setFormData}: Props) {
  const searchParams = useSearchParams()
  const dialogRef = useRef<null | HTMLDialogElement>(null)
  const showDialogP = searchParams.get('showDialogP')

  useEffect(() => {
    setFormData({...formData, id: id, priority: type})
  }, [])

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
          <h1 className="justify-start">{title}</h1>
          <button 
          className="justify-end text-red-500"
          onClick={closeDialog}
          >X</button>
        </div>
        <div>
          <form onSubmit={submit} className="priority-form flex flex-col justify-center items-center">
            <label>
              <input onChange={onChange} name="priority" type="radio" value="HIGH" checked={formData.priority === 'HIGH'} />
              HIGH
            </label><br />
            <label>
              <input onChange={onChange} name="priority" type="radio" value="MEDIUM" checked={formData.priority === 'MEDIUM'} />
              MEDIUM
            </label><br />
            <label>
              <input onChange={onChange} name="priority" type="radio" value="LOW" checked={formData.priority === 'LOW'} />
              LOW
            </label><br />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

    </dialog>
  ) : null

  return dialog
}
