"use client"
import { api } from '~/trpc/react'
import DialogP from './DialogP';
import DialogS from './DialogS';
import DialogT from './DialogT';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from'react';
import { useSearchParams } from 'next/navigation';

export default function PullTasks({id}: {id: string}) {
const userId = id
const updateTime = new Date()
const session = useSession()
const delTask = api.post.deleteTask.useMutation()
const updateTask = api.post.updateTask.useMutation()
const updateStatus = api.post.updateStatus.useMutation()
const updatePriority = api.post.updatePriority.useMutation()
const router = useRouter()

// include completed tasks
const [showCompleted, setShowCompleted] = useState(false)
const {data: tasks} = showCompleted? api.post.fullUserTask.useQuery({userId}) : api.post.userTask.useQuery({userId})

// Deletes entire task from database
const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  e.preventDefault()
  delTask.mutate({id: e.currentTarget.id})
  router.push(`/user/bounce/${userId}`)
}

// formData for the task components to be modified
const [formDataT, setFormDataT] = useState({
  updated: updateTime.toISOString(),
  task: "null",
  id: ""
})

const [formDataP, setFormDataP] = useState({
  updated: updateTime.toISOString(),
  priority: "null",
  id: ""
})

const [formDataS, setFormDataS] = useState({
  updated: updateTime.toISOString(),
  status: "null",
  id: ""
})

// Submission logic for the task components to be modified
function handleSubmitT(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setFormDataT({...formDataT, updated: updateTime.toISOString()})
  updateTask.mutate(formDataT)
  router.push(`/user/bounce/${userId}`)
}

function handleSubmitP(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setFormDataP({...formDataP, updated: updateTime.toISOString()})
  updatePriority.mutate(formDataP)
  router.push(`/user/bounce/${userId}`)
}

function handleSubmitS(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setFormDataS({...formDataS, updated: updateTime.toISOString()})
  updateStatus.mutate(formDataS)
  router.push(`/user/bounce/${userId}`)
}

// Change handler for the task components to be modified
function handleChangeT(e: React.ChangeEvent<HTMLInputElement>) {
  setFormDataT({...formDataT, [e.target.name]: e.target.value})
}

function handleChangeP(e: React.ChangeEvent<HTMLInputElement>) {
  setFormDataP({...formDataP, [e.target.name]: e.target.value})
}

function handleChangeS(e: React.ChangeEvent<HTMLInputElement>) {
  setFormDataS({...formDataS, [e.target.name]: e.target.value})
}

// Clears searchParams from URL and refreshes the page
async function onClose() {
  router.push(`/user/${userId}`)
}

function handleClick(e: React.MouseEvent<HTMLInputElement>) {
  e.preventDefault()
  setShowCompleted(!showCompleted)
  router.refresh()
}

// On ANY change, update date/time. On COMPLETE, hide row from manager. 
  return (
  <div style={{overflowX: "auto"}} className='flex w-full'>
    <table className="table-xs text-center w-1/2 m-auto">      
          <thead>
            <tr>
              <td colSpan={2}>Task Manager for {session?.data?.user.name}</td>
              <td><label><input name="completed" type="checkbox" onClick={handleClick} checked={showCompleted}></input> Include completed tasks?</label></td>
            </tr>
            <tr>
              <td>Task</td>
              <td>Priority</td>
              <td>Status</td>
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
                  setFormDataP({...formDataP, priority: "null", id: ""})
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
                className={`btn min-w-24 ${task.priority === 'HIGH'? 'text-red-500' : task.priority ==='MEDIUM'? 'text-yellow-500' : ''}`} 
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
                  setFormDataP({...formDataP, priority: "null", id: ""})
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
            <td><button id={task.id} onClick={handleDelete} className="btn min-w-24 text-red-500">Delete</button></td>
            </tr>
          ))} {/* End of the Map */}

          </tbody>
    </table>
</div>
  )
}
//</span><span>Change Status: [Assigned] [In-Development] [Review] | <Link href="">Completed</Link></span>

/*
TASK: Click: Allow text to be changed, submit button to save changes
STATUS: Click: Checks which status is current, hides that option, shows other options (Assigned, In-Development, Review, Completed)
        The options will be buttons on a modal
        Clicking a button will automatically submit the change to the DB, "Completed" should also mark the completion date
Priority: Click: Checks which priority is current, hides that option, shows other options
        The options will be buttons on a modal
        Clicking a button will automatically submit the change to the DB

Modal: On click: Show Modal, populate Modal with task.id
    Priority: Radio options for HIGH, MEDIUM, LOW, with current choice selected
    Status: Radio options for Assigned, In-Development, Review, and Complete with current choice selected
    Task: Text input for task, with current task populated
    Submit button: On click: Submits changes to DB, closes modal, refreshes page
    Cancel button: On click: Closes modal, does not submit changes to DB, does not refresh page
    Pass state through Modal, clicking a button will open a modal with the task.id and the state of the task

    One submit to rule them all: Since they are all in the Task table, I should be able to run a modify query to make changes as needed without changing the whole row


    */