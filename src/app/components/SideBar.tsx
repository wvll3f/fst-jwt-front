'use client'
import React, { useEffect, useState } from 'react'
import { IUser, useChatStore } from '../stores/useChatStore';
import { useAuthStore } from '../stores/useAuthStore';
import { LoaderIcon } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

function SideBar() {
    const { getUsers, isUsersLoading, setSelectedUser } = useChatStore();
    const router = useRouter();

    const { onlineUsers } = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [userSide, setUserSide] = useState<IUser[]>([]);

    useEffect(() => {
        async function callback() {
            const temp = await getUsers();
            setUserSide(temp)
        }
        callback()
    }, [getUsers])


    const filteredUsers = showOnlineOnly
        ? userSide.filter((user) => onlineUsers.includes(user.id))
        : userSide;

    if (isUsersLoading) return <div> <LoaderIcon /></div>;

    return (
        <div className=" justify-between h-screen text-white bg-slate-800 w-44 flex flex-col items-start border-slate-700 border-r-2">

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
                                onClick={setSelectedUser(user)}
                                className='flex text-lg p-2 mt-2 items-center hover:bg-slate-900 cursor-pointer'>
                                <li className='p-2 rounded-full w-8 h-8 bg-white'>&nbsp;</li>
                                <li className=' w-full text-center rounded-md flex-1' >{user.name}</li>
                            </ul>
                        ))
                    }
                </div>

            </aside>

            <ul className='flex text-lg p-2 mt-2 items-center hover:bg-slate-900 cursor-pointer space-x-4 w-full '>
                <li className=' w-full text-center rounded-md flex-1'
                    onClick={() =>{ 
                        localStorage.removeItem('accessToken') 
                        router.push('/login')
                    }}
                >Logout</li>
            </ul>
        </div>
    )
}

export default SideBar