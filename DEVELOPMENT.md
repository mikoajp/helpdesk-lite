# Development Guide

## Conventions

### Git Workflow
- **Branches**: `feature/`, `fix/`, `chore/`, `docs/`
- **Commits**: Follow Conventional Commits:
  - `feat:` new features
  - `fix:` bug fixes
  - `docs:` documentation changes
  - `chore:` maintenance tasks
  - `test:` adding/updating tests
  - `refactor:` code refactoring

### Code Style
- **Frontend**: Prettier + ESLint (Angular style guide)
- **Backend**: Laravel Pint (PSR-12)

## Quick Start Scripts

### Backend
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm start
```

### Storybook
```bash
cd frontend
npm run storybook
```

### Docker
```bash
docker-compose up -d
```

## Definition of Done (DoD)

- [ ] Feature works end-to-end
- [ ] API contracts are stable and documented
- [ ] Tests pass (unit + integration)
- [ ] Code follows conventions
- [ ] README updated if needed
- [ ] No console errors in browser
- [ ] Responsive on mobile + desktop
- [ ] Loading and error states handled
