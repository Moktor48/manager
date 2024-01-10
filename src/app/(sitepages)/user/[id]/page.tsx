import { api } from '~/trpc/server'
import React from 'react'
import PullTasks from '~/app/_components/PullTasks'




export default async function page({ params }: {params: { id: string } }) {
    const id = params.id
    const user = await api.post.user.query({id})

  return (
    <div>
        <h1>{user?.name}, your role is {user?.role}</h1>
        <PullTasks 
          id={id}
          />
    </div>
  )
}
