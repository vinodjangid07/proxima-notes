# Proxima Notes — Development Phases & Roadmap

This file tracks the systematic, phase-by-phase evolution of Proxima Notes. Each phase is verified for stability, architectural cleanliness, and portfolio excellence before progressing to the next.

---

## Progress Overview

| Phase | Title | Status | Summary |
| :---: | :--- | :---: | :--- |
| **Phase 1** | **Core Foundation & Baseline Stability** | ✅ **Completed** | Clean baseline. Guest notes in localStorage, Firebase Auth + Firestore cloud migration, dark/light theme, modal auto-save, responsive UI. |
| **Phase 2** | **Multi-Device Real-Time Sync & IndexedDB (Dexie)** | ✅ **Completed** | Firestore `onSnapshot` for instant cross-device updates, Dexie.js IndexedDB local persistence, offline queue, enhanced 4-state sync badge. |
| **Phase 3** | **Markdown Support & Zen Typography** | ✅ **Completed** | Live Markdown rendering (marked + DOMPurify), Edit/Split/Preview tabs, Zen fullscreen mode, interactive checklists, reading stats. |
| **Phase 4** | **Tags, Categories & Fuzzy Search** | 📋 **Planned & Detailed** | Organization tags (#tag), sidebar tag filters, pinned notes, and fast search indexing. |
| **Phase 5** | **Command Palette & Data Portability** | ⏳ *Upcoming* | `Ctrl/Cmd + K` power menu, JSON/Markdown/PDF export & import, trash bin with note restoration. |

---

## Phase 1: Core Foundation & Baseline Stability (Current State)

### Status: ✅ 100% Stable — Baseline Verified (No Bugs)

### What is Working:
1. **Frictionless Guest Workspace**:
   - Immediate access to `/notes` without login or signup.
   - Initial demo notes provided if storage is empty.
   - All guest operations (Create, Edit, Delete) saved instantaneously to browser `localStorage`.
2. **Automatic Cloud Migration on Sign-in**:
   - Supports Google OAuth Popup & Email/Password authentication.
   - On sign-in, all local guest notes automatically migrate to Firebase Cloud Firestore and assign the user's `uid`.
   - Server notes are merged and loaded directly into the workspace.
3. **Workspace Features**:
   - Quick note creator with keyboard shortcut (`Ctrl + Enter` / `Cmd + Enter` to save).
   - Dynamic Grid vs. List layout toggle with persistent active view state.
   - Real-time client-side search filtering across both note titles and contents.
   - Reader & Editor Modal (`NoteModal`) with 500ms debounced auto-save (`Typing...` → `Saving...` → `Saved`).
   - Modal keyboard navigation: `Escape` closes modal cleanly without losing edits.
   - Delete confirmation dialog (`ConfirmCard`) to prevent accidental note loss.
   - One-click copy note content to clipboard with dynamic checkmark feedback.
4. **Resilient Offline Baseline**:
   - Firestore configured with `persistentLocalCache()` for automatic IndexedDB caching of query snapshots.
   - `useOnlineStatus` hook detects online/offline browser state.
   - Two-state `SyncStatusBadge` (`Synced` / `Offline`).
5. **Design System & Layout**:
   - Dark mode first (`next-themes`), built on Tailwind CSS v4 `zinc` palette.
   - Zero structural drop-shadows, zero harsh borders, no nested cards.
   - Collapsible desktop sidebar and mobile-friendly bottom navigation bar.
   - Clean authentication views (`Login.jsx`, `Signup.jsx`) with user-friendly Firebase error messages.
   - Profile management page with synchronized note counts and safe logout flow.

---

## Phase 2: Multi-Device Real-Time Sync & IndexedDB (Dexie)

### Status: ✅ 100% Implemented & Verified

### Objective:
Elevate Proxima Notes to a true engineering highlight for interviews by enabling **real-time bi-directional synchronization across multiple devices** (e.g., updating a note on a mobile browser instantly updates your laptop screen with zero page reloads) and upgrading local storage to **IndexedDB via Dexie.js** while **strictly preserving guest usability**.

### Key Rules & Guardrails for Phase 2:
- ⚠️ **Zero Regressions for Guests**: Guests MUST continue writing and saving notes without any sign-in prompt.
- ⚠️ **No Protected Routes on `/notes`**: The workspace remains universally accessible to all visitors.
- ⚠️ **No UI Freezes**: All database operations must be non-blocking and asynchronous.

---

### Phase 2 Architecture & Specifications

#### 1. IndexedDB Persistence Layer (`src/lib/db.js`)
- **Technology**: `dexie` (Dexie.js — lightweight, modern IndexedDB wrapper).
- **Why**: `localStorage` is synchronous, blocks the main thread, and is capped at ~5MB. Dexie provides asynchronous, indexed queries and gigabyte-scale storage.
- **Database Schema**:
  ```javascript
  import Dexie from "dexie";

  export const localDb = new Dexie("ProximaNotesDB");
  localDb.version(1).stores({
    notes: "id, userId, title, createdAt, updatedAt, isDeleted",
    syncQueue: "++id, noteId, action, payload, createdAt, attempts"
  });
  ```
- **Guest Strategy**: Guest notes are stored locally in the `notes` table with `userId: 'guest'`. On first login, Dexie batch-queries guest notes and uploads them to Firestore.

#### 2. Live Multi-Device Synchronization (`onSnapshot`)
- **Current Limitation**: Phase 1 uses one-shot `getDocs()`, meaning if a user has two browser tabs or two devices open, changes on Device A never appear on Device B unless reloaded.
- **Phase 2 Solution**: Replace one-shot fetching with Firestore `onSnapshot` query listener for authenticated users:
  ```javascript
  const q = query(collection(db, "Notes"), where("userId", "==", currentUser.uid));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    // Process server changes and merge into Dexie / React state
  });
  ```
- Any note edit, addition, or deletion on Device A instantly triggers an update on Device B in real time.

#### 3. Offline Resilience & Sync Queue
- When the user is online:
  - Edits save to Dexie immediately (optimistic UI) and push to Firestore.
- When the user is offline:
  - Edits save to Dexie immediately so the user never feels a lag.
  - An operation entry is queued in `syncQueue` (e.g., `{ action: 'UPDATE', noteId, payload }`).
  - When the browser fires the `online` event, the queue automatically flushes all pending changes to Firestore.

#### 4. Upgraded 4-State `SyncStatusBadge`
Replace the basic 2-state badge with a rich 4-state indicator:
1. **Synced** (Green): All local notes match cloud state.
2. **Syncing...** (Blue pulsing dot): Actively pushing or pulling snapshot changes.
3. **Offline** (Amber): Device is disconnected from internet; displays count of queued local edits if any.
4. **Sync Error** (Red): Network failure or permission issue with a tactile "Retry" button.

#### 5. Clean Custom Hook Architecture (`src/hooks/useNotes.js`)
- Decouple data synchronization, Dexie operations, and Firestore listeners out of `Notes.jsx`.
- `Notes.jsx` receives `notes`, `addNote`, `editNote`, `deleteNote`, `syncStatus`, and `searchQuery` directly from the hook, keeping UI code clean and testable.

---

## Phase 3: Markdown Support & Zen Typography

### Status: ✅ 100% Implemented & Verified

### What Was Built:
1. **Markdown Parsing & Security Layer (`src/lib/markdown.js`)**:
   - Uses `marked` configured with GitHub Flavored Markdown (GFM) and automatic line breaks.
   - Sanitized via `DOMPurify` to guarantee complete XSS immunity.
   - `stripMarkdown()` produces clean text previews on note cards without exposing raw markdown syntax.
2. **Multi-Mode Reader & Editor (`NoteModal.jsx`)**:
   - **Segmented View Tabs**: `Edit` mode, `Split` mode (side-by-side editing + live preview on desktop), and rendered `Preview` mode.
   - **Zen / Focus Fullscreen Mode**: Click the maximize button (or press `Escape` to exit) to transform the modal into a distraction-free full-screen writing sanctuary.
   - **Markdown Toolbar**: Quick one-click insertion for Bold (`**`), Italic (`*`), Heading (`## `), Checklist (`- [ ] `), Code block (```` ``` ````), and Quote (`> `).
   - **Typography Switcher**: Instant toggle between modern sans-serif (`Outfit`) and monospace fonts for developers drafting code snippets.
3. **Interactive Task Checklists**:
   - Interactive checkbox support: ticking a task in Preview mode updates the underlying markdown text (`- [ ]` ↔ `- [x]`) and auto-saves instantly.
   - Cards in the workspace display an elegant task progress pill (e.g., `✓ 2/4`).
4. **Reading Statistics**:
   - Live word count, character count, estimated reading time, and task completion percentage displayed in the modal footer.

---

## Phase 4: Organization, Tags & Fuzzy Search (Planned)

### Objective:
Scale the workspace for users who have hundreds of notes.

### Features:
- Tagging system: Add `#tags` to notes with subtle pill badges.
- Sidebar tag filter: Click any tag in the sidebar to view matching notes.
- Pinned notes: Pin important notes to the top of the grid.
- Fuzzy search: Fast client-side search indexing across titles, content, and tags.
- Color or tone accent markers for visual grouping.

---

## Phase 5: Command Palette & Data Portability (Planned)

### Objective:
Provide power-user keyboard navigation and complete data ownership.

### Features:
- **Global Command Palette (`Ctrl/Cmd + K`)**:
  - Quickly jump to any note, create a new note, switch themes, or toggle grid/list view.
- **Data Export & Import**:
  - Export all notes to a single `.json` backup file or individual `.md` Markdown files.
  - Import existing Markdown or JSON notes into Proxima Notes.
- **Trash / Archiving**:
  - Soft-delete to an "Archive / Trash" view with a 30-day auto-purge and "Restore" option.
