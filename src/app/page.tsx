'use client'

import { useEffect } from "react";
import { LoaderIcon, Toaster } from "react-hot-toast";
import { useAuthStore } from "./stores/useAuthStore";
import { useRouter } from 'next/navigation'
import SideBar from "./components/SideBar";


export default function Home() {
  const { checkAuth, isCheckingAuth,authUser } = useAuthStore();
  const router = useRouter()

  useEffect(() => {
    console.log(authUser)
    if(!authUser){router.push('/login')}
    async function callback() {
      await checkAuth(authUser)
    }
    callback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkAuth]);

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderIcon className="size-25 animate-spin" />
      </div>
    );

  return (
    <div className="flex items-center h-screen w-screen bg-slate-900 text-white">
      <SideBar />
      <div className="flex flex-col items-center justify-center flex-1 h-full">
        <header className="text-center">
          <h1 className="font-bold text-xl">Welcome to SuperChat!</h1>
          <h3>it's my first steps with webSockets apps</h3>
        </header>
      </div>
      <Toaster />
    </div>
  )
}
