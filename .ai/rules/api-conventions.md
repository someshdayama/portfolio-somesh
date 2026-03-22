# API Conventions

## General
- This is a static portfolio site — no backend API currently
- If external data sources are added in the future, follow these patterns:
  - All API calls in a dedicated `src/api/` directory
  - Use `try/catch` with graceful error handling
  - Show meaningful loading and error states
  - Never expose credentials in client-side code
