"use client"
import React from 'react'
import { useState } from 'react'
import { api } from '~/trpc/react'
import { useRouter } from 'next/navigation'

export default function PushTasks() {
    const router = useRouter()
    const now = new Date()
    const users = api.post.userList.useQuery()
    const [formData, setFormData] = useState({task: "", status: "", userId: "", priority: "", created: now.toISOString()})
    const mutation = api.post.pushTask.useMutation()
    async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData(prevFormData => {
        console.log(formData)
        return {
            ...prevFormData,
            [e.target.name]: e.target.value,
        }
    })
}
    async function handleChanges(e: React.ChangeEvent<HTMLSelectElement>) {
    setFormData(prevFormData => {
        console.log(formData)

        return {
            ...prevFormData,
            [e.target.name]: e.target.value,
        }
    })
}
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        console.log(formData)
        e.preventDefault()
        mutation.mutate(formData)
        router.refresh()
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Task: </label>
                <input type="text" name="task" onChange={handleChange} value={formData.task} />

                <label>Priority: </label>
                <select name="priority" onChange={handleChanges} value={formData.priority}>
                    <option value="choose">Choose</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>

                <label>Status: </label>
                <select name="status" onChange={handleChanges} value={formData.status}>
                    <option value="choose">Choose</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In-Development">In-Development</option>
                    <option value="Review">Review</option>
                </select>

                <label>User: </label>
                <select name="userId" onChange={handleChanges} value={formData.userId}>
                    <option value="choose">Choose</option>
                    {users.data && (
                        <>
                        {users.data.map((user) => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                        </>
                    )}
                </select>
                <button className="btn" type="submit">Submit</button>
            </form>
        </div>
  )
}
