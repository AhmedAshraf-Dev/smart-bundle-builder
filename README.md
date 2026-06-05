# Smart Bundle Builder

A modern React application that allows users to build a custom PC setup while respecting budget limits and hardware compatibility rules.

This project was developed as part of a Frontend Engineering Assessment.

## 🔗 Live Demo

https://smart-bundlebuilder.netlify.app/

## 🔗 GitHub Repository

https://github.com/AhmedAshraf-Dev/smart-bundle-builder

---

# Features

- ✅ Component selection grouped by category.
- ✅ Only one item can be selected per category.
- ✅ Real-time total price calculation.
- ✅ Maximum budget limit of **$1000**.
- ✅ Budget progress visualization.
- ✅ Automatic incompatibility detection and disabling.
- ✅ Build summary / cart panel.
- ✅ Custom Undo / Redo functionality.
- ✅ Responsive design for desktop and mobile.
- ✅ Keyboard accessible interactions.
- ✅ Built using React, TypeScript, Ant Design, and TailwindCSS.

---

# Tech Stack

- React 18
- TypeScript
- Vite
- Ant Design
- TailwindCSS
- Context API (State Management)

---

# Getting Started

## Prerequisites

- Node.js (v18 or later recommended)
- npm

## Installation

Clone the repository:

```bash
git clone https://github.com/AhmedAshraf-Dev/smart-bundle-builder.git
```

Move into the project directory:

```bash
cd smart-bundle-builder
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open your browser and navigate to:

```
http://localhost:5173
```

## Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Undo / Redo State Architecture

The Undo / Redo functionality is implemented using a **snapshot history pattern**.

Instead of maintaining separate `past` and `future` stacks, the application stores every build state inside a single `history` array and tracks the currently active state using a `historyIndex`.

```text
history = [
  {},                       // Initial state
  { CPU: "cpu-1" },         // After selecting CPU
  {
    CPU: "cpu-1",
    RAM: "ram-1"
  }                         // After selecting RAM
]

historyIndex = 2
```

### State Updates

Whenever the user performs an action (selecting, replacing, removing, or clearing components):

1. The current history is truncated up to the current index.
2. A new snapshot representing the updated build is created.
3. The new snapshot is appended to the history array.
4. The `historyIndex` moves to the latest snapshot.

```ts
const newHistory = history.slice(0, historyIndex + 1);
newHistory.push(nextState);

setHistory(newHistory);
setHistoryIndex(newHistory.length - 1);
```

This approach ensures that if a user performs an Undo and then makes a new selection, all previously redoable states are automatically discarded, matching the behavior users expect from modern applications.

### Undo

Undo simply moves the pointer one step backward through the history array without modifying the stored snapshots.

```ts
if (historyIndex > 0) {
  setHistoryIndex((i) => i - 1);
}
```

### Redo

Redo moves the pointer one step forward if a newer snapshot exists.

```ts
if (historyIndex < history.length - 1) {
  setHistoryIndex((i) => i + 1);
}
```

### Why this approach?

I chose the snapshot-based history model because it keeps the implementation straightforward, predictable, and easy to maintain. Since the application state is relatively small (a map of selected component IDs), storing complete snapshots is inexpensive while making Undo/Redo operations extremely simple and reliable.

# Business Logic

## Budget Management

- Maximum allowed budget: **$1000**
- Selections that exceed the budget are prevented.
- A friendly warning message is displayed.
- A dynamic progress bar visualizes the current budget usage.

## Compatibility Engine

Each item contains an `incompatibleWith` array.

When a component is selected:

- All incompatible components are automatically disabled.
- Disabled items remain visible to help users understand why they cannot be selected.
- Compatibility updates happen instantly as the build changes.

## Build Summary

A dedicated summary panel displays:

- Selected components
- Individual prices
- Running total cost

The summary updates automatically whenever the build changes.

---

# Accessibility

The application was designed with accessibility in mind:

- Keyboard navigation support.
- Proper button semantics.
- Disabled states communicated visually.
- ARIA attributes used where appropriate.
- Interactive elements are reachable using Tab navigation.

---

# Responsive Design

The layout is optimized for:

- Desktop
- Tablet
- Mobile devices

The summary section and builder interface adapt smoothly across screen sizes.

---

## Project Structure

```text
smart-bundle-builder/
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── BuildSummary.tsx
│   │   │   ├── CategorySection.tsx
│   │   │   ├── ComponentCard.tsx
│   │   │   └── data.ts
│   │   │
│   │   ├── context/
│   │   │   └── BuildContext.tsx
│   │   │
│   │   ├── App.tsx
│   │   └── AppUI.tsx
│   │
│   ├── styles/
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   └── theme.css
│   │
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Folder Overview

- **app/components/** — Reusable UI components for the builder interface.
- **app/components/ui/** — Shared UI building blocks and helper components.
- **BuildSummary.tsx** — Displays the current build, selected parts, and total cost.
- **CategorySection.tsx** — Renders each hardware category and its available components.
- **ComponentCard.tsx** — Individual selectable component card with compatibility and budget states.
- **data.ts** — Centralized mock data and application constants.
- **context/BuildContext.tsx** — Global application state, including component selection, budget calculations, Undo/Redo history, theme management, and build actions.
- **App.tsx** — Main application container.
- **AppUI.tsx** — Presentation layer responsible for rendering the builder interface.
- **styles/** — Global styling, Tailwind integration, and theme customization.
- **main.tsx** — React application entry point.

## Architecture

The application follows a simple centralized state architecture using React Context API. The `BuildContext` acts as the single source of truth for:

- Selected components
- Budget calculations
- Compatibility logic
- Undo / Redo history
- Theme management
- Build actions (remove, clear, export, complete)

UI components remain mostly presentational and consume state through the custom `useBuild()` hook, keeping business logic isolated from the view layer.

# Author

**Ahmed Ashraf**

GitHub:
https://github.com/AhmedAshraf-Dev
