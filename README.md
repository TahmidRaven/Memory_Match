# Memory_Match (React Native)

A **Memory Match Game** built with **React Native**, featuring multiple levels, animated card flips, and a Blade Runner-inspired theme.

---

## Features

- Multi-level game with increasing grid sizes: `2x2`, `4x4`, `6x6`, `6x6`, `8x8`.
- Animated card flips using the `Animated` API.
- Preview of all cards at the start of each level.
- Level completion modal with move counter.
- Sidebar to navigate between unlocked levels.
- Dynamic theme: Blade Runner 2049-inspired dark mode.
- Fully responsive grid based on device width.

---

## Screenshots

> Add your screenshots here

---

## Usage

- **Main Screen**: Displays the game title, current level, move counter, and the game grid.
- **Sidebar**: Access levels and check which are completed or locked.
- **Card Interaction**:
  - Tap a card to flip it.
  - Match pairs to progress.
  - Preview all cards at the start of the level.
- **Level Completion**: A modal shows your moves and allows you to go to the next level.

---

## Key Components

### State Management

| State Variable       | Description                                      |
|---------------------|--------------------------------------------------|
| `loading`           | Show splash screen                               |
| `level`             | Current level                                   |
| `gridSize`          | Size of the current grid                         |
| `cards`             | Array of cards for the current level            |
| `flipped`           | Array of currently flipped card indexes         |
| `matched`           | Array of matched card indexes                    |
| `moves`             | Count of player moves                            |
| `showModal`         | Toggle level completion modal                    |
| `completedLevels`   | Tracks finished levels                           |
| `sidebarVisible`    | Sidebar toggle                                   |

### Animations

| Animation Variable  | Description                                     |
|--------------------|-------------------------------------------------|
| `flipAnimations`   | Animated values for card flips                  |
| `sidebarAnim`      | Slide animation for the sidebar                |
| `pulseAnim`        | Animated pulsing effect for splash logo        |

---

## Customization

- **Theme Colors**:

```javascript
backgroundColor: '#0B0C10'; // dark background
cardBack: '#1B1D25';        // dark card back
accent: '#FF6EC7';           // pink highlights
```

- **Level Grid Sizes**:
```
const levelGridSizes = [2, 4, 6, 6, 8];

```