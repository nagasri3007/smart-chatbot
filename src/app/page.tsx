"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ChatArea from "@/components/ChatArea";
import RightPanel from "@/components/RightPanel";
import InputArea from "@/components/InputArea";
import { Message, Source } from "@/types";
import { sendMessage } from "@/lib/gemini-api";

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [sources, setSources] = useState<Source[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [citationsEnabled, setCitationsEnabled] = useState(true);
    const [threadTitle, setThreadTitle] = useState("New Conversation");
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        if (!content.trim() || isLoading) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content,
        };
        setMessages((prev) => [...prev, userMessage]);

        // Update thread title on first message
        if (messages.length === 0) {
            const title = content.length > 40 ? content.substring(0, 37) + "..." : content;
            setThreadTitle(title.replace(/[?!.,]/g, ""));
        }

        setIsLoading(true);

        try {
            const response = await sendMessage(content, messages, citationsEnabled);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response.text,
                sources: response.sources,
            };

            setMessages((prev) => [...prev, assistantMessage]);

            if (response.hasSources && response.sources.length > 0) {
                setSources((prev) => {
                    const existingUrls = new Set(prev.map((s) => s.url));
                    const newSources = response.sources.filter((s) => !existingUrls.has(s.url));
                    return [...prev, ...newSources];
                });
            }
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: `Error: ${error instanceof Error ? error.message : "Failed to get response"}`,
                isError: true,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewThread = () => {
        setMessages([]);
        setSources([]);
        setThreadTitle("New Conversation");
    };

    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <Header threadTitle={threadTitle} onNewThread={handleNewThread} />
                <ChatArea
                    ref={chatContainerRef}
                    messages={messages}
                    isLoading={isLoading}
                    onSendMessage={handleSendMessage}
                />
                <InputArea
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    citationsEnabled={citationsEnabled}
                    onCitationsToggle={setCitationsEnabled}
                />
            </main>
            <RightPanel sources={sources} onSendMessage={handleSendMessage} />
        </div>
    );
}
