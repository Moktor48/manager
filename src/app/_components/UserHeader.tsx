import React from 'react'
import UserTaskList from './UserTaskList'
import { api } from '~/trpc/server'
import Image from 'next/image'
import { getServerAuthSession } from '~/server/auth'

type Props = {
    userId: string
    userName: string | null
    userImage: string | null
}

export default function UserHeader({userId, userName, userImage}: Props) {
    const session = getServerAuthSession()
    const userTasks = api.post.user.query
  return (
    <div>
        <h1><span>{ userImage != undefined && <Image src={userImage} height={45} width={45} alt="avatar" />}</span><span>{userName}</span></h1>
        <UserTaskList 
            id={userId}
        />
    </div>
  )
}
