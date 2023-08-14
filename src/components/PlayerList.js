import React from 'react'

const PlayerList = ({ players }) => (
	<ul>
		{players.map((player, index) => (
			<li key={index} className="playerListItem">
				{player.username}: {player.score}
				{player.drawer && ' - drawing'}
			</li>
		))}
	</ul>
)

export default PlayerList