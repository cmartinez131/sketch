import React from "react";

const PlayerList = ({ players }) => (
    <ul>
        {players.map(( player, index )=>(
        <li key={index}> {player.username}: {player.score}</li>
        ))}
    </ul>
);

export default PlayerList;