# Stefan's Tic Tac Toe 🎮

An enhanced React-based Tic Tac Toe game with multiple game modes and AI opponents.

## 🚀 Features

### Game Modes
- **👥 Human vs Human**: Classic two-player mode where two humans take turns
- **👤 Human vs Bot**: Play against an intelligent AI opponent
- **🤖 Bot vs Bot**: Watch two AI opponents battle it out automatically

### Game Features
- **Smart AI**: Uses minimax algorithm with alpha-beta pruning for optimal moves
- **Move History**: Navigate through game history and jump to any previous move
- **Win Detection**: Highlights winning squares and displays the winner
- **Draw Detection**: Automatically detects when the game ends in a draw
- **Move Sorting**: Sort the move history in ascending or descending order
- **Responsive Design**: Works on desktop and mobile devices

## 🛠 Technologies Used

- **React 16.13.1**: Component-based UI framework
- **JavaScript ES6+**: Modern JavaScript features
- **CSS3**: Responsive styling with flexbox and grid
- **pnpm**: Fast, disk space efficient package manager

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/Stefans-Tic-Tac-Toe.git
cd Stefans-Tic-Tac-Toe
```

2. Install dependencies:
```bash
pnpm install
```

## 🏃‍♂️ Available Scripts

In the project directory, you can run:

### `pnpm start`

Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.  
You will also see any lint errors in the console.

### `pnpm test`

Launches the test runner in interactive watch mode.  
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `pnpm run build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!

**Note**: If you encounter OpenSSL errors during build with newer Node.js versions, use:
```bash
export NODE_OPTIONS=--openssl-legacy-provider
pnpm run build
```

### `pnpm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## 🎯 How to Play

1. **Choose Game Mode**: Select from Human vs Human, Human vs Bot, or Bot vs Bot
2. **Make Your Move**: Click on any empty square to place your mark (X or O)
3. **Win Condition**: Get three of your marks in a row (horizontally, vertically, or diagonally)
4. **Game Controls**: Use the buttons to start a new game, return to menu, or navigate move history

### Game Mode Details

#### Human vs Human 👥
- Player 1 plays as X (goes first)
- Player 2 plays as O (goes second)
- Take turns clicking on empty squares

#### Human vs Bot 👤
- You play as X (go first)
- Bot plays as O (goes second)
- Bot will automatically make its move after yours
- Bot uses advanced AI to provide a challenging experience

#### Bot vs Bot 🤖
- Watch two AI opponents play against each other
- Bot 1 (X) vs Bot 2 (O)
- Moves are made automatically with a small delay for visibility
- Great for observing optimal gameplay strategies

## 🧠 AI Implementation

The AI uses the **Minimax algorithm** with **Alpha-Beta pruning** for efficient decision making:

- **Minimax**: Evaluates all possible game states to find the optimal move
- **Alpha-Beta Pruning**: Optimizes the search by eliminating branches that won't affect the final decision
- **Difficulty**: The AI plays optimally, making it challenging but fair

## 📱 Responsive Design

The game is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🔧 Project Structure

```
src/
├── Game.js          # Main game component with AI logic
├── Board.js         # Game board component
├── Square.js        # Individual square component
├── index.js         # App entry point
└── index.css        # Styling and responsive design
```

## 🚀 Deployment

This project can be deployed to various platforms:

- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Use the `gh-pages` package
- **Firebase Hosting**: Use Firebase CLI

## 📈 Future Enhancements

Potential improvements for future versions:
- [ ] Difficulty levels for AI (Easy, Medium, Hard)
- [ ] Tournament mode
- [ ] Online multiplayer
- [ ] Game statistics and scoring
- [ ] Custom themes and colors
- [ ] Sound effects and animations
- [ ] Larger board sizes (4x4, 5x5)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎨 Screenshots

![Game Mode Selection](screenshots/game-modes.png)  
*Choose between different game modes*

![Human vs Bot](screenshots/human-vs-bot.png)  
*Play against an intelligent AI opponent*

![Bot vs Bot](screenshots/bot-vs-bot.png)  
*Watch AI opponents battle each other*

---

**Created by Stefan** - A modern take on the classic Tic Tac Toe game with AI opponents and multiple game modes.