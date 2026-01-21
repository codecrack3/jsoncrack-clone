# Idea Honing

Requirements clarification through iterative Q&A.

---

## Q1: Project Scope - MVP vs Full Clone

JSONCrack has many features. What's your target scope?

**Options:**
- **A) MVP Core** - JSON → graph visualization only (the signature feature)
- **B) Essential Clone** - JSON visualization + multi-format support (YAML, CSV, XML, TOML)
- **C) Full Feature Clone** - All features including code generation, JWT decoding, jq, exports
- **D) Custom scope** - Specific features you want to prioritize

**A1:** A) MVP Core - JSON → graph visualization only

---

## Q2: Technology Stack

What's your preferred frontend framework?

**Options:**
- **A) React** - Most common, large ecosystem, JSONCrack uses this
- **B) Vue** - Simpler learning curve, good DX
- **C) Svelte** - Minimal bundle size, compiled approach
- **D) Vanilla JS** - No framework, maximum control
- **E) Other** - Specify your preference

**A2:** A) React

---

## Q3: Graph Visualization Library

The graph rendering is the core feature. Do you have a preference, or should we research options?

**Options:**
- **A) React Flow** - Popular, well-documented, used by many similar tools
- **B) D3.js** - Low-level, maximum flexibility, steeper learning curve
- **C) Cytoscape.js** - Powerful graph theory library, good for complex graphs
- **D) vis.js** - Simple API, good performance
- **E) Research first** - Let's investigate options before deciding

**A3:** A) React Flow

---

## Q4: JSON Editor Component

How should users input their JSON?

**Options:**
- **A) Monaco Editor** - VS Code's editor, syntax highlighting, error detection, autocomplete
- **B) CodeMirror** - Lightweight, extensible, good performance
- **C) Simple textarea** - Minimal, fast to implement, basic experience
- **D) Ace Editor** - Feature-rich, used by Cloud9 IDE

**A4:** A) Monaco Editor

---

## Q5: UI Layout

What layout style do you prefer?

**Options:**
- **A) Split pane** - Editor on left, graph on right (like JSONCrack)
- **B) Tabbed** - Switch between editor and graph views
- **C) Overlay** - Graph as primary, editor as collapsible panel
- **D) Flexible** - User can resize/rearrange panels

**A5:** A) Split pane - Editor on left, graph on right

---

## Q6: Graph Interaction Features

What interactions should the graph support?

**Options:**
- **A) Basic** - Pan, zoom only
- **B) Standard** - Pan, zoom, click node to highlight, collapse/expand nodes
- **C) Advanced** - All above + search nodes, filter by type, minimap navigation
- **D) Full** - All above + edit values directly on graph, drag to rearrange

**A6:** B) Standard - Pan, zoom, click to highlight, collapse/expand nodes

---

## Q7: Styling & Theming

What's your approach to styling?

**Options:**
- **A) Tailwind CSS** - Utility-first, rapid development, popular
- **B) CSS Modules** - Scoped CSS, no additional dependencies
- **C) Styled Components** - CSS-in-JS, dynamic styling
- **D) shadcn/ui + Tailwind** - Pre-built components, consistent design system

**A7:** A) Tailwind CSS

---

## Q8: Dark Mode Support

Should the app support dark mode?

**Options:**
- **A) Dark only** - Single dark theme (common for dev tools)
- **B) Light only** - Single light theme
- **C) Both with toggle** - User can switch between light/dark
- **D) System preference** - Auto-detect OS setting + manual override

**A8:** D) System preference - Auto-detect OS setting + manual override

---

## Q9: Build & Deployment

How do you plan to build and deploy?

**Options:**
- **A) Vite + Static hosting** - Fast builds, deploy to Vercel/Netlify/GitHub Pages
- **B) Next.js + Vercel** - SSR capabilities, easy deployment
- **C) Create React App** - Traditional setup, eject if needed
- **D) No preference** - Recommend based on requirements

**A9:** A) Vite + Static hosting

---

## Q10: Data Persistence

Should users be able to save or share their JSON?

**Options:**
- **A) None** - Purely ephemeral, no saving (simplest)
- **B) Local only** - Save to browser localStorage, no sharing
- **C) URL sharing** - Encode JSON in URL for shareable links (size limited)
- **D) File import/export** - Load from file, download JSON

**A10:** B) Local only - Save to browser localStorage, no sharing

---

## Q11: Error Handling for Invalid JSON

How should the app handle invalid JSON input?

**Options:**
- **A) Inline errors** - Show error markers in editor, keep last valid graph
- **B) Error panel** - Dedicated error message area below editor
- **C) Toast notifications** - Non-intrusive popups for errors
- **D) Combination** - Inline markers + error panel with details

**A11:** A) Inline errors - Show error markers in editor, keep last valid graph

---

## Q12: Performance & Size Limits

Large JSON can slow down rendering. How should we handle this?

**Options:**
- **A) Warn at threshold** - Show warning at ~100KB, allow proceeding
- **B) Hard limit** - Block rendering above limit (e.g., 300KB like JSONCrack)
- **C) Progressive rendering** - Render visible nodes first, lazy-load rest
- **D) No limit** - Let browser handle it, user's responsibility

**A12:** B) Hard limit - Block rendering above ~300KB

---

## Q13: Node Visual Styling

How should different JSON types be visually distinguished?

**Options:**
- **A) Color-coded** - Different colors for objects, arrays, strings, numbers, booleans, null
- **B) Shape-based** - Different node shapes per type
- **C) Both** - Color + shape differentiation
- **D) Minimal** - Same style, only icons to indicate type

**A13:** A) Color-coded - Different colors for objects, arrays, strings, numbers, booleans, null

---

## Q14: Graph Layout Direction

How should the graph be laid out?

**Options:**
- **A) Left to right** - Root on left, children expand rightward (like JSONCrack)
- **B) Top to bottom** - Root on top, children expand downward (tree style)
- **C) User choice** - Toggle between horizontal/vertical layouts
- **D) Auto-fit** - Algorithm decides based on data shape

**A14:** A) Left to right - Root on left, children expand rightward

---

## Requirements Summary

| Area | Decision |
|------|----------|
| Scope | MVP Core - JSON → graph visualization only |
| Framework | React |
| Graph Library | React Flow |
| Editor | Monaco Editor |
| Layout | Split pane (editor left, graph right) |
| Interactions | Standard (pan, zoom, highlight, collapse/expand) |
| Styling | Tailwind CSS |
| Theme | System preference + manual override |
| Build | Vite + Static hosting |
| Persistence | localStorage (local only) |
| Errors | Inline markers, keep last valid graph |
| Size Limit | Hard limit ~300KB |
| Node Styling | Color-coded by JSON type |
| Graph Direction | Left to right |

