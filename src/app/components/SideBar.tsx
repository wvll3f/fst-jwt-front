'use client'
import React, { useEffect, useState } from 'react'
import { LoaderIcon, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useChatContext } from '../context/ChatContext';
import { useAuthContext } from '../context/AuthContext';

function SideBar() {
    const { getUsers, isUsersLoading, users, setSelectedUser } = useChatContext();

    const router = useRouter();

    const { onlineUsers } = useAuthContext();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    useEffect(() => {
        async function callback() {
            await getUsers();
        }
        callback()
    }, [])


    const filteredUsers = showOnlineOnly
        ? users.filter((user) => onlineUsers.includes(user.id))
        : users;

    if (isUsersLoading) return <div> <LoaderIcon /></div>;

    return (
        <div className=" justify-between h-dvh text-white bg-slate-800 w-52 flex flex-col items-start border-slate-900">

            <aside className='w-full'>
                <header className='p-3'>
                    <h1 className="font-bold text-lg">Super Chat</h1>
                    <h1></h1>
                </header>
                <div>
                    <label className="cursor-pointer flex items-center gap-2 p-3">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-sm rounded-full"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    {
                        filteredUsers.map((user) => (
                            <ul key={user.id}
                                onClick={() => {
                                    setSelectedUser(user)
                                }
                                }
                                className='flex text-lg p-2 mt-2 items-center hover:bg-slate-900 cursor-pointer'>
                                <li className='p-2 rounded-full w-8 h-8 bg-white'>&nbsp;</li>
                                <li className=' w-full ml-4 rounded-md flex-1' >{user.name}</li>
                            </ul>
                        ))
                    }
                </div>

            </aside>

            <ul className='flex text-lg p-2 mt-2 items-center hover:bg-slate-900 cursor-pointer space-x-4 w-full '>
                <li className=' w-full text-center rounded-md flex-1'
                    onClick={() => {
                        localStorage.removeItem('accessToken')
                        router.push('/login')
                    }}
                >Logout</li>
            </ul>
            <Toaster />
        </div>
    )
}

export default SideBar