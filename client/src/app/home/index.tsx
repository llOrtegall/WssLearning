import { useWebSocket } from "../../hooks/useWebSocket";
import { useAuth } from "../../hooks/useAuth";
import type { FormEvent } from "react";

const WS_URL = import.meta.env.VITE_WS_URL

export default function Home() {
  const { user, logout } = useAuth();

  
  const handleMessage = (e: MessageEvent) => {
    console.log(e.data)
	}
  
  const ws = useWebSocket(WS_URL, handleMessage)

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data = new FormData(e.currentTarget)
		const newMessage = data.get('newMessageText') as string

		if (ws) {
      ws.send(JSON.stringify({
        type: 'newMessage',
        data: {
          content: newMessage,
          to: '1',
          from: user?.id
        }
      }))
    }

	}

  return (
    <section className="flex h-screen">
      <nav className="w-4/12 flex flex-col h-full p-2 gap-2">
        <header className="flex items-center gap-2 justify-center py-2 text-blue-700">
          <h1 className="text-2xl font-bold">Chat App</h1>
          <figure>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
          </figure>
        </header>
        <ul className="flex-1 flex flex-col gap-2 overflow-y-auto">
          <li>Chat 1</li>
          <li>Chat 2</li>
          <li>Chat 3</li>
        </ul>
        <footer>
          <p>{user?.username}</p>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={logout}>Logout</button>
        </footer>
      </nav>

      <main className="w-8/12 flex flex-col h-full py-2">
        <div className="flex-1">
          messages
        </div>
        <form onSubmit={sendMessage} className="flex gap-2 px-2">
          <input className="w-full p-2 border border-gray-300 rounded" type="text" name="newMessageText" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">Send</button>
        </form>
      </main>
    </section>
  )
}