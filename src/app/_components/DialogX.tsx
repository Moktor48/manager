"use client"
import { useSearchParams } from "next/navigation"
import { useRef, useEffect, useState } from "react"
import React from 'react'

type Props = {
    onClose: () => void,
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    setFormData: React.Dispatch<React.SetStateAction<Props['formData']>>
    formData: {
    id: string
    userId: string
    task: string
    status: string
    priority: number
    updated: string
    }
}

export default function Dialog({onClose, onSubmit, onChange, formData, setFormData}: Props) {

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
          <h1 className="justify-start">Modify Task</h1>
          <button 
          className="justify-end text-red-500"
          onClick={closeDialog}
          >X</button>
        </div>
        <div>
          <form onSubmit={onSubmit} className="task-form">
            <label>
              <input onChange={onChange} type="text" name="task" value={formData.task} />
            </label>
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
            <select name="status" onChange={onChange} value={formData.status}>
              <option value="Assigned">Assigned</option>
              <option value="In-Development">In-Development</option>
              <option value="Review">Review</option>
              <option value="Unassigned">Unassigned</option>  
              <option value="Completed">Completed</option>
            </select>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

    </dialog>
  ) : null

  return dialog
}
