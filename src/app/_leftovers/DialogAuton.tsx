"use client"
import { useSearchParams } from "next/navigation"
import { useRef, useEffect, useState } from "react"
import React from 'react'
import { api } from "~/trpc/react"
import { useRouter } from 'next/navigation'
type Props = {
    onClose: () => void,
    userId: string,

}

export default function DialogAuton({onClose, userId}: Props) {
  const router = useRouter()
  const updateTime = new Date()
  const [formData, setFormData] = useState({id: '', userId: userId, task: '', status: '', priority: 1, updated: updateTime.toISOString()})
  const searchParams = useSearchParams()
  const dialogRef = useRef<null | HTMLDialogElement>(null)
  const showDialog = searchParams.get('showDialog')
  const id = searchParams.get('id')
  
  const { data } = api.post.pullTask.useQuery({id})


          

useEffect(() => {
  if (data) {
    setFormData(prev => {
    return {
      ...prev,
      task: data.task,
      status: data.status,
      priority: data.priority
    }
  })
  }
}, [data]) 

  useEffect(() => {
    if (showDialog === 'y') {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [showDialog])

  const fullUpdate = api.post.updateEntry.useMutation({  
    onSuccess: async () => {
      location.reload()
    },})

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormData({...formData, userId: formData.status === "Unassigned"? "Unassigned" : userId, updated: updateTime.toISOString()})
    fullUpdate.mutate(formData)
    router.push(`/admin`)
  }

  const closeDialog = () => {
    dialogRef.current?.close()
    onClose()
  }
    function handleChangeT(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(formData)
    setFormData(prev => {
    return {
      ...prev,
      task: e.target.value,
    }
  })
  }

    function handleChangeP(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log(formData)
    setFormData(prev => {
    return {
      ...prev,
      priority: parseInt(e.target.value),
    }
  })
  }

    function handleChangeS(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log(formData)
    setFormData(prev => {
    return {
      ...prev,
      status: e.target.value,
      userId: e.target.value === "Unassigned"? "Unassigned" : userId
    }
  })
  }
  const dialog: JSX.Element | null = showDialog === 'y'
  ? (
    <dialog ref={dialogRef} className="backdrop:bg-gray-800/10">
      <div className="artboard phone-1 flex flex-col justify-center items-center w-1/2 h-1/2 m-auto">
        <div className="static top-0">
          <h1 className="justify-start">Modify Task</h1>
          <button 
          className="justify-end text-red-500"
          onClick={closeDialog}
          >X</button>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="task-form">
            <label>
              <input onChange={handleChangeT} type="text" name="task" value={formData.task} />
            </label>
            <select 
              name="priority"
              value={formData.priority}
              onChange={handleChangeP}
            >
              {[...Array(10).keys()].map(n => (
              <option key={n+1} value={n+1}>
                {n+1}
              </option>
              ))}
            </select>
            <select name="status" onChange={handleChangeS} value={formData.status}>
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