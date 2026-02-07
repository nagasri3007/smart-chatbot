"use client";

import { forwardRef } from "react";
import { MessageSquare } from "lucide-react";
import { Message } from "@/types";
import MessageItem from "./MessageItem";

interface ChatAreaProps {
    messages: Message[];
    isLoading: boolean;
    onSendMessage: (message: string) => void;
}

const ChatArea = forwardRef<HTMLDivElement, ChatAreaProps>(
    ({ messages, isLoading, onSendMessage }, ref) => {
        const starterPrompts = [
            { emoji: "🗼", text: "Best places to visit in Tokyo" },
            { emoji: "⚛️", text: "Explain quantum computing" },
            { emoji: "💻", text: "React vs Vue comparison" },
        ];

        return (
            <div className="chat-container" ref={ref}>
                {messages.length === 0 ? (
                    <div className="welcome-message">
                        <div className="welcome-icon">
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="url(#welcomeGradient)"
                                strokeWidth="1.5"
                            >
                                <defs>
                                    <linearGradient
                                        id="welcomeGradient"
                                        x1="0"
                                        y1="0"
                                        x2="24"
                                        y2="24"
                                    >
                                        <stop stopColor="#8B5CF6" />
                                        <stop offset="1" stopColor="#EC4899" />
                                    </linearGradient>
                                </defs>
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        </div>
                        <h1>How can I help you today?</h1>
                        <p>
                            Ask me anything! For complex questions, I&apos;ll search the web and
                            provide sources.
                        </p>
                        <div className="starter-prompts">
                            {starterPrompts.map((prompt) => (
                                <button
                                    key={prompt.text}
                                    className="starter-btn"
                                    onClick={() => onSendMessage(prompt.text)}
                                >
                                    {prompt.emoji} {prompt.text}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="messages">
                        {messages.map((message) => (
                            <MessageItem key={message.id} message={message} />
                        ))}
                        {isLoading && (
                            <div className="message message-assistant">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

ChatArea.displayName = "ChatArea";

export default ChatArea;
