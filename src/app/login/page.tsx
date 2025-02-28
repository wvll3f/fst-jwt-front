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
import { LoaderIcon, Toaster } from "react-hot-toast"
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
    const { login, isLoggingIn, checkAuth } = useAuthContext();
    const { push } = useRouter()
    useEffect(() => {
        checkAuth()
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await login(values)
    }

    if (isLoggingIn) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-900">
                <LoaderIcon color="white" className="size-10 animate-spin" />
            </div>
        )
    }

    const shades = [
        "bg-blue-800",
        "bg-blue-700",
        "bg-blue-900",
        "bg-blue-800",
        "bg-blue-800",
        "bg-blue-600",
        "bg-blue-700",
        "bg-blue-800",
        "bg-blue-900",
    ];

    return (
        <div className="flex bg-slate-900 text-white justify-center items-center w-screen h-screen">
            <aside className="p-8 flex flex-col gap-8 justify-center items-center h-full w-full rounded-l-md rounded-bl-md">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-24 w-full">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg">Email</FormLabel>
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
                                    <FormLabel className="text-lg">Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="*******" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full text-gray-800 uppercase font-bold text-md h-12" type="submit">Sign In</Button>
                    </form>
                </Form>
            </aside>
            <aside className="p-8 gap-8 flex flex-col items-center justify-center h-full w-full rounded-r-md rounded-br-md bg-blue-950">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-blue-400" >Welcome back</h1>
                    <h1 className="text-2xl font-bold text-blue-400" >your favorite chat!</h1>
                </div>
                <div className="grid grid-cols-3 gap-3 w-[70%] h-[70%]">
                    {shades.map((shade, index) => (
                        <div
                            key={index}
                            className={`rounded-lg flex items-center justify-center ${shade} opacity-70 hover:opacity-30 animate-pulse backdrop-blur-md`}
                        />
                    ))}
                </div>
                <h1 className="text-xl text-blue-400">A beautiful and modern interface for you</h1>
            </aside>
            <Toaster />

        </div >
    )
}
