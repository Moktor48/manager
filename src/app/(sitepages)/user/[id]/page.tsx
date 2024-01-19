import { api } from '~/trpc/server'
import React from 'react'
import TheBoss from '~/app/_components/TheBoss'

export default async function page({ params }: {params: { id: string } }) {
    const id = params.id
    const user = await api.post.user.query({id})

  return (
    <div>
        <div className="h-20">
          <h1>{user?.name}, your role is {user?.role}</h1>
        </div>
        <TheBoss 
          userId={id}
          name={user?.name}
        />

    </div>
  )
}
