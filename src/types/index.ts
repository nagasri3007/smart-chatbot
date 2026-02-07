export interface Source {
    url: string;
    title: string;
    domain: string;
    number: number;
}

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources?: Source[];
    isError?: boolean;
}

export interface ApiResponse {
    text: string;
    sources: Source[];
    hasSources: boolean;
    searchQueries?: string[];
}
