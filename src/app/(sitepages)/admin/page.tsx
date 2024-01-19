import React from 'react'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'
import TheAdmin from '~/app/_components/TheAdmin'

type Props = {
  userPull: {
    id: string
    name: string
    role: string
    image: string
  }[],
  pushTask: {
    id: string
    name: string
    description: string
    priority: string
    status: string
    userId: string
    created: string
    updated: string | null
  },
  fullTask: {
    id: string;
    task: string;
    status: string;
    priority: number;
    created: Date;
    updated: Date | null;
    userId: string;
}[],
  pullTask: {
    id: string;
    task: string;
    status: string;
    priority: number;
    created: Date;
    updated: Date | null;
    userId: string;
}[],
  delTask: {
    id: string;
    task: string;
    status: string;
    priority: number;
    created: Date;
    updated: Date | null;
    userId: string;
},
  updateStatus: {
    id: string;
    status: string;
    userId: string;
    updated: Date | null;
},
  updateTask: {
    task: string;
    updated: Date | null;
    id: string;
},
  updatePriority: {
    id: string;
    priority: number;
    updated: Date | null;
},
  unassignedTask: {
    id: string;
    task: string;
    status: string;
    priority: number;
    created: Date;
    updated: Date | null;
    userId: string;
}[],
  fullUnassignedTask: {
    id: string;
    task: string;
    status: string;
    priority: number;
    created: Date;
    updated: Date | null;
    userId: string;
}[]
}



export default async function AdminPage() {
  const session = await getServerAuthSession()
  const userPull = await api.post.userList.query()
  const pushTask = await api.post.pushTask.mutate() // Return for inputs
  const fullTask = await api.post.fullUserTask.query() // Return for inputs
  const pullTask = await api.post.userTask.query() // Return for inputs
  const delTask = await api.post.deleteTask.mutate() // Return for inputs
  const updateStatus = await api.post.updateStatus.mutate() // Return for inputs
  const updateTask = await api.post.updateTask.mutate() // Return for inputs
  const updatePriority = await api.post.updatePriority.mutate() // Return for inputs
  const unassignedTask = await api.post.unassignedTask.query() // Return for inputs
  const fullUnassignedTask = await api.post.fullUnassignedTask.query() // Return for inputs


  if (!session) {
    return <div>You are not logged in.</div>
  }

  if (session?.user.role !== 'admin') {
    return <div>You are not an admin, ass hole.</div>
  }

  return (
    <div>
      <p>Welcome back, {session.user.role} {session.user.name}</p>
      <TheAdmin 
        userPull={userPull}
        session={session}
        pushTask={pushTask}
        fullTask={fullTask}
        pullTask={pullTask}
        delTask={delTask}
        updateStatus={updateStatus}
        updateTask={updateTask}
        updatePriority={updatePriority}
        unassignedTask={unassignedTask}
        fullUnassignedTask={fullUnassignedTask}

      />


    </div>
  )
}
// Poll DB for all users
// List tasks assigned by user, and all unassigned tasks
// Allow users to self-assign, so include "unassigned" in everyone's task list? Or have a general task list that assigns to self based on session.
