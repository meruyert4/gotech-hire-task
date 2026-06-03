# Encountered problems and solutions (Frontend):

1. **Architecture (State Management)**
**Problem:** API requests were handled with manual fetch functions (like `handleCreateRoom`, `handleLogin`) spread across individual UI components, leading to duplicated code and hard-to-manage local state.
**Solution:** Migrated all API calls to Redux Toolkit Query (`RTK Query`) and separated them into a dedicated `api.ts` slice, centralizing data fetching, caching, and state management.

2. **Architecture (Routing)**
**Problem:** Incorrect routing configuration in `App.tsx` caused an infinite rendering loop warning (`Maximum update depth exceeded`) due to improper state updates during renders.
**Solution:** Refactored routing in `App.tsx` using `react-router-dom`'s `<Navigate>` components inside `<Routes>` to properly manage authenticated vs unauthenticated route redirects.

3. **Security (Token Storage)**
**Problem:** Authentication tokens were manually extracted and stored in `localStorage`, which exposes the application to Cross-Site Scripting (XSS) token theft.
**Solution:** Reconfigured the frontend API and Socket.io client to use `credentials: 'include'` and `withCredentials: true`, completely removing manual token handling and relying on secure backend `HttpOnly` cookies.

4. **Code Quality (Naming Conventions)**
**Problem:** The codebase had an inconsistent mix of `snake_case` (e.g. `user_id`) and `camelCase` variable names.
**Solution:** Refactored the entire frontend codebase to strictly adhere to standard JavaScript `camelCase` naming conventions.

5. **Code Quality (Legacy Components)**
**Problem:** The `Header` component was written as an outdated legacy Class component (`Header.class.tsx`) featuring hardcoded magic numbers.
**Solution:** Refactored the `Header` into a modern Functional component using standard React hooks and clean property destructuring.

6. **Styling Architecture**
**Problem:** UI components used excessive inline styles (`style={{...}}`), making the JSX files bloated and the styling difficult to maintain or reuse.
**Solution:** Extracted all inline styles into a centralized global CSS stylesheet (`index.css`) and mapped them back to the React components using semantic `className` attributes.

7. **Type Safety**
**Problem:** The codebase heavily relied on `any` types, bypassing TypeScript's static analysis and masking potential runtime errors.
**Solution:** Purged all `any` types by defining strict interfaces (`Room`, `Message`), properly typing catch blocks, and enabling the `@typescript-eslint/no-explicit-any` ESLint rule as an error to prevent future violations.

