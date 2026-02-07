"use client";

import { Link2 } from "lucide-react";
import { Source } from "@/types";
import { getFaviconUrl, getFallbackFaviconUrl } from "@/lib/gemini-api";

interface RightPanelProps {
    sources: Source[];
    onSendMessage: (message: string) => void;
}

export default function RightPanel({ sources, onSendMessage }: RightPanelProps) {
    const suggestedTasks = [
        "Give me a detailed itinerary",
        "Explain the public transportation route",
        "Plan the holiday from financial standpoint",
    ];

    const suggestedQuestions = [
        "Is the traffic bad?",
        "What days are they open?",
        "Is it suitable for me who doesn't like crowds?",
        "Are there toilets, prayer rooms, rest areas?",
    ];

    return (
        <aside className="sidebar-right">
            {/* Sources Section */}
            <div className="sidebar-section sources-section">
                <h3>
                    <Link2 size={16} />
                    Sources
                </h3>
                {sources.length > 0 ? (
                    <div className="sources-list">
                        {sources.map((source) => (
                            <a
                                key={source.url}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sidebar-source-item"
                            >
                                <div className="sidebar-source-favicon">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={getFaviconUrl(source.url)}
                                        alt=""
                                        width={16}
                                        height={16}
                                        onError={(e) => {
                                            const img = e.target as HTMLImageElement;
                                            const fallbackUrl = getFallbackFaviconUrl(source.url);
                                            if (img.src !== fallbackUrl && fallbackUrl) {
                                                img.src = fallbackUrl;
                                            } else {
                                                img.parentElement!.innerHTML = "🌐";
                                            }
                                        }}
                                    />
                                </div>
                                <div className="sidebar-source-info">
                                    <div className="sidebar-source-title">{source.title}</div>
                                    <div className="sidebar-source-url">{source.url}</div>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <div className="sources-placeholder">
                        <p>Sources will appear here when you ask questions.</p>
                    </div>
                )}
            </div>

            {/* Suggested Tasks */}
            <div className="sidebar-section">
                <h3>Suggested tasks</h3>
                <div className="suggested-tasks">
                    {suggestedTasks.map((task) => (
                        <button
                            key={task}
                            className="task-btn"
                            onClick={() => onSendMessage(task)}
                        >
                            {task}
                        </button>
                    ))}
                </div>
            </div>

            {/* Suggested Questions */}
            <div className="sidebar-section">
                <h3>Suggested questions</h3>
                <div className="suggested-questions">
                    {suggestedQuestions.map((question) => (
                        <button
                            key={question}
                            className="question-btn"
                            onClick={() => onSendMessage(question)}
                        >
                            {question}
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
}
