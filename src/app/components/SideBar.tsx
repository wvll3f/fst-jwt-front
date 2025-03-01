"use client";
import React, { useEffect, useState } from "react";
import { LoaderIcon, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useAuthStore } from "../store/auth";
import { useChatStore } from "../store/chat";

function SideBar() {
  const { getUsers, isUsersLoading, users, setSelectedUser } = useChatStore();

  const router = useRouter();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    async function callback() {
      await getUsers();
    }
    callback();
  }, []);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user.id))
    : users;

  if (isUsersLoading)
    return (
      <div>
        {" "}
        <LoaderIcon />
      </div>
    );

  return (
    <div className=" justify-between h-dvh text-white bg-slate-800 min-w-52 w-[20%] flex flex-col items-start border-r-2 border-r-slate-600">
      <aside className="w-full">
        <header className="p-2 bg-slate-950 border-slate-600 border-b-2 flex">
          <MessageSquare className="w-8 h-8 text-blue-700 " />
          <h1 className="ml-4 font-bold text-2xl">Super Chat</h1>
        </header>
        <div>
          <div className="flex items-center p-4 rounded-sm gap-4">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="w-4 h-4 rounded-xl text-blue-600 bg-gray-100 border-gray-300  focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label className="tracking-wider text-sm font-bold">
              Show online only
            </label>
          </div>
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                setSelectedUser(user);
              }}
              className="flex text-lg p-2 mt-2 items-center hover:bg-slate-900 cursor-pointer w-full"
            >
              <span className="rounded-full w-10 h-10 bg-white">
                <div className="w-full h-full relative">
                  {onlineUsers.includes(user.id) && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-green-600" />
                  )}
                </div>
              </span>
              <div className="flex flex-col justify-center">
                <p className=" w-full ml-4 rounded-md flex-1 capitalize tracking-wider">
                  {user.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex text-lg px-2 py-4 mt-2 items-center space-x-4 w-full border-slate-600 border-t-2 ">
        <Button
          className=" w-full text-center rounded-md flex-1 font-bold tracking-wider capitalize"
          onClick={() => {
            localStorage.removeItem("accessToken");
            router.push("/login");
          }}
        >
          Logout
        </Button>
      </div>
      <Toaster />
    </div>
  );
}

export default SideBar;
