import DrawingBoard from '../components/Drawingboard'
import { useState } from 'react'
import Button from '../components/Button'
import Guess from '../components/Guess'
const Game = () => {

    const [guesses, setGuesses] = useState([])  // New state for the list of guesses
    const [totalGuesses, setTotalGuesses] = useState(0)
    const [newGuess, setNewGuess] = useState('')
  
    const handleGuessChange = (event) => {
      setNewGuess(event.target.value)
    }
  
    const addGuess = (event) => {
      event.preventDefault() //prevent form from refreshing the page on submit
      if (newGuess.match(/^ *$/) === null) {
        setGuesses(guesses.concat(newGuess))
        setTotalGuesses(totalGuesses + 1)
      }
      setNewGuess('') //clear the input box
    }

    return (
        <div>
            <h1>Game Page</h1>

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

        </div>
    );
};

export default Game;