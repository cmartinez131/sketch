import { useState } from 'react'
import DrawingBoard from './components/Drawingboard'
import Button from './components/Button'
import Guess from './components/Guess'


const App = () => {
  const [guesses, setGuesses] = useState([])  // New state for the list of guesses
  const [totalGuesses, setTotalGuesses] = useState(0)
  const [newGuess, setNewGuess] = useState('')

  const handleGuessChange = (event) => {
    setNewGuess(event.target.value)
  }

  const addGuess = (event) => {
    event.preventDefault() // Prevent form from refreshing the page on submit
    setGuesses(guesses.concat(newGuess))
    setNewGuess('') // Clear the input box
    setTotalGuesses(totalGuesses + 1)
  }

  return (
    <>
      <div className='title'>
        <h1>Sketch</h1>
      </div>

      <div className='drawing-board-container'>
        <DrawingBoard />
      </div>

      <div className='guesses-container'>
        <form onSubmit={addGuess}>
          <input
            type="text"
            value={newGuess}
            onChange={handleGuessChange}
          />
          <button type="submit">Guess</button>
        </form>
        <h2>Guesses:</h2>
        <ul>
          {guesses.map((guess, index) =>
            <Guess key={index} guess={guess} />
          )}
        </ul>
        <p1>total guesses: {totalGuesses}</p1>
      </div>

    </>
  )
}

export default App
