"use client"
import { useSearchParams } from "next/navigation"
import { useRef, useEffect } from "react"
import React from 'react'

type Props = {
    onClose: () => void
    formData: {
        task: string
        id: string
        updated: string
    }
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    submit: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function DialogT({onClose, onChange, submit, formData}: Props) {
  const searchParams = useSearchParams()
  const dialogRef = useRef<null | HTMLDialogElement>(null)
  const showDialogT = searchParams.get('showDialogT')

  useEffect(() => {
    if (showDialogT === 'y') {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [showDialogT])

  const closeDialog = () => {
    dialogRef.current?.close()
    onClose()
  }

  const dialog: JSX.Element | null = showDialogT === 'y'
  ? (
    <dialog ref={dialogRef} className="backdrop:bg-gray-800/50">
      <div className="artboard phone-1 flex flex-col justify-center items-center w-1/2 h-1/2 m-auto">
        <div className="static top-0">
          <h1 className="justify-start">Modify Task</h1>
          <button 
          className="justify-end text-red-500"
          onClick={closeDialog}
          >X</button>
        </div>
        <div>
          <form onSubmit={submit} className="task-form">
            <label>
              <input onChange={onChange} type="text" name="task" value={formData.task} />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

    </dialog>
  ) : null

  return dialog
}
