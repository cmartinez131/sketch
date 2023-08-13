import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import End from '../components/End'
import '../styles.css'

const EndGame = ({ players }) => {

  return (
    <div>
      <End players={players}></End>
    </div>
    )
}

export default EndGame