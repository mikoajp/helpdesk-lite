# Helpdesk Lite – Ownership & Roadmap

## Priorytety (TIERY)
TIER 1 – Krytyczne:
- Komentarze (tabela ticket_comments: ticket_id, user_id, comment, is_internal, created_at)
- Załączniki (ticket_attachments: ticket_id, filename, path, mime_type, size, uploaded_by)
- SLA (pola: sla_response_due, sla_resolution_due, sla_breached; reguły wg priorytetu; eskalacja gdy zbliża się deadline)
- Powiadomienia (email + badge in‑app: nowy ticket, zmiana statusu, nowy komentarz)
- Wyszukiwanie: full‑text (title, description), filtrowanie kombinacyjne, zakres dat
- Paginacja (zamiast stałego limit(50))

TIER 2 – Ważne (podnosi produktywność i widoczność):
- Dashboardy: reporter / agent / admin – metryki (SLA compliance, średni czas odpowiedzi, rozwiązań, trend 30 dni)
- Auto‑assignment (round‑robin, load‑based, skill/tag‑based)
- Timeline aktywności (komentarze, zmiany statusu, załączniki w kolejności czasu)
- Saved filters (ulubione widoki)
- Rich text / markdown dla opisów i komentarzy
- Kanban (status drag & drop + szybkie akcje)

TIER 3 – Nice‑to‑Have (profesjonalny polish / skalowanie):
- Workflow automation (reguły IF/THEN)
- AI: sugerowany assignee, tagi, duplikaty, auto‑kategoryzacja
- Templates & Makra (FAQ odpowiedzi, „Request more info”)
- Knowledge Base (pre‑ticket sugestie → redukcja obciążenia 20–40%)
- Integracje: Email ingest → ticket, Slack/Teams, GitHub/Jira linking, Webhooks (outbound)

## Plan Działań (fazowanie)
Faza 1 (4–6h) – Minimum Viable Helpdesk:
1. ticket_comments + API (CRUD ograniczone: create/list; delete tylko admin)
2. ticket_attachments upload (limit rozmiaru, MIME whitelist) + wyświetlanie
3. SLA kalkulator (obsługa przy create/update + komenda artisan do recalculacji + cron/queue)
4. Email notifications (Mailable + queue) – minimalne szablony
5. Paginacja + parametry page, per_page
6. Full‑text search (Postgres tsvector lub MySQL FULLTEXT; fallback LIKE w SQLite)

Faza 2 (6–8h):
1. Dashboard + endpointy agregujące (stateless cache ttl=60s)
2. Timeline endpoint /tickets/{id}/timeline (zunifikowane eventy)
3. Auto‑assignment Strategy pattern
4. Saved filters (user_saved_filters tabela)
5. Rich text (markdown + sanitacja XSS) + konwersja do HTML przy renderze
6. Kanban view + PATCH /tickets/{id}/status (lightweight)

Faza 3 (opcjonalna):
1. Knowledge Base (articles + search + pre‑create suggestions)
2. Workflow rules (DB + evaluator + scheduler)
3. AI duplicate detection (embedding lub proste TF‑IDF / trigram similarity)
4. Email ingestion (IMAP/POP3 parser → ticket)
5. Webhooks (outbound events: ticket.created, ticket.status.changed, ticket.comment.added)

## Modele Danych (dodatki)
Ticket (rozszerzenia): sla_response_due, sla_resolution_due, sla_breached:boolean.
TicketComment: id, ticket_id, user_id, comment(text), is_internal:boolean, created_at.
TicketAttachment: id, ticket_id, filename, path, mime_type, size:int, uploaded_by, created_at.
SavedFilter: id, user_id, name, criteria (json), created_at.
WorkflowRule (TIER3): id, name, condition(json), action(json), active:boolean.

## Logika SLA (reguły)
critical: response 1h, resolution 8h
high: response 4h, resolution 24h
medium: response 8h, resolution 48h
Eskalacja: gdy pozostało <20% czasu do response_due → auto priority bump (medium→high, high→critical opcjonalnie) + powiadomienie.
Recalculation triggers: priority/status change.

## Właściciele / RACI
- Product (Owner): definicja TIERów, akceptacja roadmapy.
- Engineering Backend: modele, migracje, SLA engine, notyfikacje, search, workflow.
- Engineering Frontend: UX, timeline, kanban, dashboard, performance, accessibility.
- QA: testy SLA edge cases, upload security, XSS sanitacja.
- DevOps: monitoring, alerty (SLA breach → log + e-mail), backupy załączników.

## Mierniki Sukcesu (KPI)
- Średni czas pierwszej odpowiedzi (MTTA)
- Średni czas rozwiązania (MTTR)
- SLA compliance % (odpowiedź / rozwiązanie osobno)
- Liczba eskalacji / dzień
- % ticketów z załącznikiem (cel >70%)
- Udział ticketów rozwiązanych bez komentarza (cel <10%)
- Redukcja duplikatów po wprowadzeniu AI (%)

## Standardy Techniczne (dla nowych funkcji)
Backend:
- FormRequest dla każdego mutującego endpointu
- Policy: authorize przed logiką biznesową
- API Resources: spójny kształt odpowiedzi
- Testy: min. 1 unit + 1 integration per feature TIER1
- Audyt: log info przy SLA breach / auto‑assignment
Frontend:
- Komponenty: stany loading/empty/error
- Dostępność: aria-live dla powiadomień, focus management w modals
- Dark/Light: tokeny koloru nie inline
- Timeline: wirtualizacja jeśli > 100 eventów
Security:
- Sanitacja markdown (allowlist) + ograniczenie rozmiaru upload (np. 5MB)
- Rate limit na komentowanie (np. 30/min per user)
Observability:
- Structured logging (JSON) dla eventów krytycznych
- Health endpoint /ping + /metrics (opcjonalnie Prometheus)

## Ryzyka & Mitigacje
- Brak SLA → chaos priorytetów → szybkie wdrożenie minimalnych pól + cron recalculation.
- Wzrost liczby duplikatów → wprowadzenie prostego similarity early (trigram w DB) zanim AI embedding.
- Przepełnienie storage załączników → limit rozmiaru + cykliczny cleanup sierot.
- Spam komentarzy → rate limit + captcha (opcjonalnie) przy anonimowych kanałach email.

## Roadmap Decyzji (ADR skróty do utworzenia)
1. Wybór DB pełnotekstowego mechanizmu (Postgres vs MySQL vs fallback).
2. Strategia auto‑assignment (kolejność implementacji: RoundRobin → Load → Skill).
3. Format timeline events (unifikacja payloadu).
4. SLA kalkulacja w momencie create vs job (wybór: on-write + job jako korektor).
5. Workflow engine – JSON rule format (condition, action, priority, enabled).

## Następne Kroki (konkret wykonania TIER1)
1. Migracje: ticket_comments, ticket_attachments, rozszerzenie tickets (SLA fields)
2. Serwisy: SlaCalculatorService, AttachmentStorageService, NotificationService
3. Endpointy: POST /tickets/{id}/comments, GET /tickets/{id}/comments; POST /tickets/{id}/attachments (multipart); GET /search?query=...
4. Cron/Task: artisan command sla:recalculate + schedule co 5 min
5. Powiadomienia: Mailable + event listeners (TicketCreated, TicketStatusChanged, TicketCommentAdded)
6. Paginacja: standard meta { page, per_page, total, last_page }
7. Dokumentacja README rozszerzyć o sekcję SLA i Komentarze.

## Kryterium "Gotowe" dla TIER1
- Komentarze: dodanie, listowanie, widoczność is_internal tylko dla agent/admin
- Załączniki: upload + pobranie + walidacja MIME + limit size
- SLA: pola w JSON + persystentna kalkulacja + oznaczenie sla_breached
- Powiadomienia: email + badge (liczba nieprzeczytanych komentarzy/status zmian)
- Search: wyniki z rankingiem (title hit > description hit)
- Paginacja: żadnych twardych limitów bez offsetu

## Skrót TL;DR
Najpierw Komunikacja (komentarze) + Dowody (załączniki) + Priorytetyzacja (SLA). Potem Wgląd (dashboard, timeline). Na końcu Automatyzacja i AI. Bez TIER1 nie ma sensu dodawać polish.

---
Ostatnia aktualizacja: 2025-11-15
