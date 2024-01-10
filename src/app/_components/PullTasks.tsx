"use client"
import { api } from '~/trpc/react'
import DialogP from './DialogP';
import DialogS from './DialogS';
import DialogT from './DialogT';
import { useRouter } from 'next/navigation';
import { useState } from'react';

export default function PullTasks({id}: {id: string}) {
const userId = id
const { data: tasks } = api.post.task.useQuery({userId})
const mutation = api.post.deleteTask.useMutation()
const updateTask = api.post.updateTask.useMutation()
const updateStatus = api.post.updateStatus.useMutation()
const updatePriority = api.post.updatePriority.useMutation()
const router = useRouter()
const [formDataT, setFormDataT] = useState({
  task: "null",
  id: ""
})

const [formDataP, setFormDataP] = useState({
  priority: "null",
  id: ""
})

const [formDataS, setFormDataS] = useState({
  status: "null",
  id: ""
})

const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  e.preventDefault()
  console.log(e.currentTarget.id)
  mutation.mutate({id: e.currentTarget.id})
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function handleSubmitT(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  console.log(formDataT)
  updateTask.mutate(formDataT)
  setFormDataT({id: "", task: "null"})
  router.push(`/user/${userId}`)
  router.refresh()
}

function handleSubmitP(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  console.log(formDataP)
  updatePriority.mutate(formDataP)
  setFormDataP({id: "", priority: "null"})
  router.push(`/user/${userId}`)
  router.refresh()
}

async function handleSubmitS(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  console.log(formDataS)
  updateStatus.mutate(formDataS)
  setFormDataS({id: "", status: "null"})
  router.push(`/user/${userId}`)
  await sleep(500)
  router.refresh()
}

function handleChangeT(e: React.ChangeEvent<HTMLInputElement>) {
  setFormDataT({...formDataT, [e.target.name]: e.target.value})
}

function handleChangeP(e: React.ChangeEvent<HTMLInputElement>) {
  setFormDataP({...formDataP, [e.target.name]: e.target.value})
}

function handleChangeS(e: React.ChangeEvent<HTMLInputElement>) {
  setFormDataS({...formDataS, [e.target.name]: e.target.value})
}

async function onClose() {
  router.push(`/user/${userId}`)
}
// On ANY change, update date/time. On COMPLETE, hide row from manager. 
  return (
  <div style={{overflowX: "auto"}} className='flex w-full'>
    <table className="table-xs text-center w-1/2 m-auto">      
          <thead>
            <tr>
              <td colSpan={3}>Task Manager</td>
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
                  setFormDataT({ task: task.task, id: task.id })
                  setFormDataS({status: "null", id: ""})
                  setFormDataP({priority: "null", id: ""})
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
                  setFormDataP({ priority: task.priority, id: task.id })
                  setFormDataT({task: "null", id: ""})
                  setFormDataS({status: "null", id: ""})
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
                  setFormDataS({ status: task.status, id: task.id })
                  setFormDataT({task: "null", id: ""})
                  setFormDataP({priority: "null", id: ""})
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