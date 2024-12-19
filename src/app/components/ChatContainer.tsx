'use Effect'
import React, { useEffect } from 'react'
import toast, { LoaderIcon, Toaster } from 'react-hot-toast';
import { useChatContext } from '../context/ChatContext';
import MessageInput from './MessageInput';

const ChatContainer = () => {
    const {
        getMessages,
        isMessagesLoading,
        selectedUser,
        messages
    } = useChatContext();

    useEffect(() => {
        try {
            getMessages(selectedUser!.id)
            console.log(messages)
        } catch (error) {
            toast.error('Messages not found')
        }
    }, [selectedUser])

    if (isMessagesLoading) return <div> <LoaderIcon /></div>;

    return (
        <div className='h-screen flex flex-col w-screen relative '>
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

            <footer className='absolute p-2 bottom-0 w-full'>
                <MessageInput />
            </footer>

        </div>
    )
}
export default ChatContainer