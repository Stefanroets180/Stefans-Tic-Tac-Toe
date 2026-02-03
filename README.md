# Stefan's Tic Tac Toe

A modern, feature-rich Tic Tac Toe game built with React, featuring multiple game modes including Human vs Human, Human vs Bot, and Bot vs Bot with an intelligent AI opponent using the minimax algorithm.

## 🎮 Features

- **Multiple Game Modes**: Play against humans or AI opponents
- **Smart AI**: Bot uses minimax algorithm with alpha-beta pruning
- **Move History**: Track and replay any point in the game
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful gradient backgrounds with smooth animations
- **Bot vs Bot Mode**: Watch two AI opponents battle it out

## 🚀 Quick Start (Standalone Version)

The easiest way to play the game is to simply open `index-standalone.html` in your web browser:

1. Double-click `index-standalone.html` or open it in any modern web browser
2. Choose your game mode and start playing!

This version requires no installation or build tools - it works immediately.

## 💻 React Development Version

For developers who want to modify or enhance the game:

### Prerequisites

- Node.js (version 18 or higher)
- npm or pnpm

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   # or if you prefer pnpm
   pnpm install
   ```

### Running the Development Server

```bash
npm start
```

This will start the development server on `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Deploying to GitHub Pages

```bash
npm run deploy
```

This will build and deploy the app to GitHub Pages.

## 🎯 How to Play

1. **Choose Game Mode**:
   - 👥 **Human vs Human**: Two players take turns
   - 🤖 **Human vs Bot**: Play against the AI
   - 🤖 **Bot vs Bot**: Watch AI vs AI battles

2. **Make Your Move**: Click on any empty square to place your mark (X or O)

3. **Win Conditions**: Get three in a row horizontally, vertically, or diagonally

4. **Game Controls**:
   - 🏠 **Menu**: Return to game mode selection
   - 🔄 **New Game**: Start a fresh game with the same mode
   - 📈 **Sort**: Reverse the order of move history

## 🧠 AI Intelligence

The bot uses a sophisticated minimax algorithm with alpha-beta pruning to make optimal moves. This means the AI will:
- Always block you from winning when possible
- Take winning moves when available
- Play optimally to force a draw when it can't win

## 🔧 Technical Details

### React Version Structure
```
src/
├── components/
│   ├── Game.js          # Main game component
│   ├── Game-Simple.js   # Simplified version
│   ├── Board.js         # Game board component
│   ├── Square.js        # Individual square component
│   └── Button.js        # Reusable button component
├── lib/
│   ├── game-logic.js    # Game logic and AI
│   └── utils.js         # Utility functions
├── App.js               # Root component
├── index.js             # Entry point
└── index.css            # Styles
```

### Standalone Version
The `index-standalone.html` file contains:
- Complete game logic in vanilla JavaScript
- Responsive CSS with modern design
- No external dependencies
- Works offline

## 🎨 Customization

### Styling
- Modify CSS variables in the standalone version
- Update Tailwind classes in the React version
- Change colors, fonts, and animations to your preference

### Game Logic
- Adjust AI difficulty in the minimax function
- Add new game modes
- Implement different board sizes
- Add sound effects and animations

## 📱 Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

Feel free to fork this project and submit pull requests for:
- Bug fixes
- New features
- UI improvements
- Performance optimizations

## 📄 License

This project is open source and available under the MIT License.

## 🏆 Credits

Created by Stefan Roets - A modern take on the classic Tic Tac Toe game with advanced AI capabilities.

---

**Enjoy the game! 🎮**