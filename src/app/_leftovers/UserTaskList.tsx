"use client"
import React from 'react'
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import { useState } from'react';
import DialogAuton from './DialogAuton';


type Props = {

  userId: string
}

export default function UserTaskList({userId}: Props) {
  const router = useRouter()
  async function onClose() {
    router.push(`/admin`)
  }
// include completed tasks
  const [showCompleted, setShowCompleted] = useState(false)
  const {data: tasks} = showCompleted? api.post.fullUserTask.useQuery({userId}) : api.post.userTask.useQuery({userId})

//DELETE updating
  const delTask = api.post.deleteTask.useMutation({
    onSuccess: async () => {
      location.reload()
    }
  })

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    delTask.mutate({id: e.currentTarget.id})
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
            <td className="w-1/3 text-xl">Task</td>
            <td className="w-1/6 text-xl">Priority</td>
            <td className="w-1/6 text-xl">Status</td>
            <td className="w-1/6 text-xl"><label><input name="completed" type="checkbox" onClick={handleClick} checked={showCompleted} readOnly></input> Include completed tasks?</label></td>
          </tr>
        </thead>
        <tbody>
          {tasks?.map((task) => (
          <tr key={task.id}>
            <td>
              <button >
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
                    'q10'}`}>
                {task.priority}
              </button>
            </td>
            <td>
              <button 
                className="btn min-w-24">
                  {task.status}
                </button>
            </td>
            <td>
              <button  id={task.id}
                onClick={()=> {
                  console.log(task.id)
                  router.push(`/admin?showDialog=y&id=${task.id}`)
                }} 
                className="btn min-w-24 text-yellow-500">
                  Modify
              </button>
                <DialogAuton 
                  onClose={onClose}
                  id={task.id}
                  userId={task.userId}
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