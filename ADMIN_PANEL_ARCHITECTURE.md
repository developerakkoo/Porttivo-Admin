# Porttivo Admin Panel — Architecture & Implementation Guide

## Overview

Production-grade logistics admin panel for cargo shipments, container transport, fleet tracking, and trip management. Built with **Angular 20**, **Ionic 8**, and **Chart.js** (ng2-charts).

---

## 1. Backend Integration Map

### API Endpoints (Admin Scope)

| Module | Endpoints | Description |
|--------|-----------|-------------|
| **Auth** | `POST /auth/admin-login`, `POST /auth/refresh` | Admin login, token refresh |
| **Dashboard** | `GET /admin/dashboard/stats` | KPI stats |
| **Analytics** | `GET /admin/analytics` | Trips/fuel/users charts |
| **Trips** | `GET/PUT /trips`, `GET /trips/search`, `PUT /trips/:id/cancel` | List, search, cancel |
| **Admin Trips** | `PUT /admin/trips/:id/status`, `PUT /admin/trips/:id/reassign` | Override status, reassign |
| **Users** | `GET /admin/transporters`, `GET /admin/drivers`, etc. | Transporters, drivers, pump owners |
| **Vehicles** | `GET /vehicles`, `GET /vehicles/documents/expiring` | Fleet, expiring docs |
| **Fuel** | `GET /fuel/transactions`, `GET /fuel/fraud-alerts` | Transactions, fraud |
| **Settlements** | `GET /settlements`, `PUT /settlements/:id/process` | List, process |
| **Customers** | `GET /admin/customers/list`, `PUT /admin/customers/:id/status` | List, status |
| **Audit** | `GET /admin/system-audit-logs` | Activity feed |
| **Notifications** | `POST /notifications/send` | Send notifications |

### Trip Status Flow

```
BOOKED → ACCEPTED → PLANNED → ACTIVE → POD_PENDING → CLOSED_WITH_POD
                                              ↘ CLOSED_WITHOUT_POD
                                        CANCELLED (from any)
```

### Admin Permissions

- `canManageUsers` — User Management
- `canManageTrips` — Shipments / Trips
- `canManageVehicles` — Fleet
- `canManageFuel` — Fuel
- `canManageSettlements` — Settlements
- `canManageFraud` — Fraud Detection
- `canViewReports` — Analytics
- `canManagePumps` — Pump management

---

## 2. File Structure

```
Porttivo-Admin/src/app/
├── components/           # Legacy menu (replaced by layout)
├── guards/               # AuthGuard, permissionGuard
├── interceptors/         # AuthInterceptor (JWT)
├── layouts/
│   └── admin-layout/     # Sidebar + header layout
├── models/               # Admin, Dashboard, User models
├── pages/
│   ├── dashboard/
│   ├── users/
│   ├── trips/
│   ├── vehicles/
│   ├── fuel/
│   ├── settlements/
│   ├── fraud/
│   ├── fuel-cards/
│   ├── analytics/
│   ├── customers/
│   ├── audit-logs/
│   └── notifications/
├── services/
│   ├── api.service.ts    # All API calls
│   ├── auth.service.ts
│   ├── socket.service.ts
│   ├── toast.service.ts
│   └── google-maps-loader.service.ts
└── shared/components/
    ├── data-table/       # Sortable, filterable table
    ├── empty-state/
    ├── kpi-card/
    ├── skeleton-loader/
    ├── status-badge/
    ├── timeline/
    └── trip-tracking-map/
```

---

## 3. Design System

### Colors

- Primary: `#0E2A47` (maritime blue)
- Accent: `#F97316` (industrial orange)
- Background: `#F8FAFC`
- Cards: white
- Text: `#0f172a` / `#64748b`

### Typography

- Primary: Inter
- Headings: Space Grotesk (optional)

### Layout

- **Sidebar** — Fixed left, collapsible (260px → 72px)
- **Top header** — User info, logout
- **Page content** — Max-width 1400px, card-based sections

---

## 4. Reusable Components

### DataTableComponent

- Columns with `key`, `label`, `sortable`, `type` (text|number|date|status)
- Pagination, row links, loading overlay
- Usage:

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

### KpiCardComponent

- `value`, `label`, `sublabel`, `icon`, `alert`

### StatusBadgeComponent

- `status`, `label`
- Mapped colors for: active, blocked, pending, pod_pending, etc.

### SkeletonLoaderComponent

- `rows`, `widths`, `fullWidth`

### EmptyStateComponent

- `icon`, `title`, `message`
- Optional content projection for actions

---

## 5. Example Pages

### Dashboard

- KPI cards (transporters, drivers, fleet, trips, fuel, pump owners, alerts)
- Date filter
- Trips chart (ng2-charts line)
- Recent activity feed (system audit logs)
- Skeleton loader while loading

### Shipments / Trips

- Filter bar: search, status, date range
- DataTable: tripId, container, reference, transporter, status, date
- Row links to trip detail
- Real-time updates via Socket.IO

### Sidebar (AdminLayout)

- Logo, collapse toggle
- Nav items with permission-based visibility
- Top header: admin name, role badge, logout

---

## 6. Routing

```
/                     → redirect to /dashboard
/login                → LoginPage (no layout)
/dashboard            → Dashboard (AdminLayout)
/users                → Users (AdminLayout, canManageUsers)
/trips                → Trips list (AdminLayout, canManageTrips)
/trips/:id            → Trip detail (AdminLayout)
/vehicles, /fuel, ... → respective modules
```

---

## 7. State & API

- **Auth:** `AuthService` + JWT in `Authorization` header
- **API:** `ApiService` with typed methods for all admin endpoints
- **Toasts:** `ToastService` (success, error, warning, info)
- **Real-time:** `SocketService` for trip events

---

## 8. UX Enhancements

- Skeleton loaders
- Empty states
- Status badges with semantic colors
- Responsive sidebar (collapsed on &lt;992px)
- Smooth transitions

---

## 9. Running

```bash
cd Porttivo-Admin
npm install
ng serve
# or
npm run build
```

---

## 10. Next Steps (Optional)

- Add confirmation dialogs for cancel/delete
- Add bulk actions on tables
- Add export (CSV/Excel)
- Add advanced filters (date picker range, multi-select)
- Add settings page for roles & permissions
- Add global search in header
