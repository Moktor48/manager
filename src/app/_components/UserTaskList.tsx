"use client"
import React from 'react'
import { api } from '~/trpc/react';
import DialogP from './DialogP';
import DialogS from './DialogS';
import DialogT from './DialogT';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from'react';

export default function UserTaskList({id}: {id: string}) {

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
  router.push(`/admin/bounce/${userId}`)
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
  router.push(`/admin/bounce/${userId}`)
}

function handleSubmitP(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setFormDataP({...formDataP, updated: updateTime.toISOString()})
  updatePriority.mutate(formDataP)
  router.push(`/admin/bounce/${userId}`)
}

function handleSubmitS(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setFormDataS({...formDataS, updated: updateTime.toISOString()})
  updateStatus.mutate(formDataS)
  router.push(`/admin/bounce/${userId}`)
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
  return (
<>
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
          <td></td>
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
          <td></td>
          <td></td>
          <td></td>
          <td></td>
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
    <div>
      {userList.data && (
        <ul>
          {userList.data.map((user) => (
            <li key={user.id}>
              <Link href={`/user/${user.id}`}>
                <span>{user.name}</span><span>{ user.image != null && <Image src={user.image} height={100} width={100} alt={`${user.name}`} />}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div> 

Mapping:
model Task {
  id        Int     @id @default(autoincrement())
  task      String
  status    String
  priority  String
  begin     DateTime
  due       DateTime
  user      User    @relation(fields: [userId], references: [id])
  userId    Int
}

model User {
  id    Int     @id @default(autoincrement())
  name  String
  image String
}

const result = await prisma.task.findMany({
  select: {
    id: true,
    task: true, 
    status: true,
    priority: true,
    begin: true,
    due: true,
    user: {
      select: {
        id: true,
        name: true, 
        image: true
      }
    }
  }
})

const mappedResult = result.map(task => ({
  userId: task.user.id,
  userName: task.user.name,
  userImage: task.user.image,
  taskId: task.id,
  task: task.task,
  status: task.status,
  priority: task.priority,
  begin: task.begin,
  due: task.due
}))

AVATAR    USERNAME
Task    Status    Priority    Begin Date    Due Date    Delete
Repeat for all tasks for a given User

AVATAR    USERNAME (each user gets a new heading)
Task    Status    Priority    Begin Date    Due Date    Delete

...and so on

Make a component and map the users to it
Then make a child component that maps the task information under each user heading

<UserLoop 
  user.id
  user.name
  user.image
>
  <TaskLoop
    task.id
    task.task
    task.status
    task.priority
    task.begin
    task.due
  />
</UserLoop>

Another way is to make a query, count the users, then for-loop through the tasks for each user.
pullAllUsers = api.userquery.query
for (let i = 0; i < pullAllUsers.data.length; i++) {
  pullAllTasks = api.taskquery.query
  for (let j = 0; j < pullAllTasks.data.length; j++) {
    if (pullAllTasks.data[j].userId === pullAllUsers.data[i].id) {
      // do something with the task
    }
  }
}

OR... 

query all users,
map to a component
inside the new component it simply creates the task list on a new query


*/