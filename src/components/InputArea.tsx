"use client";

import { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface InputAreaProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    citationsEnabled: boolean;
    onCitationsToggle: (enabled: boolean) => void;
}

export default function InputArea({
    onSendMessage,
    isLoading,
    citationsEnabled,
    onCitationsToggle,
}: InputAreaProps) {
    const [input, setInput] = useState("");

    const handleSubmit = () => {
        if (!input.trim() || isLoading) return;
        onSendMessage(input.trim());
        setInput("");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="input-area">
            <div className="input-container">
                <input
                    type="text"
                    className="message-input"
                    placeholder="Ask a question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />
                <div className="input-actions">
                    <label className="citation-toggle">
                        <input
                            type="checkbox"
                            checked={citationsEnabled}
                            onChange={(e) => onCitationsToggle(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-label">Citation</span>
                    </label>
                    <button
                        className="send-btn"
                        onClick={handleSubmit}
                        disabled={isLoading || !input.trim()}
                        title="Send message"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
