"use client";

import { Home, MessageSquare } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="sidebar-left">
            <div className="logo">
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="16" cy="16" r="14" stroke="url(#gradient)" strokeWidth="2" />
                    <path
                        d="M10 16L14 20L22 12"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                            <stop stopColor="#8B5CF6" />
                            <stop offset="1" stopColor="#EC4899" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <nav className="sidebar-nav">
                <button className="nav-btn active" title="Home">
                    <Home size={20} />
                </button>
                <button className="nav-btn" title="Chat">
                    <MessageSquare size={20} />
                </button>
            </nav>
            <div className="sidebar-bottom">
                <div className="user-avatar">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                        alt="User"
                    />
                </div>
            </div>
        </aside>
    );
}
