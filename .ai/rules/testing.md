# Testing Conventions

## General
- This project does not currently have a test suite
- When adding tests, use Vitest + React Testing Library
- Place test files alongside source files with `.test.jsx` suffix
- Focus on component rendering and accessibility

## Guidelines
- Test that sections render correctly
- Test responsive behavior where applicable
- Mock Framer Motion animations in tests to avoid timing issues
- Snapshot tests can be useful for catching unintended layout changes
