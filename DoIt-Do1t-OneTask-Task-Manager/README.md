
# DoIt - Task Manager

A simple, efficient task manager that shows one task at a time to help you focus on what matters most.

## Features

- 🎯 Focus on one task at a time
- 🎨 Beautiful UI with light/dark mode
- 🤖 AI-powered task organization and prioritization
- 📱 Responsive design
- ✅ Task completion tracking
- 🔄 Drag-and-drop task reordering

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: SQLite with Drizzle ORM
- **AI**: OpenAI API
- **Build Tool**: Vite

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <repo-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_actual_api_key_here
SESSION_SECRET=generate_a_random_string_here
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for AI features (optional)
- `SESSION_SECRET`: Secret key for session management

## Brand Colors

The app uses a green/mint color palette. You can customize colors in `client/src/index.css`:

- `--brand-mint`: #b1f2d6 (light mint)
- `--brand-forest`: #002e22 (dark forest)
- `--brand-emerald`: #03d47c (primary green)
- `--brand-pine`: #085239 (accent pine)

See `COLOR-GUIDE.md` for detailed color customization instructions.

## Building for Production

```bash
npm run build
```

## Project Structure

```
├── client/           # Frontend React application
│   └── src/
│       ├── components/  # React components
│       ├── lib/         # Utilities and context
│       └── pages/       # Page components
├── server/           # Backend Express server
├── shared/           # Shared types and schemas
└── attached_assets/  # Static assets (not included in repo)
```

## License

MIT

## Contributing

Feel free to open issues and pull requests!
