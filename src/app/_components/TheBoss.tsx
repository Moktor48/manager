"use client"
import { api } from '~/trpc/react'
import { useRouter } from 'next/navigation';
import {  useState } from'react';
import PullTasks from '~/app/_components/PullTasks'
import UserTaskListUA from '~/app/_components/UserTaskListUA'

type Props = {
  userId: string
  name?: string | null
}

export default function TheBoss({userId, name}: Props) {

    const router = useRouter() 
    const updateTime = new Date()
    const updateStatus = api.post.updateStatus.useMutation({  
        onSuccess: async () => {
            location.reload()
        },})
        // formData for the task components to be modified
    const [formDataS, setFormDataS] = useState({
        updated: updateTime.toISOString(),
        status: "null",
        id: "",
        userId: userId
        })

    // Submission logic for the task components to be modified
    function handleSubmitS(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setFormDataS({...formDataS, updated: updateTime.toISOString()})
        updateStatus.mutate(formDataS)
        router.push(`/user/${userId}`)
        }

    // Change handler for the task components to be modified
    function handleChangeS(e: React.ChangeEvent<HTMLInputElement>) {
        setFormDataS(prev => ({...prev, 
            status: e.target.value,
            userId: e.target.value === "Unassigned"? "Unassigned" : userId
        }))
        }

    // Clears searchParams from URL and refreshes the page
    async function onClose() {
        router.push(`/user/${userId}`)
        }

  return (
    <div>
        <PullTasks 
          userId={userId}
          name={name}
          onClose={onClose}
          handleSubmitS={handleSubmitS}
          handleChangeS={handleChangeS}
          formDataS={formDataS}
          setFormDataS={setFormDataS}
        />
        <UserTaskListUA
          userId={userId}
          onClose={onClose}
          handleSubmitS={handleSubmitS}
          handleChangeS={handleChangeS}
          formDataS={formDataS}
          setFormDataS={setFormDataS}
        />
    </div>
  )
}
