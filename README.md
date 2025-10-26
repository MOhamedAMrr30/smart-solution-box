# Smart Solution Box

A modern React application built with TypeScript, Vite, and Supabase.

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-solution-box
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is occupied).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions
├── pages/              # Page components
└── assets/             # Static assets
```

## Database Setup

This project uses Supabase for the backend. Make sure to:

1. Set up a Supabase project
2. Run the migrations in the `supabase/migrations/` directory
3. Configure your environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
