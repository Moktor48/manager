"use client"
import React from 'react'
import UserTaskList from './UserTaskList'
import Image from 'next/image'
import { useState } from 'react'
type Props = {
    userId: string
    userName: string | null
    userImage: string | null
}

export default function UserHeader({userId, userName, userImage}: Props) {
  const updateTime = new Date()
    const [formData, setFormData] = useState({
      id: "",
      userId: userId,
      task: "",
      status: "null",
      priority: NaN,
      updated: updateTime.toISOString(),
    })

  return (
    <div>
        <h1 className="flex inline-flex bg-gradient-to-r from-indigo-500 text-3xl w-full min-h-11"><span className="left-1/4" >{ userImage != undefined && <Image src={userImage} height={45} width={45} alt="avatar" />}</span><span>{userName}</span></h1>
        <UserTaskList 
            userId={userId}
            formData={formData}
            setFormData={setFormData}
        />
    </div>
  )
}
