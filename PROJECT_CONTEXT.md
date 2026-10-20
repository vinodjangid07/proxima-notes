# Proxima Notes — Project Context

> **Project Repository**: [vinodjangid07/proxima-notes](https://github.com/vinodjangid07/proxima-notes)  
> **Author**: Vinod Jangid ([@vinodjangid07](https://github.com/vinodjangid07))  
> **App Name**: Proxima Notes  
> **Stack**: React 19, Vite 8, React Router v7, Tailwind CSS v4, Firebase v12 (Auth & Firestore), Lucide React, Next-Themes, React-Toastify, Vite-Plugin-PWA.

---

## 1. Core Philosophy & Value Proposition

**Proxima Notes** is a high-performance, distraction-free, local-first note-taking workspace designed for speed, privacy, and seamless multi-device synchronization.

### The Non-Negotiable Core Principles:
1. **Zero Barrier to Entry (No Forced Sign-in)**:
   - **Any visitor can immediately open `/notes` and start writing notes without signing up or logging in.**
   - Notes created by guests are saved instantly to browser local storage (`localStorage`).
   - There are **no protected route barriers** on the note workspace.
2. **Seamless Cloud Migration Upon Sign-in**:
   - As soon as a guest decides to sign in or create an account (Google OAuth or Email/Password), all locally stored guest notes are automatically migrated to Firebase Cloud Firestore and linked to their user account.
   - Once migrated, their cloud notes and local notes merge seamlessly.
3. **Offline-Resilient Architecture**:
   - Guests work 100% offline via browser storage.
   - Authenticated users benefit from Firebase Firestore's `persistentLocalCache()`. Edits made while offline are saved to local cache and synchronized once internet connectivity is restored.
4. **Distraction-Free, Human-Crafted Aesthetic**:
   - Dark-mode first, built on a clean Tailwind `zinc` palette with subtle accent touches.
   - No harsh borders, no heavy drop shadows used for structure, no nested cards.
   - Clean typography, smooth transitions, and tactile micro-interactions.

---

## 2. Technology Stack & Tooling

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.2.6` | Modern UI rendering, hooks, fast concurrent features |
| **Build Tool** | Vite | `^8.0.12` | Lightning-fast HMR and optimized production bundles |
| **Local Database** | Dexie.js (IndexedDB) | `^4.4.6` | Asynchronous local database with offline sync queue |
| **Routing** | React Router DOM | `^7.18.0` | Client-side routing with layout wrappers |
| **Styling** | Tailwind CSS | `^4.3.1` | Modern utility-first CSS via `@tailwindcss/vite` |
| **Icons** | Lucide React | `^1.21.0` | Consistent, lightweight SVG icon set |
| **Theming** | `next-themes` | `^0.4.6` | Zero-flash dark/light theme switching (`defaultTheme="dark"`) |
| **Notifications** | `react-toastify` | `^11.1.0` | Minimal, non-intrusive action feedback toasts |
| **Markdown Engine** | `marked` + `dompurify` | `^15.0.7` / `^3.2.4` | GitHub Flavored Markdown parsing with strict XSS sanitization |
| **Authentication** | Firebase Auth | `^12.15.0` | Google Popup OAuth & Email/Password authentication |
| **Cloud Database** | Firebase Cloud Firestore | `^12.15.0` | Real-time `onSnapshot` sync with `persistentLocalCache()` |
| **PWA Support** | `vite-plugin-pwa` | `^1.3.0` | Progressive Web App manifest and service worker capabilities |

---

## 3. Architecture & File Structure

```
proxima-notes/
├── public/
│   ├── proxima_logo.webp
│   └── favicon.ico
├── src/
│   ├── App.css
│   ├── App.jsx                       # Root router, theme provider, and toast container
│   ├── index.css                     # Tailwind @import, global typography, and .prose-proxima styles
│   ├── main.jsx                      # React 19 createRoot entry point
│   ├── components/
│   │   └── Notes/
│   │       ├── ConfirmCard.jsx       # Minimal inline deletion confirmation popover (memoized)
│   │       ├── Footer.jsx            # Clean footer with GitHub & author links
│   │       ├── Navbar.jsx            # Top bar with branding, auth state, theme toggle
│   │       ├── NoteCard.jsx          # Note display card with markdown preview & task pill
│   │       ├── NoteModal.jsx         # Zen fullscreen modal with Edit/Split/Preview, toolbar, and stats
│   │       ├── Sidebar.jsx           # Responsive workspace sidebar / mobile bottom bar
│   │       ├── SidebarLayout.jsx     # Outlet wrapper providing layout around /notes & /profile
│   │       └── SyncStatusBadge.jsx   # 4-state indicator (Synced, Syncing, Offline, Error with Retry)
│   ├── context/
│   │   ├── AuthContext.jsx           # Firebase onAuthStateChanged context provider
│   │   └── useAuth.jsx               # Custom hook for accessing auth state and logout()
│   ├── hooks/
│   │   ├── useDebounce.js            # Debounce hook for auto-save inputs and search filtering
│   │   ├── useNotes.js               # Core data hook: Dexie, onSnapshot real-time sync, offline queue
│   │   └── useOnlineStatus.js        # Reactive window online/offline listener hook
│   ├── lib/
│   │   ├── db.js                     # Dexie IndexedDB instance (notes & syncQueue schemas)
│   │   ├── firebase.js               # Firebase app, persistent Firestore, auth, and Google provider
│   │   └── markdown.js               # Markdown parser, DOMPurify sanitizer, reading stats, checklist helper
│   ├── routes/
│   │   ├── Home.jsx                  # High-impact landing page with quick login & workspace CTAs
│   │   ├── Notes.jsx                 # Core workspace: quick creator, search, grid/list, sync logic
│   │   ├── Privacy.jsx               # Privacy Policy legal document
│   │   ├── Profile.jsx               # User profile, synced notes count, and logout controls
│   │   ├── Terms.jsx                 # Terms of Service legal document
│   │   └── auth/
│   │       ├── Login.jsx             # Email/Password + Google login page with clean error mapping
│   │       └── Signup.jsx            # User registration with email/password
│   └── services/
│       └── notesServices.js          # Firestore CRUD functions (dbGetNotes, dbAddNote, dbUpdateNote, dbDeleteNote)
├── firestore.rules                   # Security rules ensuring users access only their own notes
├── package.json
├── PROJECT_CONTEXT.md                # This comprehensive context guide
└── PHASES.md                         # Detailed milestone tracking and future development roadmap
```

---

## 4. Detailed Data Flow & State Management

### 4.1 Guest Mode (Default State)
- When any user visits `/notes` without logging in:
  - `currentUser` is `null`.
  - Notes are initialized from `localStorage.getItem('Notes List')`.
  - If `localStorage` is empty, two clean default demo notes are provided.
  - Adding a note (`addNote`): Generates a `crypto.randomUUID()`, tags `userId: 'guest'`, prepends to state, and saves to `localStorage`.
  - Updating a note (`editNote`): Updates the item in state and writes to `localStorage`.
  - Deleting a note (`deleteNote`): Filters out from state and writes to `localStorage`.
  - **No login prompt or roadblock blocks the user from typing.**

### 4.2 Guest to Authenticated Migration
- When the user signs in (via Google popup or Email login):
  - `onAuthStateChanged` triggers and populates `currentUser`.
  - In `Notes.jsx`:
    ```javascript
    // 1. Find all guest notes that are not demo notes
    const unsynced = currentNotes.filter(
      (note) => note.userId !== currentUser.uid && !note.id.startsWith("demo-note-")
    );
    // 2. Upload them to Firestore under the user's uid
    for (const note of unsynced) {
      await dbAddNote(note.id, currentUser.uid, note.title, note.content);
    }
    // 3. Fetch user's full note list from Firestore
    const serverNotes = await dbGetNotes(currentUser.uid);
    // 4. Update state and update localStorage
    if (serverNotes && serverNotes.length > 0) {
      setNoteList(serverNotes);
    }
    ```

### 4.3 Authenticated User Operation
- All adds, updates, and deletes are executed against Firestore (`dbAddNote`, `dbUpdateNote`, `dbDeleteNote`) and mirrored in the local state/localStorage.
- If the user loses internet connection, Firestore's `persistentLocalCache()` queues the operations offline and syncs them as soon as the connection re-establishes.

### 4.4 Logout Handling
- Calling `logout()` signs out from Firebase Auth, removes the user's local notes cache, and fires a `local-logout` custom window event that resets `Notes.jsx` state back to the default guest demo notes.

---

## 5. Security & Firestore Rules

The database structure uses a root collection `'Notes'`:
```
Notes/{noteId}
  ├── id: string (UUID)
  ├── userId: string (Firebase Auth UID)
  ├── title: string
  ├── content: string
  └── createdAt: timestamp / string
```

Security rules (`firestore.rules`) enforce strict authorization:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /Notes/{noteId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## 6. UX & Keyboard Accessibility

- **Quick Save Shortcut**: In the creator card, pressing `Ctrl + Enter` (or `Cmd + Enter`) immediately saves the note.
- **Escape to Close**: Pressing `Escape` cleanly closes the active reader/editor modal.
- **Auto-Save on Edit**: Typing inside `NoteModal` triggers a 500ms debounce via `useDebounce`, automatically persisting changes with a live "Typing..." -> "Saving..." -> "Saved" status pill.
- **Confirmation Protection**: Destructive deletion is safeguarded by an inline `ConfirmCard` to prevent accidental loss.
- **Copy to Clipboard**: Quick copy button on cards and modal with an instant checkmark feedback animation.
