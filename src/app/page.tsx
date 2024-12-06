'use client'

import { useEffect } from "react";
import { LoaderIcon, Toaster } from "react-hot-toast";
import { useAuthStore } from "./stores/useAuthStore";
import { useRouter } from 'next/navigation'


export default function Home() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers,isLoggingIn } = useAuthStore();
  const router = useRouter()

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if(!isLoggingIn){
    router.push('/login')
  }

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderIcon className="size-10 animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col items-center h-screen">
      <Toaster/>
      Olá
    </div>
  )
}
