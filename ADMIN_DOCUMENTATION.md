# Porttivo Admin Panel — Complete Documentation

> Production-grade logistics admin panel for cargo shipments, container transport, fleet tracking, and trip management. This document covers **UI**, **UX**, and **functionality** in full detail.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Design System (UI)](#4-design-system-ui)
5. [User Experience (UX)](#5-user-experience-ux)
6. [Layout & Navigation](#6-layout--navigation)
7. [Pages & Functionality](#7-pages--functionality)
8. [Shared Components](#8-shared-components)
9. [Services](#9-services)
10. [Authentication & Authorization](#10-authentication--authorization)
11. [API Integration](#11-api-integration)
12. [Routing](#12-routing)
13. [State Management](#13-state-management)
14. [Environment & Configuration](#14-environment--configuration)
15. [Running the Application](#15-running-the-application)

---

## 1. Overview

The Porttivo Admin Panel is a web-based management interface for logistics operations. It enables administrators to:

- Monitor platform metrics via a **Dashboard**
- Manage **users** (transporters, drivers, pump owners, pump staff, company users)
- Track and manage **shipments / trips** with real-time updates
- Manage **vehicles** and fleet documentation
- Handle **fuel** transactions, fuel cards, settlements, and fraud detection
- View **analytics**, **audit logs**, and send **notifications**
- Manage **customers**

The app uses **Angular 20**, **Ionic 8**, and **Chart.js** (ng2-charts), with a hybrid bootstrap (NgModule + standalone components). It supports **dark mode** via `prefers-color-scheme`.

---

## 2. Technology Stack

| Technology       | Purpose                                |
|------------------|----------------------------------------|
| **Angular 20**   | Application framework                  |
| **Ionic 8**      | UI components, mobile-ready layout     |
| **RxJS 7**       | Reactive streams                       |
| **Chart.js**     | Dashboard charts (via ng2-charts)      |
| **Socket.IO**    | Real-time trip updates                 |
| **Capacitor 8**  | Optional native mobile builds          |
| **SCSS**         | Styling                                |
| **TypeScript**   | Type-safe development                  |

---

## 3. Project Structure

```
Porttivo-Admin/
├── angular.json
├── capacitor.config.ts
├── package.json
├── src/
│   ├── main.ts
│   ├── index.html
│   ├── polyfills.ts
│   ├── global.scss
│   ├── theme/
│   │   └── variables.scss
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── assets/
│   └── app/
│       ├── app.module.ts
│       ├── app.component.ts
│       ├── app-routing.module.ts
│       ├── layouts/
│       │   └── admin-layout/
│       ├── components/
│       │   └── menu/                    # Legacy, not in use
│       ├── guards/
│       │   ├── auth.guard.ts
│       │   └── permission.guard.ts
│       ├── interceptors/
│       │   └── auth.interceptor.ts
│       ├── models/
│       │   ├── admin.model.ts
│       │   ├── dashboard.model.ts
│       │   └── user.model.ts
│       ├── pages/
│       │   ├── login/
│       │   ├── dashboard/
│       │   ├── users/
│       │   ├── trips/
│       │   ├── vehicles/
│       │   ├── fuel/
│       │   ├── settlements/
│       │   ├── fraud/
│       │   ├── fuel-cards/
│       │   ├── analytics/
│       │   ├── customers/
│       │   ├── audit-logs/
│       │   └── notifications/
│       ├── services/
│       │   ├── api.service.ts
│       │   ├── auth.service.ts
│       │   ├── socket.service.ts
│       │   ├── toast.service.ts
│       │   ├── cache.service.ts
│       │   └── google-maps-loader.service.ts
│       └── shared/
│           ├── shared.module.ts
│           └── components/
│               ├── data-table/
│               ├── status-badge/
│               ├── kpi-card/
│               ├── skeleton-loader/
│               ├── empty-state/
│               ├── timeline/
│               └── trip-tracking-map/
├── www/                                  # Build output
└── ADMIN_DOCUMENTATION.md                 # This file
```

---

## 4. Design System (UI)

### 4.1 Color Palette

| Token              | Value       | Usage                          |
|--------------------|-------------|--------------------------------|
| **Primary**        | `#0E2A47`   | Maritime blue — headers, buttons, branding |
| **Accent**         | `#F97316`   | Industrial orange — CTAs, active states     |
| **Background**     | `#F8FAFC`   | Light gray — page background                |
| **Card (light)**   | `#FFFFFF`   | Cards, modals                              |
| **Text primary**   | `#0f172a`   | Headings, body text                         |
| **Text secondary** | `#64748b`   | Muted text                                  |
| **Border**         | `#e2e8f0`   | Borders, dividers                           |

**Dark mode** (automatic via `prefers-color-scheme: dark`):

- Background: `#0B0F19`
- Text: `#f1f5f9`
- Cards: `#1F2937`
- Border: `#334155`

### 4.2 Typography

- **Font family:** Inter, fallback to system fonts  
- **Logo / branding:** Space Grotesk (optional)  
- **Font sizes:** 0.75rem (badges), 0.875rem (secondary text), 1rem (body), 1.5rem (h1), 2rem (login title)

### 4.3 Spacing & Layout

- **Border radius:** 4px (inputs), 8px (cards, buttons), 12px (large elements)  
- **Sidebar:** 260px expanded, 72px collapsed  
- **Page content:** Max-width ~1400px, padding 24px (16px on mobile)  
- **Transitions:** 150ms ease (fast), 200ms ease (sidebar)

### 4.4 Shadow & Elevation

- `--shadow-sm`: 0 1px 2px rgba(0,0,0,0.05)  
- `--shadow-md`: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)

### 4.5 Global Utility Classes

Defined in `global.scss`:

- **`.professional-card`** — Bordered card with light shadow  
- **`.stat-card`** — Stat display with centered value/label  
- **`.professional-table`** — Styled table with hover  
- **`.btn-primary`** / **`.btn-secondary`** — Button styles  
- **`.status-badge`** — Inline status chips (active/inactive/blocked/pending)  
- **`.loading-container`** — Centered loading  
- **`.empty-state`** — Empty list placeholder  
- **`.filter-bar`** — Search + filter row layout  
- **`.stats-grid`** — Responsive grid for KPI cards  
- **`.page-header`** — Page title + subtitle section  

### 4.6 Ionic Overrides

- Ionic color tokens (`--ion-color-primary`, etc.) are overridden to match the maritime/industrial palette.

---

## 5. User Experience (UX)

### 5.1 Navigation Flow

| State              | Behavior                                                              |
|--------------------|-----------------------------------------------------------------------|
| **Unauthenticated**| Any protected route → `AuthGuard` → redirect to `/login`              |
| **Login success**  | `POST /auth/admin-login` → store tokens → Socket.IO connect → `/dashboard` (replaceUrl) |
| **Logout**         | Socket disconnect → AuthService.logout → `window.location.href = '/login'` |
| **Permission denied** | `permissionGuard` blocks route → redirect to `/dashboard`         |
| **Empty route**    | `pathMatch: 'full'` → redirect to `/dashboard`                         |

### 5.2 Forms

- **Login page:** Reactive Forms with `FormBuilder`
  - **Email:** `required`, `email` validators
  - **Password:** `required`, `minLength(6)`
  - Submit gated by `loginForm.valid` and `!isLoading`
- **Other forms:** Ionic inputs with `lines="full"`, stacked labels, inline validation messages.

### 5.3 Feedback Mechanisms

| Mechanism          | Usage                                                                 |
|--------------------|-----------------------------------------------------------------------|
| **LoadingController** | Overlays during login, list loads, trip detail, etc.              |
| **ToastService**   | Success/error/warning/info toasts (top position, ~3s duration)       |
| **SkeletonLoader** | Placeholder rows during async loads (Dashboard, lists)               |
| **EmptyState**     | When no data (e.g. no trips, no activities)                          |
| **StatusBadge**    | Semantic status colors (green/yellow/red/purple) for quick scanning  |
| **AlertController**| Confirmations for destructive actions (cancel trip, block user, etc.)|

### 5.4 Modals

- **UserDetailModalComponent:** Opened via `ModalController` from the Users page. Loads user details by `userType` + `userId` via ApiService.

### 5.5 Real-time UX

- **Trip detail:** Socket.IO `joinTrip(tripId)` and `onTripEvent()` for trip lifecycle updates (status changes, reassignment).  
- **IonRefresher** for manual refresh on trip detail page.

### 5.6 Responsive Behavior

- Sidebar: **Collapsed by default** below 992px; hamburger menu in header toggles visibility.  
- Sidebar can slide in/out on mobile.  
- Role badge hidden on very small screens (<576px).  
- Stats grid uses `repeat(auto-fit, minmax(200px, 1fr))` for fluid layout.

---

## 6. Layout & Navigation

### 6.1 Admin Layout Shell

The `AdminLayoutComponent` provides the main application shell:

```
┌────────────────────────────────────────────────────────────────────┐
│ [Logo P] Porttivo  [◀]  │  [≡]                     admin  role  [↪] │
├──────────────┬─────────────────────────────────────────────────────┤
│ Dashboard    │                                                      │
│ User Mgmt    │                   <router-outlet>                    │
│ Shipments    │                   Page content                       │
│ Fleet        │                                                      │
│ Customers    │                                                      │
│ Fuel         │                                                      │
│ Fuel Cards   │                                                      │
│ Settlements  │                                                      │
│ Fraud        │                                                      │
│ Analytics    │                                                      │
│ Audit Logs   │                                                      │
│ Notifications│                                                      │
└──────────────┴─────────────────────────────────────────────────────┘
```

### 6.2 Sidebar

- **Logo:** "P" icon + "Porttivo" text (hidden when collapsed)  
- **Collapse button:** Chevron icon; toggles 260px ↔ 72px  
- **Nav items:** `routerLink`, `routerLinkActive` for active state  
- **Permission-based visibility:** `canShowItem(item)` hides items when `admin.permissions[permission] === false`  
- **Icons:** Ionicons (grid, people, navigate, car, flash, etc.)  
- **Active state:** Accent color background (`--ion-color-secondary`)  
- **Hover:** Light white overlay  

### 6.3 Top Header

- **Menu toggle:** Visible only on mobile (<992px)  
- **Admin info:** Username + role badge  
- **Logout button:** Icon-only, top-right  

### 6.4 Nav Items (with Permissions)

| Path         | Label           | Icon    | Permission          |
|--------------|-----------------|---------|----------------------|
| `/dashboard` | Dashboard       | grid    | —                    |
| `/users`     | User Management | people  | canManageUsers       |
| `/trips`     | Shipments/Trips | navigate| —                    |
| `/vehicles`  | Fleet           | car     | canManageVehicles    |
| `/customers` | Customers       | person  | —                    |
| `/fuel`      | Fuel            | flash   | canManageFuel        |
| `/fuel-cards`| Fuel Cards      | card    | —                    |
| `/settlements`| Settlements    | cash    | canManageSettlements |
| `/fraud`     | Fraud Detection | shield-check | canManageFraud  |
| `/analytics` | Analytics       | bar-chart | canViewReports     |
| `/audit-logs`| Audit Logs      | document-text | —              |
| `/notifications`| Notifications| notifications | —              |

---

## 7. Pages & Functionality

### 7.1 Login Page (`/login`)

| Aspect        | Detail                                                                 |
|---------------|-----------------------------------------------------------------------|
| **Layout**    | Full-screen, centered card (max-width 400px), no sidebar               |
| **UI**        | Stacked labels, Ionic inputs, block submit button with spinner         |
| **Validation**| Inline errors for invalid email / short password                      |
| **States**    | Loading spinner during login; toast on error; redirect on success    |
| **Redirect**  | Already logged in → `/dashboard`                                      |
| **Dark mode** | Card and background switch to dark palette                            |

### 7.2 Dashboard (`/dashboard`)

| Feature            | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| **Page header**    | "Dashboard" title + subtitle                                               |
| **Date filter**    | Start/End date inputs; triggers stats + chart reload                       |
| **Refresh button** | Reloads stats, chart, and recent activity                                  |
| **KPI cards**      | Transporters, Drivers, Fleet, Trips, Fuel Value, Pump Owners               |
| **Alert KPIs**     | Conditional: Pending Settlements, Fraud Alerts, Expiring Docs (when > 0)    |
| **Trips chart**    | Line chart (Chart.js) — trips vs completed by date                          |
| **Recent activity**| Last 10 audit log entries with action + timestamp + status badge            |
| **Loading**        | Skeleton loader (4 rows)                                                   |
| **Empty state**    | When no stats/data                                                         |

### 7.3 Users (`/users`)

- Tabbed or filtered lists by user type: Transporters, Drivers, Pump Owners, Pump Staff, Company Users  
- DataTable with columns appropriate to user type  
- **UserDetailModal** for viewing/editing a single user  
- Status actions (block/unblock) with confirmation dialogs  
- Permission guard: `canManageUsers`  

### 7.4 Shipments / Trips (`/trips`, `/trips/:id`)

| Feature       | Description                                                                 |
|---------------|-----------------------------------------------------------------------------|
| **List page** | Search input, status select, date range, Apply button                       |
| **DataTable** | tripId, container, reference, transporter, status, date; sortable, paginated |
| **Row links** | Click row → navigate to `/trips/:id`                                        |
| **Detail page**| Map (pickup/drop/driver), timeline, status actions, Socket.IO for live updates |
| **Actions**   | Cancel, reassign, close without POD, status override                        |
| **Permissions**| `canManageTrips` (route guard)                                             |

**Trip status flow:**

```
BOOKED → ACCEPTED → PLANNED → ACTIVE → POD_PENDING → CLOSED_WITH_POD
                                              ↘ CLOSED_WITHOUT_POD
                                        CANCELLED (from any)
```

### 7.5 Vehicles (`/vehicles`)

- Fleet list with vehicle details  
- Expiring documents section  
- Permission: `canManageVehicles`  

### 7.6 Fuel (`/fuel`)

- Fuel transaction list and filters  
- Permission: `canManageFuel`  

### 7.7 Settlements (`/settlements`)

- List of settlements  
- Detail view, calculate, process, complete with UTR  
- Confirmation dialogs for process/complete  

### 7.8 Fraud Detection (`/fraud`)

- Fraud alerts list  
- Flag transaction, resolve actions  
- Stats display  
- Permission: `canManageFraud`  

### 7.9 Fuel Cards (`/fuel-cards`)

- CRUD-style operations for fuel cards  
- Transactions per card  

### 7.10 Analytics (`/analytics`)

- Charts and reports  
- Permission: `canViewReports`  

### 7.11 Customers (`/customers`)

- Customer list, status updates  
- Duplicate detection, merge actions  

### 7.12 Audit Logs (`/audit-logs`)

- System audit log list with filters  

### 7.13 Notifications (`/notifications`)

- Send notifications via API  

---

## 8. Shared Components

| Component              | Selector           | Purpose                                                                 |
|------------------------|--------------------|-------------------------------------------------------------------------|
| **DataTableComponent** | `app-data-table`   | Sortable columns, pagination, row links, status column, loading overlay |
| **StatusBadgeComponent** | `app-status-badge`| Semantic status chips (active, blocked, pending, pod_pending, etc.)     |
| **KpiCardComponent**   | `app-kpi-card`    | Value, label, sublabel, icon, optional `alert` for warnings             |
| **SkeletonLoaderComponent** | `app-skeleton-loader` | Loading placeholders with configurable rows/widths                  |
| **EmptyStateComponent** | `app-empty-state` | Icon, title, message; optional content projection for actions          |
| **TimelineComponent**   | `app-timeline`    | Trip timeline display                                                   |
| **TripTrackingMapComponent** | `app-trip-tracking-map` | Google Map with pickup, drop, driver markers                    |

### DataTableComponent Usage

```html
<app-data-table
  [columns]="columns"
  [data]="items"
  [loading]="loading"
  [sortKey]="filters.sort"
  [sortDir]="filters.sortDir"
  [page]="pagination.page"
  [pages]="pagination.pages"
  [total]="pagination.total"
  [rowLinkFn]="rowLinkFn"
  (sortChange)="onSort($event)"
  (pageChange)="goToPage($event)"
/>
```

### StatusBadge Status Classes

- **active / success / completed / closed_with_pod / accepted** — Green  
- **blocked / cancelled / error** — Red  
- **pending / planned / booked / open** — Amber  
- **inactive** — Gray  
- **pod_pending** — Purple  
- **assigned** — Blue  

---

## 9. Services

| Service                  | Responsibility                                                             |
|--------------------------|---------------------------------------------------------------------------|
| **AuthService**          | Login, logout, token storage in localStorage, `currentAdmin$`, refresh     |
| **ApiService**           | All REST API calls; uses bearer token from AuthService                    |
| **SocketService**        | Socket.IO client; `connect()`, `disconnect()`, `joinTrip()`, `onTripEvent()`|
| **ToastService**         | Success, error, warning, info toasts                                      |
| **CacheService**         | In-memory TTL cache (Map) — available but not currently used              |
| **GoogleMapsLoaderService** | Loads Maps JS API (APP_INITIALIZER); used by trip map component        |

---

## 10. Authentication & Authorization

### 10.1 Admin Model

```typescript
interface Admin {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: AdminPermissions;
  userType: 'admin';
  status: 'active' | 'inactive' | 'blocked';
}
```

### 10.2 Permissions

| Permission          | Scope                        |
|---------------------|-----------------------------|
| canManageUsers      | User Management             |
| canManageTrips      | Shipments / Trips           |
| canManageVehicles   | Fleet                       |
| canManageFuel       | Fuel                        |
| canManageSettlements| Settlements                 |
| canViewReports      | Analytics                   |
| canManagePumps      | Pump management             |
| canManageFraud      | Fraud Detection             |

### 10.3 Auth Interceptor

- Attaches `Authorization: Bearer <token>` to requests  
- On **401**: attempts `POST /auth/refresh` with refresh token, retries request  
- On refresh failure: logout + redirect to `/login`  

---

## 11. API Integration

### 11.1 Base Configuration

- **Base URL:** From `environment.apiUrl` (e.g. `https://api.port.porttivo.com/api`)  
- **Socket URL:** From `environment.socketUrl` (same origin without `/api`)  

### 11.2 Key Endpoints (Admin Scope)

| Module    | Endpoints                                                                 |
|-----------|---------------------------------------------------------------------------|
| Auth      | `POST /auth/admin-login`, `POST /auth/refresh`                            |
| Dashboard | `GET /admin/dashboard/stats`                                              |
| Analytics | `GET /admin/analytics`                                                    |
| Trips     | `GET/PUT /trips`, `GET /trips/search`, `PUT /trips/:id/cancel`            |
| Admin Trips | `PUT /admin/trips/:id/status`, `PUT /admin/trips/:id/reassign`          |
| Users     | `GET /admin/transporters`, `GET /admin/drivers`, etc.                      |
| Vehicles  | `GET /vehicles`, `GET /vehicles/documents/expiring`                       |
| Fuel      | `GET /fuel/transactions`, `GET /fuel/fraud-alerts`                        |
| Settlements | `GET /settlements`, `PUT /settlements/:id/process`                      |
| Customers | `GET /admin/customers/list`, `PUT /admin/customers/:id/status`            |
| Audit     | `GET /admin/system-audit-logs`                                            |
| Notifications | `POST /notifications/send`                                             |

---

## 12. Routing

| Path          | Layout        | Guard              | Lazy Module           |
|---------------|---------------|--------------------|------------------------|
| `/login`      | None          | —                  | LoginPageModule       |
| `''` (root)   | AdminLayout   | AuthGuard          | Children              |
| `/dashboard`  | AdminLayout   | AuthGuard          | DashboardPageModule   |
| `/users`      | AdminLayout   | AuthGuard, permissionGuard (canManageUsers) | UsersPageModule   |
| `/trips`      | AdminLayout   | AuthGuard, permissionGuard (canManageTrips) | TripsPageModule   |
| `/trips/:id`  | AdminLayout   | AuthGuard          | TripsPageModule (TripDetailPage) |
| `/vehicles`   | AdminLayout   | AuthGuard, permissionGuard (canManageVehicles) | VehiclesPageModule |
| `/fuel`       | AdminLayout   | AuthGuard, permissionGuard (canManageFuel) | FuelPageModule  |
| `/settlements`| AdminLayout   | AuthGuard          | SettlementsPageModule |
| `/fraud`      | AdminLayout   | AuthGuard          | FraudPageModule       |
| `/fuel-cards` | AdminLayout   | AuthGuard          | FuelCardsPageModule   |
| `/analytics`  | AdminLayout   | AuthGuard, permissionGuard (canViewReports) | AnalyticsPageModule |
| `/customers`  | AdminLayout   | AuthGuard          | CustomersPageModule   |
| `/audit-logs` | AdminLayout   | AuthGuard          | AuditLogsPageModule   |
| `/notifications` | AdminLayout | AuthGuard          | NotificationsPageModule |
| `**`          | —             | —                  | Redirect to `''`      |

**Preloading:** `PreloadAllModules` for faster navigation.

---

## 13. State Management

- **No NgRx/Akita/signals store.**  
- **Component-local state** + **service-backed** data.  
- **Auth:** `AuthService` uses `BehaviorSubject<Admin | null>` and localStorage.  
- **Sockets:** `SocketService` uses `BehaviorSubject` for connection state.  
- **HTTP:** Imperative calls via `ApiService` (async/firstValueFrom/subscribe).  
- **Route:** Angular Router for URL state.  
- **Cache:** `CacheService` available for optional memoization (not wired).  

---

## 14. Environment & Configuration

### 14.1 Environment Variables

| Variable           | Description                          |
|--------------------|-------------------------------------|
| `production`       | Boolean                              |
| `apiUrl`           | e.g. `https://api.port.porttivo.com/api` |
| `socketUrl`        | e.g. `https://api.port.porttivo.com` |
| `googleMapsApiKey` | Google Maps JavaScript API key      |

### 14.2 Build

- Production build replaces `environment.ts` with `environment.prod.ts`.  
- Output: `www/` (Capacitor `webDir`).  

### 14.3 Capacitor

- `appId`: `io.ionic.starter` (default; update for published apps)  
- `appName`: `porttivoadmin`  

---

## 15. Running the Application

```bash
cd Porttivo-Admin
npm install
ng serve
```

- Dev server: typically `http://localhost:4200`  
- Production build: `npm run build`  

---

## Appendix: Suggested Enhancements

- Confirmation dialogs for cancel/delete (partially implemented)  
- Bulk actions on tables  
- Export to CSV/Excel  
- Advanced filters (date picker range, multi-select)  
- Settings page for roles & permissions  
- Global search in header  
- Consistent permission checks between sidebar items and route guards (e.g. Shipments/Trips nav vs `canManageTrips`)  

---

*Last updated: March 2025*
