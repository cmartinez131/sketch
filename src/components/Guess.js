const Guess = ({ player, guess }) => {
    return (
        <li className="guess">
            {player}: {guess}
        </li>
    )
}

export default Guess;


