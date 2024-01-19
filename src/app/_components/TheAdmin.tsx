import React from 'react'
import type { Session } from 'next-auth'
import PushTasks from './PushTasks'
import UserHeader from './UserHeader'

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

export default function TheAdmin({        
        userPull,
        pushTask,
        fullTask,
        pullTask,
        delTask,
        updateStatus,
        updateTask,
        updatePriority,
        unassignedTask,
        fullUnassignedTask}: Props, session: Session) {
  return (
    <div>
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
