"use client";

import { Search, UserPlus, Plus, ChevronDown } from "lucide-react";

interface HeaderProps {
    threadTitle: string;
    onNewThread: () => void;
}

export default function Header({ threadTitle, onNewThread }: HeaderProps) {
    return (
        <header className="main-header">
            <div className="header-left">
                <div className="model-selector">
                    <span className="model-icon">✦</span>
                    <span>Gemini 3 Flash</span>
                    <ChevronDown size={12} />
                </div>
                <div className="mode-selector">
                    <span>Smart</span>
                    <ChevronDown size={12} />
                </div>
            </div>
            <div className="header-center">
                <span className="collection-label">+ Collection /</span>
                <span className="thread-title">{threadTitle}</span>
            </div>
            <div className="header-right">
                <button className="header-btn">
                    <Search size={16} />
                    Search thread
                </button>
                <button className="header-btn">
                    <UserPlus size={16} />
                    Invite
                </button>
                <button className="header-btn primary" onClick={onNewThread}>
                    <Plus size={16} />
                    New Thread
                </button>
            </div>
        </header>
    );
}
