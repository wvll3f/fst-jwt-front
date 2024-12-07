'use client'

import { useEffect } from "react";
import { LoaderIcon, Toaster } from "react-hot-toast";
import { useAuthStore } from "./stores/useAuthStore";
import { useRouter } from 'next/navigation'


export default function Home() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const router = useRouter()

  useEffect(() => {
    async function callback() {
      await checkAuth(localStorage.getItem('accessToken'));
      console.log(localStorage.getItem('accessToken'))
      console.log(authUser)

      if (!authUser) {
        router.push('/login')
      }
    }
    callback()

  }, [checkAuth]);


  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderIcon className="size-10 animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col items-center h-screen">
      <Toaster />
      <h1>Welcome</h1>
    </div>
  )
}
