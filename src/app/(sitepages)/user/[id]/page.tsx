import { api } from '~/trpc/server'
import React from 'react'
import PullTasks from '~/app/_components/PullTasks'
import UserTaskListUA from '~/app/_components/UserTaskListUnassign'

export default async function page({ params }: {params: { id: string } }) {
    const id = params.id
    const user = await api.post.user.query({id})

  return (
    <div>
        <div className="h-20">
          <h1>{user?.name}, your role is {user?.role}</h1>
        </div>
        <PullTasks 
          id={id}
          name={user?.name}
          />
        <UserTaskListUA
          id={id}
        />
    </div>
  )
}
