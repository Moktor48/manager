"use client"
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
export default function NavBar() {
  const session = useSession()
  const  user = session?.data?.user
  const id = user?.id
  console.log(session)

  if(session?.status === "unauthenticated") {
    return(
    <div className="flex inline-flex bg-gradient-to-r from-indigo-500 text-3xl w-full">

      <div className='flex inline-flex justify-start w-1/2'>
        <p className='mx-5'><Link href="/">Home</Link></p>
      </div>

      <div className="justify-end flex inline-flex w-1/2">
        <p className='mx-5'><Link href="api/auth/signin">Login</Link></p>
      </div>

    </div>
    )
  }

  return (
  <div className="flex inline-flex bg-gradient-to-r from-indigo-500 text-3xl w-full">

    <div className='flex inline-flex justify-start w-1/2'>
        <p className='mx-5'><Link href="/">Home</Link></p>
        <p className='mx-5'><Link href={`/user/${id}`}>User Tasks</Link></p>
        { user?.role == "admin" && <p className='items-end mx-5 flex-row-reverse'><Link href="/admin">Admin</Link></p>}
    </div>

    <div className="justify-end flex inline-flex w-1/2">
        { user?.image != undefined && <Image className='ml-5' src={user?.image} height={72} width={72} alt="avatar" />}
        <p className='mr-5'>[{user?.name} is logged in]</p>
        <p className='mx-5'><Link href="/api/auth/signout">Logout</Link></p>      
    </div>

  </div>
  )
}

