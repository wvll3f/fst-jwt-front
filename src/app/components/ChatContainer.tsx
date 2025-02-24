'use Effect'
import React, { useEffect } from 'react'
import { LoaderIcon, Toaster } from 'react-hot-toast';
import { useChatContext } from '../context/ChatContext';
import MessageInput from './MessageInput';

const ChatContainer = () => {
    const {
        getMessages,
        isMessagesLoading,
        selectedUser,
        messages,
        subscribeToMessages,
    } = useChatContext();

    useEffect(() => {
        getMessages(selectedUser!.id)
        subscribeToMessages();
    }, [])

    if (isMessagesLoading) return <div> <LoaderIcon /></div>;

    return (
        <div className='h-dvh flex flex-col justify-between gap-3 p-3 w-dvw'>
            <div className='flex flex-col flex-1'>
                <Toaster />
                {
                    messages ?
                        messages.map((message) => (
                            <ul key={message.id}
                                className={message.receiverId == selectedUser?.id ?
                                    ` right-1 ml-4 rounded-md bg-green-800 flex text-lg p-2 mt-2 items-center` :
                                    ` left-1 ml-4 rounded-md bg-blue-800 flex text-lg p-2 mt-2 items-center`}
                            >

                                <li
                                    className={message.receiverId == selectedUser?.id ?
                                        ` right-1 p-1 ml-4 rounded-md text-green-400` :
                                        ` left-1 ml-4 p-1  rounded-md text-blue-400`} >
                                    {message.receiverId == selectedUser?.id ? selectedUser.name : 'Você'} :
                                </li>
                                <li>
                                    {message.text}
                                </li>
                            </ul>
                        ))
                        : null
                }
            </div>

            <footer className=''>
                <MessageInput />
            </footer>

        </div>
    )
}
export default ChatContainer