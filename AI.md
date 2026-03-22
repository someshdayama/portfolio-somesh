# Portfolio — Somesh Dayama

> A premium, heavily-animated personal portfolio website showcasing professional identity as a strategic problem solver.

## Tech Stack

- **Framework**: Vite + React 19
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge
- **Language**: JavaScript (JSX)
- **Styling**: Vanilla CSS (with utility helpers via tailwind-merge)

## Project Structure

```
src/
├── App.jsx          # Main app with section composition
├── main.jsx         # Entry point
├── index.css        # Global styles & design tokens
├── assets/          # Static assets (images, etc.)
└── components/      # UI components (Hero, About, Skills, Experience, etc.)
```

## Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check
```

## Conventions

- Premium, "mindblowing" UI aesthetic is a core requirement
- Heavy use of Framer Motion for scroll reveals, hover effects, and section transitions
- Custom cursor, magnetic hover interactions, 3D perspective effects
- Bento grid layout for skills section
- Mobile-first responsive design
- Components are `.jsx` files in `src/components/`
- Use `clsx` and `tailwind-merge` for conditional class composition
- Professional identity focus: strategic problem solver, not just cloud engineer
