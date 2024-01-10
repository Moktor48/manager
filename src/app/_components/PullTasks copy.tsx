"use client"
import { api } from '~/trpc/react'
import Dialog from '../(sitepages)/@dialogs/page';
import Link from 'next/link';
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

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  if(formDataT.task!== "null") {
  updateTask.mutate(formDataT)
  setFormDataT({...formDataT, task: "null"})
  router.push(`/user/${userId}`)
} else if(formDataP.priority!== "null") { 
  updatePriority.mutate(formDataP)
  setFormDataP({...formDataP, priority: "null"})
  router.push(`/user/${userId}`)
} else if(formDataS.status!== "null") {
  updateStatus.mutate(formDataS)
  setFormDataS({...formDataS, status: "null"})
  router.push(`/user/${userId}`)
} return formDataT.task, formDataP.priority, formDataS.status
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
  console.log("Dialog was closed")
}


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
              <button>
                <Link href={`/user/${userId}?showDialog=y`} onClick={() => setFormDataT({ task: task.task, id: task.id })}>{task.task}</Link>
                <Dialog 
                  title="Change Task"
                  onClose={onClose}
                  id={task.id}
                  type={task.task}
                  userId={userId}
                  >
                    <form onSubmit={handleSubmit} className="task-form">
                      <label>
                        <input onChange={handleChangeT} type="text" name="task" value={formDataT.task} />
                      </label>
                      <button type="submit">Submit</button>
                    </form>
                </Dialog>
              </button>
            </td>

            <td>
              <button className={`btn min-w-24 ${task.priority === 'HIGH'? 'text-red-500' : task.priority ==='MEDIUM'? 'text-yellow-500' : ''}`}>
                <Link href={`/user/${userId}?showDialog=y`} onClick={() => setFormDataP({ priority: task.priority, id: task.id })}>{task.priority}</Link>
                <Dialog 
                  title="Change Priority"
                  onClose={onClose}
                  id={task.id}
                  type={task.priority}
                  userId={userId}
                  >
                    <form onSubmit={handleSubmit} className="priority-form flex flex-col justify-center items-center">
                      <label>
                        <input onChange={handleChangeP} name="priority" type="radio" value="HIGH" checked={formDataP.priority === 'HIGH'} />
                        HIGH
                      </label><br />
                      <label>
                        <input onChange={handleChangeP} name="priority" type="radio" value="MEDIUM" checked={formDataP.priority === 'MEDIUM'} />
                        MEDIUM
                      </label><br />
                      <label>
                        <input onChange={handleChangeP} name="priority" type="radio" value="LOW" checked={formDataP.priority === 'LOW'} />
                        LOW
                      </label><br />
                      <button type="submit">Submit</button>
                    </form>
                </Dialog>
              </button>
            </td>

            <td>
              <button className="btn min-w-24">
                <Link href={`/user/${userId}?showDialog=y`} onClick={() => setFormDataS({ status: task.status, id: task.id })}>{task.status}</Link>
                <Dialog 
                  title="Change Status"
                  onClose={onClose}
                  id={task.id}
                  type={task.status}
                  userId={userId}
                  >
                    <form onSubmit={handleSubmit} className="status-form">
                      <label>
                        <input onChange={handleChangeS} type="radio" name="status" value="Assigned" checked={formDataS.status === 'Assigned'} />
                        Assigned
                      </label>
                      <label>
                        <input onChange={handleChangeS} type="radio" name="status" value="In-Development" checked={formDataS.status === 'In-Development'} />
                        In-Development
                      </label>
                      <label>
                        <input onChange={handleChangeS} type="radio" name="status" value="Review" checked={formDataS.status === 'Review'} />
                        Review
                      </label>
                      <label>
                        <input onChange={handleChangeS} type="radio" name="status" value="Completed" checked={formDataS.status === 'Completed'} />
                        Completed
                      </label>
                      <button type="submit">Submit</button>
                    </form>
                </Dialog>
              </button>
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