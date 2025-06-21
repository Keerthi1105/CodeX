import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [secretNumber, setSecretNumber] = useState('')
  const [guess, setGuess] = useState('')
  const [guesses, setGuesses] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [remainingAttempts, setRemainingAttempts] = useState(5)
  const [gameResult, setGameResult] = useState('')
  const [isWin, setIsWin] = useState(false)

  useEffect(() => {
    generateSecretNumber()
  }, [])

  const generateSecretNumber = () => {
    const digits = new Set()
    while (digits.size < 5) {
      digits.add(Math.floor(Math.random() * 10))
    }
    setSecretNumber(Array.from(digits).join(''))
  }

  const checkGuess = (input) => {
    if (input.length !== 5 || !/^\d+$/.test(input)) {
      return { valid: false, message: 'Please enter exactly 5 digits' }
    }
    return { valid: true }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validation = checkGuess(guess)
    
    if (!validation.valid) {
      alert(validation.message)
      return
    }

    const result = {
      guess,
      positionFeedback: Array(5).fill('')
    }

    // Check for correct positions and digits
    for (let i = 0; i < 5; i++) {
      if (guess[i] === secretNumber[i]) {
        result.positionFeedback[i] = '✓'
      } else if (secretNumber.includes(guess[i])) {
        result.positionFeedback[i] = '↔'
      } else {
        result.positionFeedback[i] = '✗'
      }
    }

    setGuesses([...guesses, result])
    setGuess('')
    setRemainingAttempts(prev => prev - 1)

    const allCorrect = result.positionFeedback.every(feedback => feedback === '✓')
    if (allCorrect) {
      setGameOver(true)
      setIsWin(true)
      setGameResult('🎉 Congratulations! You\'ve cracked the code! 🎉')
    } else if (remainingAttempts <= 1) {
      setGameOver(true)
      setIsWin(false)
      setGameResult('Better luck next time!')
    }
  }

  const resetGame = () => {
    generateSecretNumber()
    setGuesses([])
    setGuess('')
    setGameOver(false)
    setGameResult('')
    setIsWin(false)
    setRemainingAttempts(5)
  }

  const renderVictoryScreen = () => (
    <div className="victory-screen">
      <div className="victory-content">
        <h2>🎉 WIN! 🎉</h2>
        <div className="cracked-code">
          <h3>The Secret Code</h3>
          <div className="secret-number-display">
            {secretNumber.split('').map((digit, index) => (
              <div key={index} className="secret-digit">
                {digit}
              </div>
            ))}
          </div>
        </div>
        <p className="victory-message">{gameResult}</p>
        <button onClick={resetGame} className="reset-button">
          Play Again
        </button>
      </div>
    </div>
  )

  const renderLoseScreen = () => (
    <div className="lose-screen">
      <div className="lose-content">
        <h2>Game Over</h2>
        <div className="hidden-code">
          <h3>The Secret Code Was</h3>
          <div className="secret-number-display">
            {secretNumber.split('').map((digit, index) => (
              <div key={index} className="secret-digit">
                {digit}
              </div>
            ))}
          </div>
        </div>
        <p className="lose-message">You lost the game</p>
        <p className="retry-message">{gameResult}</p>
        <button onClick={resetGame} className="reset-button">
          Try Again
        </button>
      </div>
    </div>
  )

  return (
    <div className="game-container">
      <header className="game-header">
        <div className="logo-container">
          <h1><span className="code-text">Code</span><span className="x-text">X</span></h1>
        </div>
        <div className="score-board">
          <span>Attempts Left: {remainingAttempts}</span>
        </div>
      </header>

      <div className="game-content">
        <div className="game-main">
          {isWin ? (
            renderVictoryScreen()
          ) : gameOver ? (
            renderLoseScreen()
          ) : (
            <>
              <div className="game-objective">
                <h2>Main Objective</h2>
                <p>Reveal the secret 5-digit number by making strategic guesses!</p>
              </div>

              <form onSubmit={handleSubmit} className="guess-form">
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Enter 5 digits"
                  maxLength={5}
                  disabled={gameOver}
                  className="guess-input"
                />
                <button type="submit" disabled={gameOver} className="submit-button">
                  Submit Guess
                </button>
              </form>

              <div className="guesses-list">
                {guesses.map((result, index) => (
                  <div key={index} className="guess-result">
                    <div className="guess-number-container">
                      <div className="guess-digits">
                        {result.guess.split('').map((digit, i) => (
                          <div key={i} className="digit-container">
                            <span className="digit">{digit}</span>
                            <span className={`position-marker ${
                              result.positionFeedback[i] === '✓' ? 'correct' : 
                              result.positionFeedback[i] === '↔' ? 'wrong-position' : 'incorrect'
                            }`}>
                              {result.positionFeedback[i]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="game-rules">
          <h2>Rules</h2>
          <ol>
            <li>Guess the 5-digit secret number</li>
            <li>Each digit appears only once</li>
            <li>You have 5 attempts to guess correctly</li>
            <li>After each guess, you'll see:
              <ul>
                <li>✓ for correct digit in correct position</li>
                <li>↔ for correct digit in wrong position</li>
                <li>✗ for incorrect digit</li>
              </ul>
            </li>
            <li>Win by guessing all digits in the correct order</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default App
