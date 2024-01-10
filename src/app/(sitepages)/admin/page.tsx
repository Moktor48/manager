"use client"
import React from 'react'
import PushTasks from '~/app/_components/PushTasks'
import { useSession } from 'next-auth/react'
export default function AdminPage() {
  const session = useSession()
  const user = session?.data?.user
  console.log("Session =", session)
  if (user?.role !== 'admin' || null) {
    return <div>You are not an admin, ass hole.</div>
  }
  return (
    <div>
      <p>Welcome back, {user.role} {user.name}</p>
      <PushTasks />
    </div>
  )
}
// Poll DB for all users
// Display all users in a pulldown menu
// Once selected, use radio buttons to change roles ("Admin", "User", "Guest")
// Save changes to DB
