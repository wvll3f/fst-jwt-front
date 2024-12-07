'use client'
import React from 'react'

function SideBar() {
    return (
        <div className=" justify-between h-screen text-white bg-slate-800 w-44 flex flex-col items-start border-slate-700 border-r-2">

            <aside className='w-full'>
                <header className='p-3'>
                    <h1 className="font-bold text-lg">Super Chat</h1>
                </header>

                <ul className='flex text-lg p-2 mt-2 items-center hover:bg-slate-900 cursor-pointer'>
                    <li className='p-2 rounded-full w-8 h-8 bg-white'>&nbsp;</li>
                    <li className=' w-full text-center rounded-md flex-1'>Item 1</li>
                </ul>
                <ul className='flex text-lg p-2 mt-2 items-center hover:bg-slate-900 cursor-pointer'>
                    <li className='p-2 rounded-full w-8 h-8 bg-white'>&nbsp;</li>
                    <li className=' w-full text-center rounded-md flex-1'>Item 2</li>
                </ul>
                <ul className='flex text-lg p-2 mt-2 items-center hover:bg-slate-900 cursor-pointer'>
                    <li className='p-2 rounded-full w-8 h-8 bg-white'>&nbsp;</li>
                    <li className=' w-full text-center rounded-md flex-1'>Item 3</li>
                </ul>
                <ul className='flex text-lg p-2 mt-2 items-center hover:bg-slate-900 cursor-pointer'>
                    <li className='p-2 rounded-full w-8 h-8 bg-white'>&nbsp;</li>
                    <li className=' w-full text-center rounded-md flex-1'>Item 4</li>
                </ul>
            </aside>

            <ul className='flex text-lg p-2 mt-2 items-center hover:bg-slate-900 cursor-pointer space-x-4 w-full '>
                <li className=' w-full text-center rounded-md flex-1'>Logout</li>
            </ul>
        </div>
    )
}

export default SideBar