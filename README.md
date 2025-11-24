# 🥚 Egglocke Generator

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A modern, interactive web application for creating and managing custom Pokémon for Egglocke challenges.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Usage](#-usage) • [Screenshots](#-screenshots)

</div>

---

## 📋 Overview

The **Egglocke Generator** is a full-stack web application designed for Pokémon players who want to create custom Pokémon for their Egglocke runs. Built with the latest Next.js 16 and a modern tech stack, it provides a seamless experience for generating, customizing, and managing Pokémon with French language support.

## ✨ Features

### 🎮 Pokémon Creation
- **493 Gen 1-4 Pokémon** available via PokéAPI integration
- **Smart search** with accent-insensitive filtering (type "etrein" to find "Étreinte")
- **Custom nicknames** (required field)
- **Gender selection** (Male ♂ / Female ♀ / Genderless ⚲)
- **Shiny variant** toggle with sprite preview

### ⚔️ Move System
- **Learned moves**: Select from moves the Pokémon can naturally learn
- **Random moves**: Generate random moves with instant preview and reroll capability
- **1000+ moves** available from PokéAPI
- **Visual separation** between learned and other moves in dropdown
- **French translations** for all moves with automatic fallback

### 🎨 User Interface
- **Searchable dropdowns** (Combobox) for Pokémon and moves
- **Real-time validation** with React Hook Form + Zod
- **Responsive design** with Tailwind CSS v4
- **Accessible components** using Shadcn/UI
- **Spoiler system** for creator names (click to reveal)

### 💾 Data Management
- **PostgreSQL database** (Neon serverless)
- **Drizzle ORM** for type-safe queries
- **Server Actions** for form submission (no API routes needed)
- **Aggressive caching** (24h) for optimal performance
- **Gallery view** for all created Pokémon

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router and Turbopack
- **[TypeScript](https://www.typescriptlang.org/)** - Strict mode for type safety
- **[React Hook Form](https://react-hook-form.com/)** - Performant form management
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Modern utility-first CSS
- **[Shadcn/UI](https://ui.shadcn.com/)** - Accessible component library

### Backend
- **[Neon PostgreSQL](https://neon.tech/)** - Serverless PostgreSQL
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM
- **[Zod v4](https://zod.dev/)** - Schema validation
- **[PokéAPI v2](https://pokeapi.co/)** - Pokémon data source

### Key Features
- **Server Actions** for data mutations
- **Server Components** for optimal performance
- **Optimistic caching** with `unstable_cache`
- **Static generation** for homepage and gallery

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database (Neon recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd poke-generator
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file:
   ```env
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
   ```

4. **Push database schema**
   ```bash
   pnpm db:push
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Creating a Pokémon

1. **Select a Pokémon** - Use the searchable dropdown to find your Pokémon (supports French names)
2. **Add a nickname** - Give your Pokémon a unique name (required)
3. **Choose gender** - Select Male, Female, or Genderless
4. **Toggle Shiny** - Enable shiny variant if desired
5. **Select 4 moves**:
   - Choose **"Capacité"** to pick from all available moves
   - Choose **"Aléatoire"** to generate a random move (with reroll option 🎲)
6. **Enter creator name** - Add your name
7. **Submit** - Create your Pokémon!

### Viewing Created Pokémon

Navigate to the **"Pokémon Créés"** page to view all created Pokémon in a grid layout. Creator names are hidden by default (spoiler system) - click to reveal.

## 🎯 Project Structure

```
poke-generator/
├── app/
│   ├── api/
│   │   ├── moves/          # All moves API endpoint
│   │   └── pokemon/[id]/   # Pokemon details API
│   ├── created/            # Gallery page
│   └── page.tsx            # Homepage
├── components/
│   ├── ui/                 # Shadcn/UI components
│   │   ├── button.tsx
│   │   ├── combobox.tsx    # Custom searchable dropdown
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── select.tsx
│   ├── pokemon-card.tsx    # Card display component
│   └── pokemon-form.tsx    # Main form component
├── lib/
│   ├── actions/
│   │   └── pokemon.ts      # Server Actions
│   ├── api/
│   │   └── pokeapi.ts      # PokéAPI integration
│   ├── db/
│   │   ├── index.ts        # Database connection
│   │   └── schema.ts       # Drizzle schema
│   └── validations/
│       └── pokemon.ts      # Zod schemas
└── drizzle.config.ts       # Drizzle Kit config
```

## 🔥 Key Technical Highlights

### Accent-Insensitive Search
```typescript
const normalizeString = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};
```

### Smart Move Separation
The Combobox automatically separates learned moves from other moves with a visual divider, making it easy to distinguish what the Pokémon can naturally learn.

### Random Move Generation
Random moves are instantly generated when selected, with a reroll button (🎲) to try different options until you find the perfect move.

### French Language Support
All Pokémon and move names are fetched in French from PokéAPI with automatic fallback to English if translations are unavailable.

## 📊 Database Schema

```typescript
export const createdPokemons = pgTable("created_pokemons", {
  id: serial("id").primaryKey(),
  pokemonId: integer("pokemon_id").notNull(),
  pokemonName: varchar("pokemon_name", { length: 100 }).notNull(),
  pokemonNameFr: varchar("pokemon_name_fr", { length: 100 }),
  nickname: varchar("nickname", { length: 100 }),
  gender: varchar("gender", { length: 20 }).notNull(),
  isShiny: boolean("is_shiny").notNull().default(false),
  moves: jsonb("moves").notNull(),
  creatorName: varchar("creator_name", { length: 100 }).notNull(),
  spriteUrl: varchar("sprite_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});
```

## 🎨 Design Principles

- **User-first**: Every interaction is designed to be intuitive and efficient
- **Type-safe**: Full TypeScript coverage with strict mode
- **Performance**: Aggressive caching and static generation where possible
- **Accessibility**: Using Shadcn/UI components built on Radix UI primitives
- **Modern**: Latest versions of all technologies (Next.js 16, Tailwind v4, Zod v4)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **[PokéAPI](https://pokeapi.co/)** - For providing comprehensive Pokémon data
- **[Neon](https://neon.tech/)** - For serverless PostgreSQL hosting
- **[Vercel](https://vercel.com/)** - For Next.js and deployment platform
- **[Shadcn](https://ui.shadcn.com/)** - For beautiful, accessible components

---

<div align="center">

**Built with ❤️ for the Pokémon community**

[Report Bug](../../issues) · [Request Feature](../../issues)

</div>
