const End = ({ players }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="end">
      <h1>Leaderboard</h1>
      <ul>
        {sortedPlayers.map((player, index) => (
          <li key={index} className="endPlayer">
            {player.username} - {player.score} points
          </li>
        ))}
      </ul>
    </div>
  )
};

export default End;