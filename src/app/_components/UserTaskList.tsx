"use client"
import React from 'react'
import { api } from '~/trpc/react';
import DialogP from './DialogP';
import DialogSA from './DialogSA';
import DialogT from './DialogT';
import { useRouter } from 'next/navigation';
import { useState } from'react';

export default function UserTaskList({userId}: {userId: string}) {
  const updateTime = new Date()

// include completed tasks
  const [showCompleted, setShowCompleted] = useState(false)
  const {data: tasks} = showCompleted? api.post.fullUserTask.useQuery({userId}) : api.post.userTask.useQuery({userId})

//DELETE updating
  const delTask = api.post.deleteTask.useMutation()
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    delTask.mutate({id: e.currentTarget.id})
    router.push(`/admin`)
    router.refresh()
  }

//STATUS updating
  const updateStatus = api.post.updateStatus.useMutation({  
    onSuccess: async () => {
      location.reload()
    },})

  const [formDataS, setFormDataS] = useState({
    updated: updateTime.toISOString(),
    status: "null",
    id: "",
    userId: userId
  })

  function handleChangeS(e: React.ChangeEvent<HTMLInputElement>) {
    setFormDataS({...formDataS, 
      status: e.target.value,
      userId: e.target.value === "Unassigned"? "Unassigned" : formDataS.userId
      })
  }

  function handleSubmitS(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormDataS({...formDataS, updated: updateTime.toISOString()})
    updateStatus.mutate(formDataS)
    router.push(`/admin`)
  }

//TASK updating  
  const updateTask = api.post.updateTask.useMutation({  
    onSuccess: async () => {
      location.reload()
    },})

  const [formDataT, setFormDataT] = useState({
    updated: updateTime.toISOString(),
    task: "null",
    id: ""
  })

  function handleChangeT(e: React.ChangeEvent<HTMLInputElement>) {
    setFormDataT({...formDataT, [e.target.name]: e.target.value})
  }

  function handleSubmitT(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormDataT({...formDataT, updated: updateTime.toISOString()})
    updateTask.mutate(formDataT)
    router.push(`/admin`)
  }

//PRIORITY updating
  const updatePriority = api.post.updatePriority.useMutation({  
    onSuccess: async () => {
      location.reload()
    },})
  const router = useRouter()

  const [formDataP, setFormDataP] = useState({
    updated: updateTime.toISOString(),
    priority: NaN,
    id: ""
  })

  function handleChangeP(e: React.ChangeEvent<HTMLSelectElement>) {
    setFormDataP({...formDataP, priority: parseInt(e.target.value)})
  }

  function handleSubmitP(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormDataP({...formDataP, updated: updateTime.toISOString()})
    updatePriority.mutate(formDataP)
    router.push(`/admin`)
  }

//Dialog close  
async function onClose() {
  router.push(`/admin`)
}

//Checkbox logic
function handleClick(e: React.MouseEvent<HTMLInputElement>) {
  e.preventDefault()
  setShowCompleted(!showCompleted)
}
  return (
<>
    <div style={{overflowX: "auto"}} className='flex w-full'>
      <table className="table text-center w-3/4 m-auto">      
        <thead>
          <tr>
            <td className="w-2/5 text-xl">Task</td>
            <td className="w-1/5 text-xl">Priority</td>
            <td className="w-1/5 text-xl">Status</td>
            <td className="w-1/5 text-xl"><label><input name="completed" type="checkbox" onClick={handleClick} checked={showCompleted} readOnly></input> Include completed tasks?</label></td>
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
                router.push(`/admin/?showDialogT=y`)  
              }}>{task.task}</button>
              <DialogT 
                onClose={onClose}
                submit={handleSubmitT}
                onChange={handleChangeT}
                formData={formDataT}
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
                router.push(`/admin/?showDialogP=y`)
              }}>{task.priority}</button>
            <DialogP 
              onClose={onClose}
              submit={handleSubmitP}
              onChange={handleChangeP}
              formData={formDataP}
            />
          </td>
          <td>
            <button 
              className="btn min-w-24" 
              onClick={() => {
                console.log(task)
                setFormDataS({...formDataS, status: task.status, id: task.id, userId: task.userId })
                console.log(formDataS)
                router.push(`/admin/?showDialogSA=y`)
              }}>{task.status}</button>
              <DialogSA 
                onClose={onClose}
                submit={handleSubmitS}
                onChange={handleChangeS}
                formData={formDataS}
                />
          </td>
          <td><button id={task.id} onClick={handleDelete} className="btn min-w-24 text-red-500">Delete</button></td>
          </tr>
        ))}{/* End of the Map */}
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