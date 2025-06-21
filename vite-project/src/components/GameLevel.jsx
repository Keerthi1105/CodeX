import { useState, useEffect } from 'react'

const GameLevel = ({ level, onScoreUpdate }) => {
  const [code, setCode] = useState('')
  const [target, setTarget] = useState('')
  const [feedback, setFeedback] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    generateNewChallenge()
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [level])

  const generateNewChallenge = () => {
    // Generate a simple coding challenge based on the level
    const challenges = [
      {
        code: 'function add(a, b) {\n  return a + b;\n}',
        target: 'function add(a, b) {\n  return a + b;\n}'
      },
      {
        code: 'function multiply(x, y) {\n  return x * y;\n}',
        target: 'function multiply(x, y) {\n  return x * y;\n}'
      },
      // Add more challenges as needed
    ]

    const challenge = challenges[Math.floor(Math.random() * challenges.length)]
    setCode(challenge.code)
    setTarget(challenge.target)
  }

  const checkSolution = () => {
    if (code.trim() === target.trim()) {
      setFeedback('Correct! 🎉')
      onScoreUpdate(10)
      setTimeout(() => {
        generateNewChallenge()
        setFeedback('')
      }, 1500)
    } else {
      setFeedback('Try again! 💪')
    }
  }

  return (
    <div className="game-level">
      <div className="timer">Time Left: {timeLeft}s</div>
      
      <div className="challenge-container">
        <div className="code-editor">
          <h4>Your Code:</h4>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your code here..."
            rows="6"
          />
        </div>

        <div className="target-container">
          <h4>Target Output:</h4>
          <pre>{target}</pre>
        </div>
      </div>

      <div className="game-controls">
        <button onClick={checkSolution} className="check-button">
          Check Solution
        </button>
        <button onClick={generateNewChallenge} className="new-challenge-button">
          New Challenge
        </button>
      </div>

      {feedback && <div className={`feedback ${feedback.includes('Correct') ? 'success' : 'error'}`}>
        {feedback}
      </div>}
    </div>
  )
}

export default GameLevel 