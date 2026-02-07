"use client";

import { useState } from "react";
import { Link2, Star, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Message } from "@/types";
import { getFaviconUrl, getFallbackFaviconUrl } from "@/lib/gemini-api";

interface MessageItemProps {
    message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
    const [copied, setCopied] = useState(false);

    if (message.role === "user") {
        return (
            <div className="message message-user">
                <div className="message-bubble">{message.content}</div>
            </div>
        );
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const hasSources = message.sources && message.sources.length > 0;

    return (
        <div className="message message-assistant">
            {/* Sources Section */}
            {hasSources && (
                <div className="sources-section">
                    <div className="sources-header">
                        <Link2 size={16} />
                        Sources
                    </div>
                    <div className="source-cards">
                        {message.sources!.slice(0, 3).map((source) => (
                            <a
                                key={source.url}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="source-card"
                            >
                                <div className="source-card-title">{source.title}</div>
                                <div className="source-card-meta">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={getFaviconUrl(source.url)}
                                        alt=""
                                        className="source-favicon"
                                        onError={(e) => {
                                            const img = e.target as HTMLImageElement;
                                            const fallbackUrl = getFallbackFaviconUrl(source.url);
                                            if (img.src !== fallbackUrl && fallbackUrl) {
                                                img.src = fallbackUrl;
                                            } else {
                                                img.style.display = "none";
                                                img.parentElement!.insertAdjacentHTML('afterbegin', '<span class="source-favicon-fallback">🌐</span>');
                                            }
                                        }}
                                    />
                                    <span className="source-url">{source.url}</span>
                                </div>
                            </a>
                        ))}
                        {message.sources!.length > 3 && (
                            <button className="more-sources">
                                +{message.sources!.length - 3} More
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Results Section */}
            <div className="results-section">
                <div className="results-header">
                    <Star size={16} />
                    {hasSources ? "Results" : "Response"}
                </div>
                <div className={`result-content ${message.isError ? "error" : ""}`}>
                    {message.isError ? (
                        <p style={{ color: "#ef4444" }}>⚠️ {message.content}</p>
                    ) : (
                        <ReactMarkdown
                            components={{
                                a: ({ href, children }) => (
                                    <a href={href} target="_blank" rel="noopener noreferrer">
                                        {children}
                                    </a>
                                ),
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    )}
                </div>
                <div className="result-actions">
                    <button className="action-btn" onClick={handleCopy}>
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>
            </div>
        </div>
    );
}
