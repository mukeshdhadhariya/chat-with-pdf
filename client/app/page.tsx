import FileUploadComponent from "./components/file-upload";
import ChatComponent from "./components/chat";
import ThemeToggle from "./components/ThemeToggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (


    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br 
                    from-gray-100 to-gray-200 dark:from-neutral-900 dark:to-neutral-950 
                    text-gray-900 dark:text-gray-200 relative">

      {/* File Upload Section */}
      <div className="w-full md:w-1/4 min-h-[20vh] md:min-h-screen p-4 flex flex-col gap-4 
                bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md shadow-lg 
                border-b md:border-b-0 md:border-r border-gray-300 dark:border-neutral-700">

        {/* Controls - sticky top inside sidebar */}
        <div className="sticky top-2 flex items-center justify-between bg-white/60 
                  dark:bg-neutral-800/60 rounded-lg p-2 backdrop-blur-md z-10">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>

        {/* File uploader below */}
        <div className="w-full max-w-sm mt-4">
          <FileUploadComponent />
        </div>
      </div>


      {/* Chat Section */}
      <div className="flex-1 w-full min-h-[80vh] md:min-h-screen p-6 
                      bg-gray-50 dark:bg-neutral-900 shadow-inner overflow-hidden flex flex-col">

        <div className="flex-1 overflow-y-auto rounded-2xl p-4 
                        bg-white dark:bg-neutral-950 shadow-inner border 
                        border-gray-200 dark:border-neutral-800">
          <ChatComponent />
        </div>
      </div>

      {/* Floating Controls (top-right corner) */}

    </div>
  );
}
