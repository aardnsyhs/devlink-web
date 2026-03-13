# DevLink

A platform for sharing technical articles and code snippets for developers. Built with **Next.js** (frontend) and **Laravel** (backend API).

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS v4
- **UI Components** — shadcn/ui + Radix UI
- **State Management** — Zustand (auth)
- **Server State** — TanStack Query v5
- **Form** — React Hook Form + Zod
- **Rich Text Editor** — Tiptap
- **Syntax Highlighting** — Shiki
- **HTTP Client** — Axios

## Features

- Browse and search technical articles with tag filtering
- Browse and search code snippets with language & tag filtering
- Automatic syntax highlighting (light & dark mode) via Shiki
- Advanced code presentation with line permalink, diff/focus notation, and word highlighting
- Authentication (login & register)
- Dashboard to manage articles, snippets, and tags (full CRUD)
- Dark mode support
- Responsive design

## Project Structure

```
src/
├── app/
│   ├── (auth)/         # Login & register pages
│   ├── (main)/         # Public pages (articles, snippets)
│   └── dashboard/      # Dashboard pages (protected)
├── components/
│   ├── article/        # Article components
│   ├── snippet/        # Snippet components
│   ├── layout/         # Navbar, Footer, Providers
│   ├── shared/         # Reusable components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom hooks (useArticles, useSnippets, etc.)
├── lib/                # Axios instance, utils, validations, shiki
├── services/           # API service layer
├── store/              # Zustand store (auth)
└── types/              # TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn
- Backend API running (see [API Documentation](https://api.ardiansyahsulistyo.me/api/documentation))

### Installation

```bash
git clone https://github.com/aardnsyhs/devlink-web.git
cd devlink-web

yarn install
```

### Environment Configuration

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Running the Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
yarn build
yarn start
```

## Scripts

| Script       | Description                  |
| ------------ | ---------------------------- |
| `yarn dev`   | Start the development server |
| `yarn build` | Build for production         |
| `yarn start` | Start the production server  |
| `yarn lint`  | Run ESLint                   |

## Shiki Notation

DevLink snippet viewer supports inline code notation for richer presentation.
Snippet form in dashboard also renders a live preview using the same Shiki pipeline as the public snippet page.

### Line Highlight

```php
$order = Order::create($data); // [!code highlight]
```

### Focus Next N Lines

```php
// [!code focus:3]
DB::beginTransaction();
$order = Order::create($data);
DB::commit();
```

### Diff Style

```php
$legacyTotal = 0; // [!code --]
$total = $calculator->calculate($items); // [!code ++]
```

### Word Highlight

Wrap important tokens with `[[...]]`:

```php
return DB::[[transaction]](function () use ($data) {
    // ...
});
```

### Line Permalink

On snippet detail pages, click the line-number gutter to copy a direct permalink such as `#L12`.
