"use client"
import React from 'react'
import Link from 'next/link'
import { api } from '~/trpc/react';
import Image from 'next/image';



export default function Page() {

const userList = api.post.userList.useQuery()

  return (
    <div>
      {userList.data && (
        <ul>
          {userList.data.map((user) => (
            <li key={user.id}>
              <Link href={`/user/${user.id}`}>
                <a>{user.name}</a><Image src={user.image} height={100} width={100} alt={`${user.name}`} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
