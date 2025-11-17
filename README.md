Helpdesk Lite – Plan i dokumentacja startowa

Cel
- Zbudować MVP aplikacji Helpdesk Lite: zgłaszanie, przeglądanie i triage ticketów.
- Backend: Laravel 10/11 (PHP 8.2+), REST + autoryzacja (Sanctum/JWT).
- Frontend: Angular 16+, Material (design system) + Storybook. Integracja z LLM (mock) i jednym publicznym API (ExchangeRate.host).

Fazy realizacji (MVP, 6–8h)
0) Przygotowanie repo i środowiska
- Inicjalizacja repo, pliki: .editorconfig, .gitignore, LICENSE (opcjonalnie), .env.example (backend, frontend), README (ten plik).
- Uzgodnienie konwencji commitów/branchy, skryptów uruchomieniowych i Docker Compose.
Kryteria akceptacji: Repo z podstawową strukturą i checklistą DoD.

1) Backend skeleton (Laravel) + autoryzacja i modele
- Nowy projekt Laravel, konfiguracja Sanctum (lub JWT), migracje i seedy: Role (admin, agent, reporter), Users (3 szt.), Tickets (kilka szt.), TicketStatusChanges.
- Pola Ticket: id, title, description, priority [low|medium|high], status [open|in_progress|resolved|closed], assignee_id (nullable), tags (json array), created_at, updated_at.
- Polityki dostępu: reporter widzi tylko swoje; agent/admin widzą wszystkie.
Kryteria: uruchomiony serwer, /health lub /api/ping, użytkownicy i role w seedach.

2) Tickets API (CRUD + filtrowanie + historia statusu)
- Endpointy: GET /tickets (filtrowanie), GET /tickets/{id}, POST /tickets, PUT /tickets/{id}, DELETE /tickets/{id} (opcjonalnie soft delete), GET /tickets/{id}/status-changes.
- Zdarzenie zapisu statusu do TicketStatusChanges przy create/update (gdy status się zmienia).
- Testy: min. 2 integracyjne (lista z filtrami, update ze zmianą statusu), 2 jednostkowe (walidacje/serwisy).
Kryteria: kontrakty JSON stabilne, testy przechodzą, autoryzacja działa wg ról.

3) Integracja z API zewnętrznym + cache
- Wybrać ExchangeRate.host (brak klucza). Endpoint backendu: GET /external-data?base=USD&symbols=EUR,PLN.
- Obsługa sukces/błąd (timeout, 5xx, brak danych) + prosty cache (Redis lub file) na 5 min + fallback (ostatni udany wynik).
- Testy: 1 integracyjny (mock HTTP: sukces), 1 integracyjny (mock HTTP: błąd + fallback).
Kryteria: przewidywalne odpowiedzi, logowanie błędów, cache działa.

4) Triage Asystent (LLM, mock)
- Endpoint: POST /tickets/{id}/triage-suggest – input: ticketId; output: suggested_priority, suggested_status, summary, confidence.
- Implementacja mock: deterministyczne reguły + opcjonalnie wywołanie do LLM (za flagą), z timeboxem/timeoutem i sanitacją.
- Zapis wyboru użytkownika: Accept/Reject (na froncie), backend nic nie zmienia bez akceptacji.
Kryteria: stabilne API, scenariusz demo działa.

5) Frontend skeleton (Angular) + routing + stan
- Aplikacja Angular: core, shared, features/tickets, auth (fake login lub real via Sanctum), guards.
- Integracja Angular Material + globalne theming (light/dark) + responsywność podstawowa.
- Ekrany: Login, Tickets List (filtrowanie), Ticket Detail (historia statusów, external-data), Ticket Form (create/edit).
Kryteria: nawigacja działa, auth flow, loading i error states.

6) Design System + Storybook
- Konfiguracja Storybook (npm run storybook; build-storybook). Globalny theming (tokeny kolorów, spacing, radius, typografia).
- Własne komponenty: PriorityBadge, TicketCard, TriageSuggestionPanel. Każdy: min. 3 stany (default/loading/error), Controls, Docs, light/dark.
Kryteria: komponenty widoczne w Storybooku, spójne tokeny, użycie w appce.

7) Integracje front-back
- Podpięcie do Tickets API, triage-suggest, external-data. Filtrowanie na liście, tagi, priorytety, statusy, assign.
- Akcept/Reject triage na froncie (bezpośrednia zmiana pól po akceptacji).
Kryteria: podstawowe ścieżki użytkownika end-to-end.

8) Testy + Docker Compose + finalizacja
- Backend: min. 3 unit + 2 integracyjne (łącznie z integracją zewnętrzną). Front: kilka testów komponentów (opcjonalnie w timeboxie) + manual checklist.
- Docker Compose: backend, frontend, db (Postgres/MySQL/SQLite), redis (jeśli użyty cache), reverse-proxy (opcjonalnie).
- README uzupełnione: LLM Flow, uruchomienie, decyzje architektoniczne, zrzuty ekranów, link do screencastu.
Kryteria: docker up uruchamia całość; dokumentacja kompletna.

Architektura (skrót)
- Encje: User (id, name, email, role), Role (name), Ticket, TicketStatusChange.
- Relacje: User 1..* Ticket (reporter), User 1..* Ticket (assignee, nullable), Ticket 1..* TicketStatusChange.
- Enums: priority: low/medium/high; status: open/in_progress/resolved/closed.
- Bezpieczeństwo: Laravel Sanctum (SPA), polityki per rola.
- Cache: Redis (preferowane) lub file. HTTP klient: Laravel Http Facade z retry/timeout.

Kontrakty API (propozycja)
Auth
- POST /auth/login { email, password } → { token, user: { id, name, role } }
- POST /auth/logout → 204

Tickets
- GET /tickets?status=open&priority=high&assignee=ID&tag=foo → { data: Ticket[], meta: { ... } }
- GET /tickets/{id} → Ticket + { status_changes: [] }
- POST /tickets { title, description, priority, assignee_id, tags[] } → 201 Ticket
- PUT /tickets/{id} { title?, description?, priority?, status?, assignee_id?, tags? } → 200 Ticket
- DELETE /tickets/{id} → 204 (opcjonalnie)
- GET /tickets/{id}/status-changes → { data: [...] }

Triage
- POST /tickets/{id}/triage-suggest → { suggested_priority, suggested_status, summary, confidence }

External data (ExchangeRate.host)
- GET /external-data?base=USD&symbols=EUR,PLN → { base, date, rates: { EUR: 0.9, PLN: 4.0 } } lub { error: { code, message } }

Model Ticket (JSON)
{
  "id": 1,
  "title": "Cannot login",
  "description": "Error 500 on login",
  "priority": "high",
  "status": "open",
  "assignee_id": 2,
  "tags": ["auth", "urgent"],
  "reporter_id": 3,
  "created_at": "2025-11-14T10:00:00Z",
  "updated_at": "2025-11-14T10:05:00Z"
}

Obsługa błędów (spójna)
- 400 validation_error: { errors: { field: [msg] } }
- 401 unauthorized, 403 forbidden, 404 not_found, 408/504 timeout, 500 internal_error.

Projekt frontendu (skrót)
- Moduły: core (auth, http, interceptors), shared (ui, design tokens), features/tickets, features/auth.
- Stan: signals lub lekki store (np. RxJS signals); HTTP serwisy: TicketsService, AuthService, IntegrationService.
- Widoki: Login, TicketsList, TicketDetail, TicketForm. Komponenty DS: PriorityBadge, TicketCard, TriageSuggestionPanel.
- UX: loading spinners, toasty błędów, formularze reaktywne, responsywność (breakpointy Material), light/dark (tokens).

Storybook i Design System
- Tokeny: colors (primary, surface, bg, text), spacing (4/8/16/24), radius (4/8), typography (scale).
- Skrypty: npm run storybook, npm run build-storybook. Controls + Docs na propsach.
- Stany komponentów: default/loading/error + warianty priorytetu/statusu. Zgodność z light/dark.

Testy (plan minimalny)
- Backend unit: walidacja TicketRequest; serwis triage (mock); helper cache.
- Backend integration: Tickets list z filtrami i auth; external-data sukces/błąd z fallbackiem.
- Frontend (opcjonalnie): PriorityBadge renders by priority; Triage panel actions emit.
- Manual E2E: scenariusze CRUD, triage accept/reject, external-data error/success.

Docker Compose (zarys)
services:
  backend:
    build: ./backend
    env_file: backend/.env
    ports: ["8000:8000"]
    depends_on: [db, redis]
  frontend:
    build: ./frontend
    env_file: frontend/.env
    ports: ["4200:4200"]
    depends_on: [backend]
  db:
    image: postgres:16
    environment: { POSTGRES_DB: helpdesk, POSTGRES_USER: app, POSTGRES_PASSWORD: app }
    ports: ["5432:5432"]
  redis:
    image: redis:7

Konfiguracja i uruchomienie (skrót)
Backend
- cd backend; cp .env.example .env; php artisan key:generate; php artisan migrate --seed
- php artisan serve (lub php artisan serve --host=0.0.0.0 --port=8000 w Docker)

Frontend
- cd frontend; cp .env.example .env; npm install; npm start (ng serve)
- Storybook: npm run storybook; build: npm run build-storybook

Zmienne środowiskowe (przykład)
- backend/.env.example: APP_KEY=..., APP_URL=http://localhost:8000, DB_* (zgodnie z compose), CACHE_DRIVER=redis, EXTERNAL_API_BASE=https://api.exchangerate.host
- frontend/.env.example: NG_APP_API_URL=http://localhost:8000/api, NG_APP_THEME=light

LLM Flow (wymagane artefakty)
- Strategie promptów: plan → kontrakty → implementacja → testy; proś o przykłady, waliduj wyniki, iteruj małymi krokami.
- Przykładowe prompty: „Zaprojektuj migracje dla Ticket i TicketStatusChange wg pól…”, „Napisz test integracyjny dla endpointu /external-data (sukces i błąd)…”, „Przerób komponent na signals i dodaj stany loading/error”.
- Walidacja: uruchamiaj testy, sprawdzaj kontrakty, ograniczaj halucynacje przez podawanie kontekstu i przykładowych payloadów.
- Screencast 5–8 min: pokaż pracę z LLM (projekt → kod → test → poprawki).

Deliverables checklist
- Repo + Docker Compose działające (backend, frontend, db, redis).
- .env.example (backend, frontend) + README + LLM Flow + decyzje.
- Endpointy: tickets CRUD, triage-suggest, external-data (cache+fallback, sukces/błąd).
- Storybook (2–3 komponenty, theming, Controls/Docs) + opcjonalny hosting.
- Testy: ≥3 unit + ≥2 integration (backend) + kilka front unit (opcjonalnie) + manual E2E.
- 2–3 zrzuty ekranu + link do screencastu.

Harmonogram (orientacyjny w 6–8h)
- 0.5h: skeletony + repo + env.
- 2h: backend (modele, migracje, seedy, tickets CRUD, status history, testy podstawowe).
- 1h: external-data + cache + testy.
- 1h: triage mock + endpoint + test unit.
- 1.5–2h: frontend (routing, list/detail/form, integracje API, stany UI).
- 0.5–1h: Storybook + komponenty DS.
- 0.5h: Docker Compose + README + porządki.

Definition of Done
- Ścieżki użytkownika działają end‑to‑end; kontrakty API stabilne; testy przechodzą; docker up startuje system; Storybook pokazuje komponenty w 3 stanach; README kompletne.

Konwencje repo
- Branch: feature/…, fix/…, chore/…; Commity: Conventional Commits (feat:, fix:, docs:, chore:, test:). Code style: Prettier/ESLint (front), Pint/PHPCS (opcjonalnie back – poza timeboxem).

## Status Realizacji

### ✅ Faza 0: Przygotowanie repo i środowiska
- Inicjalizacja repo z .editorconfig, .gitignore, LICENSE, .env.example
- Docker Compose z konfiguracją dla backend, frontend, db, redis

### ✅ Faza 1: Backend skeleton (Laravel) + autoryzacja i modele
- Projekt Laravel 11 z konfiguracją Sanctum
- Migracje i seedy dla Role, Users, Tickets, TicketStatusChanges
- Polityki dostępu wg ról (reporter/agent/admin)

### ✅ Faza 2: Tickets API (CRUD + filtrowanie + historia statusu)
- Endpointy CRUD dla ticketów z filtrowaniem
- Automatyczne logowanie zmian statusu
- Testy integracyjne i jednostkowe

### ✅ Faza 3: Integracja z API zewnętrznym + cache
- Endpoint GET /external-data z integracją ExchangeRate.host
- Cache Redis z fallbackiem
- Obsługa sukcesu/błędu z timeoutem

### ✅ Faza 4: Triage Asystent (LLM, mock)
- Endpoint POST /tickets/{id}/triage-suggest
- Mock z deterministycznymi regułami
- Możliwość Accept/Reject sugestii

### ✅ Faza 5: Frontend skeleton (Angular) + routing + stan
- Aplikacja Angular 17 ze strukturą modularną
- Core (auth, guards, interceptors, services)
- Shared (komponenty współdzielone)
- Features (auth, tickets)
- Angular Material z responsive design
- Signals do zarządzania stanem
- Routing z guard'ami
- Komponenty:
  - LoginComponent - logowanie z demo credentials
  - TicketListComponent - lista ticketów z filtrowaniem
  - TicketDetailComponent - szczegóły ticketu z historią statusów, triage assistant, external data
  - TicketFormComponent - formularz tworzenia/edycji ticketu
  - HeaderComponent - nawigacja z user menu

### 🔄 Faza 6: Design System + Storybook
- TODO: Konfiguracja Storybook
- TODO: Komponenty PriorityBadge, TicketCard, TriageSuggestionPanel
- TODO: Globalne tokeny (colors, spacing, radius, typography)

### 🔄 Faza 7: Integracje front-back
- TODO: End-to-end testy podstawowych ścieżek
- TODO: Finalne połączenie wszystkich funkcjonalności

### 🔄 Faza 8: Testy + Docker Compose + finalizacja
- TODO: Kompletny zestaw testów
- TODO: Finalizacja Docker Compose
- TODO: Dokumentacja kompletna z screencastem