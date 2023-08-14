import React, { useState, useEffect } from 'react'

const Timer = ({ socket }) => {
	const [timeLeft,setTimeLeft]=useState(60)

	useEffect(() => {
		socket.on('update-timer',setTimeLeft)
	},[socket])

	return (
		<div>
            Time left: {timeLeft} seconds
		</div>
	)
}

export default Timer