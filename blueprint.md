# Game Chat Application Blueprint

## 1. Overview

A real-time web-based chat application using HTML, CSS, and vanilla JavaScript, powered by Firebase for backend services. The application provides user authentication and real-time messaging capabilities with a focus on personalized view management.

## 2. Style, Design, and Features

### Layout & Style
- **Responsive Design:** Functional on both mobile and web.
- **Glassmorphism UI:** Modern "glass" effect for cards and headers.
- **Dark Mode:** Support for dark and light themes with a manual toggle and persistence in `localStorage`.
- **Unified Messaging UI:** Sent and received messages use consistent styling for a cohesive look.
- **Color Palette:** Uses CSS variables for easy theme switching and maintenance.
- **Typography:** 'Inter' font for optimal readability.

### Features
- **User Login:** Credential-based login with predefined users.
- **Real-time Chat:** Instant message delivery via Firebase Realtime Database.
- **Personalized Chat History:**
  - **Local Clear:** A "Clear" feature that hides messages only for the current user without deleting them from the global database or affecting other users.
  - **Instant Action:** No confirmation dialog for a faster user experience.
- **Logout:** Session management via `localStorage`.

## 3. Implementation Details

- **Theme Toggle:** Swaps CSS variables by toggling a `.dark` class on the `body`.
- **Message Filtering:** Uses a `last_cleared_[userId]` timestamp in `localStorage` to filter messages fetched from Firebase.
- **Persistence:** User sessions, theme preferences, and clear timestamps are maintained across page reloads.
