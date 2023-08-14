import React, { useRef, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import '../styles.css'

//TODO: manage permission state so that client doesn't have to ask permission on every
//mouse move. Create event listeners and socket conenctions so server can update
//permission states when there is a new word

//colors in english: black, blue, red, yellow, pink, green, orange
const colors = ['#000000', '#0000ff', '#ff0000', '#ffd700', '#ff80ed', '#00ff00', '#ffa500', '#cccccc']
const ColorButton = ({ color, setColor }) => (
	<button
		className='color-button'
		style={{ backgroundColor: color }}
		onClick={() => setColor(color)}
	>
	</button>
)


//define DrawingBoard component
const DrawingBoard = ({ socket, player }) => {
	//use the react useRef hook to get a reference to the canvas DOM element
	const canvasRef = useRef(null)

	//use useState hook to create state variables for drawing status, color, stroke width, and drawing/erasing mode
	const [isDrawing, setIsDrawing] = useState(false)
	const [color, setColor] = useState('#000000')
	const [width, setWidth] = useState(10)
	const [mode, setMode] = useState('draw')  // New state variable for the mode
	const [permissionState, setPermissionState] = useState(null)

	//define function to handle mousedown event: emit 'start-drawing' event to server and all clients
	const handleMouseDown = (event) => {
		//ask permission from server before player can initiate drawing
		socket.emit('request-permission', { username: player.name })

		socket.on('permission-response', ({ hasPermission }) => {
			if (hasPermission) {
				setIsDrawing(true)
				const canvas = canvasRef.current
				const ctx = canvas.getContext('2d')
				// set the new starting point for line
				ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop)
				draw(event)
				socket.emit('start-drawing', { clientX: event.clientX, clientY: event.clientY, color, width })
			} else {
				console.log('It is not your turn to draw')
			}
		})
	}

	//define function to handle mouse-up event: emit 'stop=drawing' event
	const handleMouseUp = () => {
		setIsDrawing(false)
		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		ctx.beginPath()
		socket.emit('stop-drawing')
	}

	//define function to handle mouse-move event. if isDrawing is true, emit 'drawing' event to socket
	const handleMouseMove = (event) => {
		if (isDrawing) {
			draw(event)
			socket.emit('drawing', { clientX: event.clientX, clientY: event.clientY, color, width })
		}
	}

	//define function to draw on the canvas
	const draw = (mouseEvent) => {
		const canvas = canvasRef.current
		//c tx is the variable that refers to the 2d rendering context for canvas
		const ctx = canvas.getContext('2d')
		ctx.lineWidth = width
		// set stroke color. If we're in 'erase' mode, use the white
		ctx.strokeStyle = mode === 'draw' ? color : '#FFFFFF'
		// draw line to point where the mouse is
		ctx.lineTo(mouseEvent.clientX - canvas.offsetLeft, mouseEvent.clientY - canvas.offsetTop)
		ctx.stroke()//apply the stroke
	}

	//functin to clear the canvas when called
	//called when
	const clearCanvas = () => {
		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		//no longer emit to other clients here. emitting moved to handleClearButton function
	}

	const undoLastMove = () => {
		console.log('undo-event received by socket')
		//put undo logic. now it just clears the screen
		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		//no longer emit to other clients here. emitting moved to handleClearButton function
	}

	//emit to all clients including sender
	const handleClearButton = () => {
		socket.emit('clear-canvas')
	}
	const handleUndoButton = () => {
		socket.emit('undo-drawing')
	}

	// Use the useEffect hook to add event listeners
	useEffect(() => {
		const canvas = canvasRef.current
		canvas.addEventListener('mousedown', handleMouseDown)
		canvas.addEventListener('mouseup', handleMouseUp)
		canvas.addEventListener('mousemove', handleMouseMove)

		socket.on('start-drawing', ({ clientX, clientY, color, width }) => {
			setIsDrawing(true)
			const canvas = canvasRef.current
			const ctx = canvas.getContext('2d')
			ctx.lineWidth = width
			ctx.strokeStyle = color
			ctx.moveTo(clientX - canvas.offsetLeft, clientY - canvas.offsetTop)
		})

		socket.on('drawing', ({ clientX, clientY, color, width }) => {
			if (isDrawing) {
				const canvas = canvasRef.current
				const ctx = canvas.getContext('2d')
				ctx.lineWidth = width
				ctx.strokeStyle = color
				ctx.lineTo(clientX - canvas.offsetLeft, clientY - canvas.offsetTop)
				ctx.stroke()
			}
		})

		socket.on('stop-drawing', () => {
			setIsDrawing(false)
			const canvas = canvasRef.current
			const ctx = canvas.getContext('2d')
			ctx.beginPath()
		})

		// event listener listens for 'clear-canvas' events and calls clearCanvas function
		socket.on('clear-canvas', clearCanvas)

		// event listener listens for 'undo-drawing' events and calls clearCanvas function
		socket.on('undo-drawing', undoLastMove)

		// Cleanup function to remove event listeners
		return () => {
			canvas.removeEventListener('mousedown', handleMouseDown)
			canvas.removeEventListener('mouseup', handleMouseUp)
			canvas.removeEventListener('mousemove', handleMouseMove)
		}
	}, [isDrawing, color, width, mode])

	return (
		<div>
			<canvas ref={canvasRef} className="drawing-board" width={600} height={600} />
			<br />
            Colors:
			{colors.map((color, index) =>
				<ColorButton key={index} color={color} setColor={setColor} />
			)}
			<br />
			<label>
                Width:
				<input
					type="range"
					min="1"
					max="20"
					value={width}
					onChange={penWidth => setWidth(penWidth.target.value)}
				/>
			</label>
			<button onClick={() => setMode(mode === 'draw' ? 'erase' : 'draw')}>
                Switch to {mode === 'draw' ? 'Erase' : 'Draw'}
			</button>
			<button onClick={handleClearButton}>Clear</button>
			<button onClick={handleUndoButton}>Undo</button>
		</div>
	)
}

export default DrawingBoard
