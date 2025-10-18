# AIgent10X
AIgent10X is a next-generation marketplace for AI agents - a platform where users can discover, test, and deploy intelligent agents that automate real-world tasks. The application is built with Next.js 15, TypeScript, Clerk, Stripe, and Tailwind-powered UI primitives tuned for mobile-first experiences.

## Features
- Marketplace browse and detail pages for featured agents
- Creator submission wizard for proposing new agents
- Admin moderation dashboard for reviewing submissions
- Stripe webhook stub and Clerk authentication scaffolding

## Getting Started
Install dependencies and launch the dev server:

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in your browser. Edits to files inside `src/app` trigger fast refresh.

## Scripts
- `npm run dev` - start the Next.js development server
- `npm run build` - create an optimized production build
- `npm run start` - serve the production build
- `npm run lint` - run ESLint checks

## Learn More
- Next.js docs: https://nextjs.org/docs
- Clerk docs: https://clerk.com/docs
- Stripe docs: https://stripe.com/docs

## Deployment
Deploy with Vercel or your preferred hosting provider. When using Vercel, connect the repository and configure the required environment variables for Clerk and Stripe.
