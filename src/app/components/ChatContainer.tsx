"use client";
import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import { LoaderIcon, Toaster } from "react-hot-toast";
import MessageInput from "./MessageInput";
import { CircleX } from "lucide-react";
import { useChatStore } from "../store/chat";

type MessageType = {
  id: string;
  text: string;
  receiverId: string;
};

const ChatContainer = () => {
  const {
    getMessages,
    isMessagesLoading,
    selectedUser,
    setSelectedUser,
    messages,
    subscribeToMessages,
    unsubscribeMessages,
  } = useChatStore();

  const messageEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef<number>(0);
  const [messageList, setMessageList] = useState<MessageType[]>([]);

  useEffect(() => {
    if (
      Array.isArray(messages) &&
      messages.length !== prevMessagesLength.current
    ) {
      setMessageList(messages);
      prevMessagesLength.current = messages.length;
    }
  }, [messages]);

  useLayoutEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageList]);

  useEffect(() => {
    getMessages(selectedUser!.id);
    subscribeToMessages();
    return () => unsubscribeMessages();
  }, [getMessages, selectedUser, subscribeToMessages, unsubscribeMessages]);

  if (isMessagesLoading)
    return (
      <div>
        <LoaderIcon />
      </div>
    );

  return (
    <div className="h-dvh flex flex-col justify-between gap-3 w-dvw overflow-hidden">
      <header className="flex justify-between items-center w-full h-10 py-6 bg-slate-950 px-8 border-slate-600 border-b-2">
        <div className="flex justify-center items-center gap-4">
          <li className="p-2 rounded-full w-8 h-8 bg-white">&nbsp;</li>
          <p className="capitalize font-bold text-xl">
            {selectedUser ? selectedUser.name : "chat"}
          </p>
        </div>
        <CircleX
          className="cursor-pointer"
          onClick={() => {
            setSelectedUser(null);
            unsubscribeMessages();
          }}
        />
      </header>

      <div
        className="flex flex-col flex-1 overflow-y-scroll px-8 
            [&::-webkit-scrollbar]:w-2 
            [&::-webkit-scrollbar-track]:bg-gray-800 
            [&::-webkit-scrollbar-thumb]:bg-gray-500 
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700 
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        <Toaster />
        {messageList.length > 0 &&
          messageList.map((message) => (
            <div
              key={message.id}
              className={
                message.receiverId === selectedUser?.id
                  ? `rounded-md bg-green-800 flex text-lg p-2 mt-2 self-end min-w-28 max-w-[50%] mb-2`
                  : `rounded-md bg-blue-800 flex text-lg p-2 mt-2 self-start min-w-28 max-w-[50%] mb-2`
              }
            >
              <div
                className={
                  message.receiverId === selectedUser?.id
                    ? "flex flex-col items-end w-full"
                    : "flex flex-col items-start w-full"
                }
              >
                <span
                  className={
                    message.receiverId === selectedUser?.id
                      ? `text-green-400 self-end`
                      : `text-blue-400 self-start`
                  }
                >
                  {message.receiverId === selectedUser?.id
                    ? "Você"
                    : selectedUser?.name}
                </span>
                <span className="p-0 m-0">{message.text}</span>
              </div>
            </div>
          ))}
        <div ref={messageEndRef}></div>
      </div>

      <footer className="relative border-slate-600 border-t-2 w-full">
        <MessageInput />
      </footer>
    </div>
  );
};

export default ChatContainer;
