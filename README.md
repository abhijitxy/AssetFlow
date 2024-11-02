# AssetFlow

A web application for managing and transferring digital assets.

## Tech Stack

- [Next.js](https://nextjs.org)
- [tRPC](https://trpc.io)
- [Drizzle](https://orm.drizzle.team)
- [NextAuth.js](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Bun](https://bun.sh)
- [Shadcn UI](https://ui.shadcn.com)

## Prerequisites

- [Bun](https://bun.sh) 1.0+

## Installation

1. Clone the repository:
```bash
git clone git@github.com:abhijitxy/AssetFlow.git
cd AssetFlow
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your `.env` file with the following:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/assetflow"

# Next Auth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (if using)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

4. Initialize the database:
```bash
bunx drizzle-kit generate
bunx drizzle-kit push
```

## Development

Run the development server:
```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production

Build and start the production server:
```bash
bun run build
bun run start
```
