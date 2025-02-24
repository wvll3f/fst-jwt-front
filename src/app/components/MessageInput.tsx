import React, { useState } from 'react'
import { useChatContext } from '../context/ChatContext';
import { Send } from "lucide-react";

function MessageInput() {

    const [text, setText] = useState("");


    const { sendMessages } = useChatContext();

    const handleSendMessage = async (e: any) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            await sendMessages({
                text: text.trim(),
            });
            setText("");

        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-3 w-full">
            <div className="flex-1 flex gap-2">
                <input
                    type="text"
                    className="w-full input input-bordered rounded-lg input-sm sm:input-md p-2 text-slate-900"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
            <button
                type="submit"
                className="btn btn-sm btn-circle cursor-pointer p-2"
                disabled={!text.trim()}
            >
                <Send size={28} />
            </button>
        </form>
    )
}

export default MessageInput