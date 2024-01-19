"use client"
import { useSearchParams } from "next/navigation"
import { useRef, useEffect } from "react"
import React from 'react'

type Props = {
    setFormData: React.Dispatch<React.SetStateAction<Props['formData']>>
    onClose: () => void
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    submit: (e: React.FormEvent<HTMLFormElement>) => void
    formData: {
      userId: string
      id: string
      updated: string
      status: string
    }
}

type Form ={
    status: string
    id: string
    updated: string
    userId: string
}

export default function DialogSA({onClose, onChange, submit, formData, setFormData}: Props) {
  const searchParams = useSearchParams()
  const formD: Form = JSON.parse(searchParams.get('formData') ?? '{}') as Form
  const dialogRef = useRef<null | HTMLDialogElement>(null)
  const showDialogSA = searchParams.get('showDialogSA')


  useEffect(() => {
    setFormData(formD)
    if (showDialogSA === 'y') {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [showDialogSA])

  const closeDialog = () => {
    dialogRef.current?.close()
    onClose()
  }

  const dialog: JSX.Element | null = showDialogSA === 'y'
  ? (
    <dialog ref={dialogRef} className="backdrop:bg-gray-800/10">
      <div className="artboard phone-1 flex flex-col justify-center items-center w-1/2 h-1/2 m-auto">
        <div className="static top-0">
          <h1 className="justify-start">Change Status</h1>
          <button 
          className="justify-end text-red-500"
          onClick={closeDialog}
          >X</button>
        </div>
        <div>
          <h1>{formData.status}</h1>
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
              <input onChange={onChange} type="radio" name="status" value="Unassigned" checked={formData.status === 'Unassigned'} />
              Unassign
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
