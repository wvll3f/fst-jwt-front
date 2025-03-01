import { MessageSquare } from "lucide-react";
import React from "react";

function NoChatSelected() {
  return (
    <div className="flex items-center h-screen w-screen bg-slate-900 text-white">
      <div className="flex flex-col items-center justify-center flex-1 h-full">
        <header className="flex flex-col justify-center items-center gap-3 text-center">
          <div
            className="w-16 h-16 rounded-2xl bg-blue-700 flex items-center
             justify-center animate-bounce"
          >
            <MessageSquare className="w-8 h-8 text-primary " />
          </div>
          <h1 className="font-bold text-xl">Welcome to SuperChat!</h1>
          <h3>it&apos;s my first steps with webSockets apps</h3>
        </header>
      </div>
    </div>
  );
}

export default NoChatSelected;
