"use client"
import { api } from '~/trpc/react'
import DialogS from './DialogS';
import {  useState } from'react';
import { useRouter } from 'next/navigation';

type Props = {
  userId: string
  name?: string | null
  formDataS: {
    updated: string
    status: string
    id: string
    userId: string
  }
  setFormDataS: React.Dispatch<React.SetStateAction<Props['formDataS']>>
  onClose: () => void
  handleSubmitS: (e: React.FormEvent<HTMLFormElement>) => void
  handleChangeS: (e: React.ChangeEvent<HTMLInputElement>) => void
}

interface Task {
  id: string
  task: string
  status: string
  priority: number
  updated: Date | null
  created: Date
  userId: string
}

export default function PullTasks({userId, name, onClose, handleSubmitS, handleChangeS, formDataS, setFormDataS}: Props) {
  const router = useRouter()

  // include completed tasks
  const [showCompleted, setShowCompleted] = useState(false)
  const {data: tasks} = showCompleted? api.post.fullUserTask.useQuery({userId}) : api.post.userTask.useQuery({userId})
  function handleClick(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault()
    setShowCompleted(!showCompleted)
    }

  return (
  <div style={{overflowX: "auto"}} className='w-full'>
    <div className="flex inline-flex bg-gradient-to-r from-indigo-500 text-3xl w-full h-11">
      <h1 className="flex w-1/2 inline-flex justify-start bg-gradient-to-r from-indigo-500 text-3xl h-11">Task Manager for {name}</h1>
      <span className="justify-end flex inline-flex w-1/2 text-lg"><label><input name="completed" type="checkbox" onClick={handleClick} checked={showCompleted} 
  readOnly></input> Include completed tasks?</label></span>
    </div>
    <table className="table text-center w-3/4 m-auto">      
          <thead>
            <tr>
              <td className="w-2/4 text-2xl">Task</td>
              <td className="w-1/4 text-2xl">Priority</td>
              <td className="w-1/4 text-2xl">Status</td>
            </tr>
          </thead>
          <tbody>{tasks?.map((task: Task) => (
            <tr key={task.id}>
            <td>
              <button>
                {task.task}
              </button>
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
                  'q10'}`}>{task.priority}</button>
            </td>
            <td>
              <button 
                className="btn min-w-24" 
                onClick={() => {
                  setFormDataS({...formDataS, id: task.id, status: task.status})
                  router.push(`/user/${userId}?showDialogS=y`)
                }}>{task.status}</button>
                <DialogS 
                  onClose={onClose}
                  submit={handleSubmitS}
                  onChange={handleChangeS}
                  formData={formDataS}
                  />
            </td>
            </tr>
          ))}{/* End of the Map */}
          </tbody>
    </table>
</div>
  )
}
//</span><span>Change Status: [Assigned] [In-Development] [Review] | <Link href="">Completed</Link></span>

/*
Self-assign from "unassigned" will add current user to task, and "assign" the task
Reject will remove the current user from the task, and "unassign" the task; this will replace "delete"
Figure out DB logging

Holdover: All the code required to change the text and priority for the user

// Deletes entire task from database
const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  e.preventDefault()
  delTask.mutate({id: e.currentTarget.id})
  router.refresh()
}
const delTask = api.post.deleteTask.useMutation()
import DialogP from './DialogP';
import DialogT from './DialogT';
const updateTask = api.post.updateTask.useMutation({  
  onSuccess: async () => {
    location.reload()
  },})

const updatePriority = api.post.updatePriority.useMutation({  
  onSuccess: async () => {
    location.reload()
  },})
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
function handleSubmitT(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setFormDataT({...formDataT, updated: updateTime.toISOString()})
  updateTask.mutate(formDataT)
router.push(`/user/${userId}`)
}

function handleSubmitP(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setFormDataP({...formDataP, updated: updateTime.toISOString()})
  updatePriority.mutate(formDataP)
router.push(`/user/${userId}`)
}
function handleChangeT(e: React.ChangeEvent<HTMLInputElement>) {
  setFormDataT({...formDataT, [e.target.name]: e.target.value})
}

function handleChangeP(e: React.ChangeEvent<HTMLSelectElement>) {
  setFormDataP({...formDataP, priority: parseInt(e.target.value)})
}
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
                  router.push(`/user/${userId}?showDialogP=y`)
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
                  router.push(`/user/${userId}?showDialogS=y`)
                }}>{task.status}</button>
                <DialogS 
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
            <td>
              <button 
                id={task.id} 
                onClick={handleDelete} 
                className="btn min-w-24 text-red-500">
                Delete
              </button>
            </td>





*/