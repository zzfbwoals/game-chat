# Game Chat Project Blueprint

## Project Overview
A simple, modern web-based chat application that allows users to log in with predefined accounts and exchange messages in a visually appealing interface.

## Design & Features
- **Login System**: Secure-looking login interface for the two predefined users.
- **Chat Interface**: A responsive chat window with message bubbles, user avatars (initials), and timestamps.
- **Aesthetics**:
    - Modern typography (Inter or system fonts).
    - Vibrant color palette (OKLCH based).
    - Subtle noise textures and deep multi-layered shadows.
    - Glassmorphism effects for the chat container.
- **Predefined Users**:
    1. `fbwoals` (류재민) - PW: `0421`
    2. `rlaalsrud` (김민경) - PW: `0423`

## Implementation Plan
1. **HTML Structure**:
    - App container with conditional rendering for Login and Chat views.
    - Login form with ID/PW fields.
    - Chat layout with header, message area, and input area.
2. **CSS Styling**:
    - Global variables for colors and spacing.
    - Layout using Flexbox/Grid.
    - Interactive elements with hover/focus effects.
3. **JavaScript Logic**:
    - User authentication logic.
    - State management for the current user and messages.
    - DOM manipulation to render messages dynamically.
    - Simple local simulation of receiving messages if needed, or just a shared local state.
