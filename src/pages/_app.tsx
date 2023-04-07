"use client";
import "@/styles/globals.css";
import Image from "next/image";
import { KeyboardEvent } from "react";
import useState from "react-usestateref";
import user from "../../public/user.svg";
import scholar from "../../public/scholar.svg";
import logo from "../../public/logo.svg";

enum Messenger {
  User = "User",
  AI = "AI",
}

interface MessageProps {
  text: string;
  messenger: Messenger;
  key: number;
}

interface InputProps {
  onSubmit: (input: string) => void;
  disabled: boolean;
}

const ChatMessage = ({ text, messenger }: MessageProps) => {
  return (
    <>
      {messenger == Messenger.User && (
        <div className="bg-white p-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap">
          <Image src={user} alt="user" height={32} width={32} />
          <p className="text-black">{text}</p>
        </div>
      )}
      {messenger == Messenger.AI && (
        <div className="bg-gray-200 p-4 rounded-lg flex gap-4 items-center whitespace-pre-wrap">
          <Image src={scholar} alt="scholar" height={32} width={32} />
          <p className="text-black">{text}</p>
        </div>
      )}
    </>
  );
};

const ChatInput = ({ onSubmit, disabled }: InputProps) => {
  const [input, setInput] = useState("");

  const submitInput = () => {
    onSubmit(input);
    setInput("");
  };

  const handleEnterKey = (event: KeyboardEvent) => {
    if (event.code === "Enter") {
      submitInput();
    }
  };

  return (
    <div className="bg-white border-2 p-2 rounded-lg flex justify-center">
      <input
        value={input}
        onChange={(e) => setInput((e.target as HTMLInputElement).value)}
        className="w-full px-3 text-gray-800 rounded-lg focus:outline-none"
        type="text"
        placeholder="Enter Prompt"
        disabled={disabled}
        onKeyDown={(e: KeyboardEvent) => handleEnterKey(e)}
      />
      {/* { disabled && (
        <svg></svg>
      )} */}
    </div>
  );
};

export default function ChatApp() {
  const [messages, setMessages, messagesRef] = useState<MessageProps[]>([]);
  const [loading, setLoading] = useState(false);

  const queryApi = async (input: string) => {
    setLoading(true);

    const userMessage: MessageProps = {
      text: input,
      messenger: Messenger.User,
      key: new Date().getTime(),
    };

    setMessages([...messagesRef.current, userMessage]);
    const gptResponse = await fetch("/api/answers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: input }),
    }).then((gptResponse) => gptResponse.json());

    setLoading(false);

    if (gptResponse.text) {
      const gptMessage: MessageProps = {
        text: gptResponse.text,
        messenger: Messenger.AI,
        key: new Date().getTime(),
      };
      setMessages([...messagesRef.current, gptMessage]);
    } else {
      return new Response("Error occurred.", { status: 400 });
    }
  };

  return (
    <main className="relative mx-auto">
      <nav className="sticky w-screen py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
        <div className="flex">
          <Image src={logo} alt="logo" height={256} width={256} />
        </div>
        <div className="flex mx-auto ">
          <ChatInput
            onSubmit={(input: string) => queryApi(input)}
            disabled={loading}
          />
        </div>
        <div className=" max-w-3xl px-3">
          <div className="flex md:flex-row gap-6">
            <label className="transition-colors duration-150 cursor-pointer hover:text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-14 h-14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
              <input className="block w-0 h-0" name="file" type="file" />
            </label>
            <div className="flex mt-4 md:mt-0 md:flex-col justify-center">
              <button
                disabled={false}
                className="w-1/2 px-4 py-3 text-sm font-medium text-white transition-colors duration-300 bg-black rounded-lg md:w-auto md:text-base disabled:bg-gray-400 hover:bg-gray-800"
              >
                Upload file
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="mt-5 px-4">
        {messages.map((message: MessageProps) => (
          <ChatMessage
            key={message.key}
            text={message.text}
            messenger={message.messenger}
          />
        ))}
        {messages.length == 0 && (
          <p className="text-center text-2xl text-bold text-black">
            Enter a prompt above or upload a pdf to get started!
          </p>
        )}
      </div>
    </main>
  );
}
