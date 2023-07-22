import DrawingBoard from '../components/Drawingboard'
import { useState } from 'react'
import Guess from '../components/Guess'
import PlayerList from '../components/PlayerList';
import '../styles.css'

const Game = ({ player, players }) => {

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

    // need to create a guess form ***
    return (
        <div className='container'>
            <div className='left'>
                <div className='players-list'>
                    <PlayerList players={players} />
                </div>
            </div>

            <div className='middle'>
                <DrawingBoard />
            </div>
            <div className='right'>
                <h2>Guesses:</h2>
                <div className="chat-log">
                    <ul>
                        {guesses.map((guess, index) =>
                            <Guess key={index} player={player.name} guess={guess} />
                        )}
                    </ul>
                    
                </div>
                <div className='chat-box'>
                    <form onSubmit={addGuess}>
                        <input
                            type="text"
                            value={newGuess}
                            onChange={handleGuessChange}
                        />
                        <button type="submit">Guess</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Game;