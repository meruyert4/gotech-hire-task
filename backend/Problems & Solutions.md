# Encountered problems and solutions:

1. **Structure**
**Problem:** The backend lacked a module structure; everything was registered in a single flat module causing poor separation of concerns.
**Solution:** Refactored the backend into separate feature modules (Auth, Users, Rooms, Chat) to separate concerns properly.

2. **Validation**
**Problem:** Data Transfer Objects (DTOs) were defined but never enforced.
**Solution:** Implemented a global `ValidationPipe` in `main.ts` to automatically validate and enforce DTOs on all incoming requests.

3. **Security**
**Problem:** Passwords were hashed using a cryptographically broken algorithm.
**Solution:** Replaced the weak hashing logic with `bcrypt` for secure password hashing.

4. **Security**
**Problem:** Sensitive configuration values (like JWT secrets and DB credentials) were hardcoded directly in the source code.
**Solution:** Migrated all hardcoded secrets to a `.env` file and integrated `@nestjs/config` for secure environment variable management.

5. **Security**
**Problem:** API endpoints were public and exposed sensitive user data.
**Solution:** Excluded the password field from the User entity using `@Exclude()` and secured routes using `passport-jwt` authentication guards.

6. **Database Optimization**
**Problem:** Retrieving messages resulted in N+1 database queries to fetch associated user data.
**Solution:** Optimized the query in the Chat service by using TypeORM's `relations: ['user']` to fetch everything in a single `LEFT JOIN`.

7. **Database Optimization**
**Problem:** Frequently queried foreign keys caused slow database lookups.
**Solution:** Added `@Index()` decorators to the `roomId` and `userId` columns in the Message entity to speed up database queries.

8. **Database Optimization**
**Problem:** Message history lacked pagination, loading all messages at once and causing memory bloat.
**Solution:** Implemented `limit` and `offset` pagination logic in the Chat controller and service endpoints.