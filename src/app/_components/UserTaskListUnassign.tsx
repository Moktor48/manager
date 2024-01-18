"use client"
import React from 'react'
import { api } from '~/trpc/react';
import DialogP from './DialogP';
import DialogSA from './DialogSA';
import DialogT from './DialogT';
import { useRouter } from 'next/navigation';
import { useState } from'react';

export default function UserTaskListUA({id}: {id: string}) {
const userId = id
const updateTime = new Date()
const delTask = api.post.deleteTask.useMutation()
const updateTask = api.post.updateTask.useMutation({  
  onSuccess: async () => {
    location.reload()
  },})
const updateStatus = api.post.updateStatus.useMutation({  
  onSuccess: async () => {
    location.reload()
  },})
const updatePriority = api.post.updatePriority.useMutation({  
  onSuccess: async () => {
    location.reload()
  },})
const router = useRouter()
const {data: tasks} = api.post.unasnTask.useQuery()

// Deletes entire task from database
const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  e.preventDefault()
  delTask.mutate({id: e.currentTarget.id})
  router.push(`/user/${id}`)
  router.refresh()
}

// formData for the task components to be modified
const [formDataT, setFormDataT] = useState({
  updated: updateTime.toISOString(),
  task: "null",
  id: ""
})

const [formDataP, setFormDataP] = useState({
  updated: updateTime.toISOString(),
  priority: NaN,
  id: ""
})

const [formDataS, setFormDataS] = useState({
  updated: updateTime.toISOString(),
  status: "null",
  id: "",
  userId: ""
})

// Submission logic for the task components to be modified
function handleSubmitT(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setFormDataT({...formDataT, updated: updateTime.toISOString()})
  updateTask.mutate(formDataT)
  router.push(`/user/${id}`)
}

function handleSubmitP(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setFormDataP({...formDataP, updated: updateTime.toISOString()})
  updatePriority.mutate(formDataP)
  router.push(`/user/${id}`)
}

function handleSubmitS(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setFormDataS({...formDataS, updated: updateTime.toISOString()})
  console.log(formDataS)
  updateStatus.mutate(formDataS)
  router.push(`/user/${id}`)
}

// Change handler for the task components to be modified
function handleChangeT(e: React.ChangeEvent<HTMLInputElement>) {
  setFormDataT({...formDataT, [e.target.name]: e.target.value})
}

function handleChangeP(e: React.ChangeEvent<HTMLSelectElement>) {
  setFormDataP({...formDataP, priority: parseInt(e.target.value)})
}


function handleChangeS(e: React.ChangeEvent<HTMLInputElement>) {
  if (e.target.name === 'status' && e.target.value != 'Unassigned') {
    setFormDataS(prev => ({...prev, userId: userId}))
  }
  setFormDataS(prev => ({...prev, [e.target.name]: e.target.value}))
}

// Clears searchParams from URL and refreshes the page
async function onClose() {
  router.push(`/user/${id}`)
}

  return (
<>
    <div style={{overflowX: "auto"}} className='flex w-full'>
      <h1 className="flex w-full inline-flex bg-gradient-to-r from-indigo-500 text-3xl h-11">Unassigned Tasks</h1>
      <table className="table text-center w-3/4 m-auto">      
        <thead>
          <tr>
            <td className="w-2/5 text-xl">Task</td>
            <td className="w-1/5 text-xl">Priority</td>
            <td className="w-1/5 text-xl">Status</td>

          </tr>
        </thead>
        <tbody>
        {tasks?.map((task) => (
          <tr key={task.id}>
          <td>
            <button 
              onClick={() => {
                setFormDataT({...formDataT, task: task.task, id: task.id })
                setFormDataS({...formDataS, status: "null", id: ""})
                setFormDataP({...formDataP, priority: NaN, id: ""})
                router.push(`/user/${userId}?showDialogT=y`)  
              }}>{task.task}</button>
              <DialogT 
                title="Change Task"
                onClose={onClose}
                submit={handleSubmitT}
                onChange={handleChangeT}
                id={task.id}
                type={task.task}
                formData={formDataT}
                setFormData={setFormDataT}
                />
          </td>
          <td>
            <button 
              className={`btn min-w-24 ${
                  task.priority === 1? 'q1' : 
                  task.priority === 2? 'q2' : 
                  task.priority === 3? 'q3' : 
                  task.priority === 4? 'q4' : 
                  task.priority === 5? 'q5' : 
                  task.priority === 6? 'q6' : 
                  task.priority === 7? 'q7' : 
                  task.priority === 8? 'q8' : 
                  task.priority === 9? 'q9' : 
                  'q10'}`} 
              onClick={() => {
                setFormDataP({...formDataP, priority: task.priority, id: task.id })
                setFormDataT({...formDataT, task: "null", id: ""})
                setFormDataS({...formDataS, status: "null", id: ""})
                router.push(`/user/${userId}?showDialogT=y`)
              }}>{task.priority}</button>
            <DialogP 
              title="Change Priority"
              onClose={onClose}
              submit={handleSubmitP}
              onChange={handleChangeP}
              id={task.id}
              type={task.priority}
              formData={formDataP}
              setFormData={setFormDataP}
            />
          </td>
          <td>
            <button 
              className="btn min-w-24" 
              onClick={() => {
                setFormDataS({...formDataS, status: task.status, id: task.id })
                setFormDataT({...formDataT, task: "null", id: ""})
                setFormDataP({...formDataP, priority: NaN, id: ""})
                router.push(`/user/${userId}?showDialogT=y`)
              }}>{task.status}</button>
              <DialogSA 
                title="Change Status"
                onClose={onClose}
                submit={handleSubmitS}
                onChange={handleChangeS}
                id={task.id}
                type={task.status}
                formData={formDataS}
                setFormData={setFormDataS}
                />
          </td>
          <td><button id={task.id} onClick={handleDelete} className="btn min-w-24 text-red-500">Delete</button></td>
          </tr>
        ))} {/* End of the Map */}

        </tbody>
      </table>
    </div>  
</>
  )
}

// Under each name, I can run separate queries to pull all the individual people... might be a large DB hit though?
// Instead, combine the query to pull ALL tasks, then map out the individual tasks by user.

/*
Next tasks:


*/