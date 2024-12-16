'use Effect'
import React, { useEffect } from 'react'
import { useChatStore } from '../stores/useChatStore';
import toast, { LoaderIcon, Toaster } from 'react-hot-toast';

const ChatContainer = () => {
    const {
        getMessages,
        isMessagesLoading,
        selectedUser,
    } = useChatStore();

    useEffect(() => {
        try {
            getMessages(selectedUser!.id)
        } catch (error) {
            toast.error('Messages not found')
        }
    }, [selectedUser])

    if (isMessagesLoading) return <div> <LoaderIcon /></div>;

    return (
        <div>
            <Toaster />
        </div>
    )
}
export default ChatContainer