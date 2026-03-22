# Code Style Rules

## JavaScript / JSX
- Use functional components with hooks (no class components)
- Destructure props in function parameters
- Use `const` by default, `let` only when reassignment is needed
- Use arrow functions for component definitions and callbacks
- Prefer optional chaining (`?.`) and nullish coalescing (`??`)

## Naming
- **Components**: PascalCase (e.g., `HeroSection`, `SkillsBento`)
- **Files**: Match the component name (e.g., `HeroSection.jsx`)
- **Functions/variables**: camelCase
- **CSS classes**: kebab-case or BEM
- **Constants**: UPPER_SNAKE_CASE
- **Framer Motion variants**: camelCase objects (e.g., `fadeInUp`, `staggerContainer`)

## CSS
- Use CSS custom properties (variables) for theming
- Mobile-first responsive design
- Premium aesthetic: glassmorphism, gradients, glow effects
- Smooth, performant transitions using `transform` and `opacity`
- Use `will-change` sparingly for heavy animations

## Animations (Framer Motion)
- Define animation variants as named objects outside components
- Use `whileInView` with `viewport={{ once: true }}` for scroll reveals
- Stagger children animations for lists/grids
- Keep animations under 0.6s for snappy feel
- Use `layoutId` for shared layout animations

## Imports
- Group imports: React → Framer Motion → third-party → local components → styles
