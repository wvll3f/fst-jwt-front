'use client'
import React, { useEffect, useRef } from 'react'
import { LoaderIcon, Toaster } from 'react-hot-toast';
import { useChatContext } from '../context/ChatContext';
import MessageInput from './MessageInput';
import { useAuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

const ChatContainer = () => {
    const {
        getMessages,
        isMessagesLoading,
        selectedUser,
        setSelectedUser,
        messages,
        subscribeToMessages,
        unsubscribleMessages
    } = useChatContext();

    const { checkAuth } = useAuthContext();

    const messageEndRef = useRef<HTMLDivElement>(null);
    const { push } = useRouter();

    useEffect(() => {
        checkAuth().then(() => console.log('adsadada')).catch(() => {push('/login')})
    }, [])

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        getMessages(selectedUser!.id)
        subscribeToMessages();
        return () => unsubscribleMessages();
    }, [getMessages, selectedUser, subscribeToMessages, unsubscribleMessages])

    if (isMessagesLoading) return <div> <LoaderIcon /></div>;

    return (
        <div className='h-dvh flex flex-col justify-between gap-3 w-dvw overflow-hidden'>
            <header className='flex justify-between items-center w-full h-10 py-6 bg-slate-950 px-8 border-slate-600 border-b-2'>
                <div className='flex justify-center items-center gap-4'>
                    <li className='p-2 rounded-full w-8 h-8 bg-white'>&nbsp;</li>
                    <p
                        className='capitalize font-bold text-xl'>
                        {selectedUser ? selectedUser.name : 'chat'}
                    </p>
                </div>
                <p className='cursor-pointer' onClick={() => {
                    setSelectedUser(null)
                    unsubscribleMessages()
                }}>x</p>
            </header>
            <div className='flex flex-col flex-1 overflow-y-scroll px-8 
            [&::-webkit-scrollbar]:w-2 
            [&::-webkit-scrollbar-track]:bg-gray-800 
            [&::-webkit-scrollbar-thumb]:bg-gray-500 
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500'>
                <Toaster />
                {
                    messages ?
                        messages.map((message) => (
                            <div
                                key={message.id}
                                ref={messageEndRef}
                                className={message.receiverId == selectedUser?.id ?
                                    `rounded-md bg-green-800 flex text-lg p-2 mt-2 self-end min-w-28 max-w-[50%] mb-2` :
                                    `rounded-md bg-blue-800 flex text-lg p-2 mt-2 self-start min-w-28 max-w-[50%] mb-2`}
                            >
                                <div className={message.receiverId == selectedUser?.id ? 'flex flex-col items-end w-full' : 'flex flex-col items-start w-full'}>
                                    <span
                                        className={message.receiverId == selectedUser?.id ?
                                            `text-green-400 self-end` :
                                            `text-blue-400 self-start`} >
                                        {message.receiverId == selectedUser?.id ? 'Você' : selectedUser?.name}
                                    </span>
                                    <span className='p-0 m-0'>{message.text}</span>
                                </div>
                                {/* <span
                                    className={message.receiverId == selectedUser?.id ?
                                        `slef-start right-0 text-green-400` :
                                        `left-0 text-blue-400`} >
                                    {message.receiverId == selectedUser?.id ? 'Você' : selectedUser?.name}
                                </span> */}

                            </div>
                        ))
                        : null
                }
            </div>

            <footer className='relative border-slate-600 border-t-2 w-full'>
                <MessageInput />
            </footer>

        </div >
    )
}
export default ChatContainer