# Porttivo Admin: why a page may be missing or unreachable

## Sidebar (left nav)

Links are defined in `src/app/layouts/admin-layout/admin-layout.component.ts` (`navItems`). If an item has a `permission` key, `canShowItem()` hides it when `admin.permissions[permission] === false` (CSS class `hidden`).

- If `permissions` is **missing** on the logged-in admin, items are **shown** (treated as allowed).
- Flags come from the API / JWT (`AdminPermissions` in `src/app/models/admin.model.ts`).

`src/app/components/menu/menu.component.html` is **not** used by the shell; navigation is the custom sidebar in `admin-layout`.

## Route guards

`src/app/app-routing.module.ts` uses `permissionGuard` on some routes with `data: { permission: '...' }`. If that permission is `false`, navigation is redirected to `/dashboard`.

Routes **without** a guard can still be opened by URL even when the sidebar hides them—keep menu and guards aligned when you add new sections.

## Page layout

Authenticated pages render inside `AdminLayoutComponent` (`.page-content`). Use a single `ion-content` per page for scrolling; the shell provides outer chrome. Avoid a second `ion-header` + `ion-menu-button` (no global `ion-menu` is mounted in `app.component.html`).
