import React, { useState, useEffect } from 'react';

const Guess = ({ player, messages, sendMessage }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleInputChange = (event) => {
        setNewMessage(event.target.value);
    }

    const handleSendMessage = (event) => {
        event.preventDefault();
        if (newMessage.trim() !== '') {
            sendMessage({ user: player.name, text: newMessage });
            setNewMessage('');
        }
    }

    return (
        <div className="chat-container">
            <div className="chat-log">
                <ul>
                    {messages.map((message, i) =>
                        <li key={i} style={{ backgroundColor: i % 2 === 0 ? 'white' : 'lightblue' }}>
                            <b>{message.user !== 'System' ? `${message.user}: ` : ''}</b>
                            <strong style={{ color: message.user === 'System' ? message.color : 'black' }}>{message.text}</strong>
                        </li>
                    )}
                </ul>
            </div>
            <div className='chat-box'>
                <form onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
                        placeholder="Type your guess here..."
                    />
                </form>
            </div>
        </div>
    );
}

export default Guess;
