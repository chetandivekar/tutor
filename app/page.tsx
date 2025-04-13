"use client";
import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import { MemoizedMarkdown } from "@/components/memoized-markdown";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/chat",
      experimental_throttle: 50, // Throttle updates for better performance [^2]
    });

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height so it adjusts properly on every change
      textarea.style.height = "auto";

      // Set the height based on the content
      textarea.style.height = `${textarea.scrollHeight}px`;

      // Set a maximum height and make it scrollable if needed
      const maxHeight = 250; // Max height in pixels
      if (textarea.scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = "auto"; // Enable vertical scrolling if height exceeds maxHeight
      } else {
        textarea.style.overflowY = "hidden"; // Hide scroll if under max height
      }
    }
  };

  // Ensure it resizes on mount too
  useEffect(() => {
    autoResizeTextarea();
  }, [input]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white dark:bg-zinc-950 dark:border-zinc-800">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-xl font-bold">edquest ai</h1>
        </div>
      </header>

      {/* Chat container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto p-4 container mx-auto max-w-4xl"
      >
        <div className="space-y-6 pb-24">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
              <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-zinc-500"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h2 className="mt-6 text-2xl font-semibold">
                How can I help you today?
              </h2>
              <p className="mt-2 text-zinc-500 dark:text-zinc-400 max-w-sm">
                Ask me anything and I'll provide a properly formatted response.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[85%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                >
                  {message.role === "user" ? (
                    <div className="prose dark:prose-invert ">
                      {message.content}
                    </div>
                  ) : (
                    <div
                      // ref={bottomRef}
                      className="prose dark:prose-invert prose-pre:bg-zinc-800 prose-pre:text-zinc-100 prose-pre:dark:bg-black prose-pre:dark:text-zinc-100 prose-code:text-zinc-700 prose-code:dark:text-zinc-300 prose-code:before:content-none prose-code:after:content-none "
                    >
                      <MemoizedMarkdown
                        id={message.id}
                        content={message.content}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="sticky bottom-0 border-t bg-white dark:bg-zinc-950 dark:border-zinc-800 p-4">
        {/* Error message */}
        {/* {error && (
          <div className="text-red-500 text-center mb-2">
            {error.message || "Something went wrong. Please try again."}
          </div>
        )} */}
        <form onSubmit={handleSubmit} className="container mx-auto max-w-4xl">
          {error ? (
            <div>Something went wrong</div>
          ) : (
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  handleInputChange(e);
                  autoResizeTextarea(); // Adjust height as user types
                }}
                placeholder="Type your message..."
                className="resize-none pr-12 py-3 overflow-hidden"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2.5 h-8 w-8"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
