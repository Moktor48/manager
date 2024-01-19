import React from 'react'
import UserHeader from '~/app/_components/UserHeader'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'
import PushTasks from '~/app/_components/PushTasks'


export default async function AdminPage() {
  const session = await getServerAuthSession()
  const userPull = await api.post.userList.query()



  if (!session) {
    return <div>You are not logged in.</div>
  }

  if (session?.user.role !== 'admin') {
    return <div>You are not an admin, ass hole.</div>
  }

  return (
    <div>
      <p>Welcome back, {session.user.role} {session.user.name}</p>
      <PushTasks />
      {userPull.map((user) => (
        <UserHeader
          key={user.id}
          userId={user.id}
          userName={user.name}
          userImage={user.image}
        />
      ))}

    </div>
  )
}
// Poll DB for all users
// List tasks assigned by user, and all unassigned tasks
// Allow users to self-assign, so include "unassigned" in everyone's task list? Or have a general task list that assigns to self based on session.
