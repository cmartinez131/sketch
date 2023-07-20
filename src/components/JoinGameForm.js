import React, { useState } from 'react';

const JoinGameForm = ({ onJoin }) => {
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onJoin({ name, avatar });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
            </label>
            <label>
                Avatar:
                <select value={avatar} onChange={e => setAvatar(e.target.value)}>
                    {/* Add options for each available avatar */}
                </select>
            </label>
            <button type="submit">Join Game</button>
        </form>
    );
};

export default JoinGameForm;