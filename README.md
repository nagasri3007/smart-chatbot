# Smart Chatbot with Sources

A Next.js AI chatbot powered by **Gemini 3 Flash** with URL context and Google Search grounding for intelligent responses with source citations.

## Features

- 🤖 **Gemini 3 Flash API** integration
- 🔗 **URL Context + Google Search** grounding for fetching sources
- 🎯 **Smart citation detection** - only fetches sources for complex questions
- 📋 **Source cards** with website names, domains, and clickable links
- 🔄 **Citation toggle** to enable/disable source fetching
- 🎨 **Modern UI** with purple accents, sidebars, and animations

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd c:\Documents\Creation\smart-chatbot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Simple Chat (No Sources)
- Type simple messages like "Hello" or "Thanks" for quick responses without sources

### Complex Questions (With Sources)
- Ask questions like:
  - "What are the best places to visit in Tokyo?"
  - "Compare React vs Vue for web development"
  - "Explain quantum computing in simple terms"
- The app will fetch sources and display them as clickable cards

### Citation Toggle
- Use the toggle switch next to the input field to enable/disable source fetching

## Project Structure

```
smart-chatbot/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Main page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── Sidebar.tsx     # Left navigation
│   │   ├── Header.tsx      # Top header
│   │   ├── ChatArea.tsx    # Chat messages area
│   │   ├── MessageItem.tsx # Individual message
│   │   ├── InputArea.tsx   # Input with toggle
│   │   └── RightPanel.tsx  # Sources & suggestions
│   ├── lib/
│   │   └── gemini-api.ts   # Gemini API integration
│   └── types/
│       └── index.ts        # TypeScript types
├── package.json
├── tsconfig.json
└── next.config.mjs
```

## API Integration

The app uses the Gemini 3 Flash API with these tools:

```javascript
// For complex questions
tools: [
  { "url_context": {} },   // Fetches content from URLs
  { "google_search": {} }  // Grounds responses with web search
]
```

Sources are extracted from:
- `response.candidates[0].urlContextMetadata` (URL context)
- `response.candidates[0].groundingMetadata` (Google Search)

## License

MIT
