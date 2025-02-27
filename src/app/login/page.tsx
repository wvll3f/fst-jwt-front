/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast, { LoaderIcon, Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuthContext } from "../context/AuthContext"

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "password must be at least 2 characters.",
    }),
})

export default function Login() {
    const { login, isLoggingIn, authUser, isAuthenticated } = useAuthContext();
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await login(values)
        if (isAuthenticated) { router.push('/') }
    }

    if (isLoggingIn) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoaderIcon className="size-10 animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex bg-slate-900 text-white justify-center items-center w-screen h-screen">
            <div className="flex justify-center items-center w-[80vw] h-[80vh] rounded-lg ">
                <aside className="p-8 flex flex-col gap-8 justify-center items-center h-full w-full rounded-l-md rounded-bl-md">
                    <h1 className="text-2xl font-bold">Welcome to chatApp</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-4/5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="user@email.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="*******" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button variant="outline" className="w-full text-gray-800 uppercase font-bold text-md " type="submit">Sign In</Button>
                        </form>
                    </Form>
                </aside>
                <aside className="p-8 flex flex-col gap-8 justify-center h-full w-full rounded-r-md rounded-br-md">

                </aside>
            </div>
            <Toaster />

        </div >
    )
}
