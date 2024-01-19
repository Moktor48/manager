"use client"
import React from 'react'
import { useState } from 'react'
import { api } from '~/trpc/react'
import { useRouter } from 'next/navigation'

export default function PushTasks() {
    const router = useRouter()
    const now = new Date()
    const users = api.post.userList.useQuery()
    const [formData, setFormData] = useState({task: "", status: "Unassigned", userId: "Unassigned", priority: 1, created: now.toISOString()})
    
    const mutation = api.post.pushTask.useMutation({  
        onSuccess: async () => {
            location.reload()
        },})

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData(prevFormData => {
            console.log(formData)
            return {
               ...prevFormData,
                [e.target.name]: e.target.value,
            }
        })
    }

    function handleChangeP(e: React.ChangeEvent<HTMLSelectElement>) {
    setFormData(prevFormData => {
        console.log(formData)

        return {
            ...prevFormData,
            priority: parseInt(e.target.value),
        }
    })
}
    function handleChangeS(e: React.ChangeEvent<HTMLSelectElement>) {
        setFormData(prev => ({...prev, 
            userId: e.target.value,
            status: e.target.value === "Unassigned"? "Unassigned" : "Assigned"
        }))
        }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        console.log(formData)
        e.preventDefault()
        mutation.mutate(formData)
        router.push(`/admin`)
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Task: </label>
                <input type="text" name="task" onChange={handleChange} value={formData.task} />

                <label>Priority: </label>
                <select 
                name="priority"
                value={formData.priority}
                onChange={handleChangeP}
                >
                {[...Array(10).keys()].map(n => (
                    <option key={n+1} value={n+1}>
                    {n+1}
                    </option>
                ))}
                </select>

                <label>User: </label>
                <select name="userId" onChange={handleChangeS} value={formData.userId}>
                    <option value="Unassigned">Unassigned</option>
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

/*



                <label>Status: </label>
                <select name="status" onChange={handleChangeS} value={formData.status}>
                    <option value="Unassigned">Unassigned</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In-Development">In-Development</option>
                    <option value="Review">Review</option>
                </select>
 */