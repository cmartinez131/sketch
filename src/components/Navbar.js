import { Link } from 'react-router-dom';

const Navbar = () => {



    return (
        <>
        <div className='title'>
          <h1>Sketch</h1>
        </div>
        <div>
            <Link className='link' to="/">Join Game</Link>
            <Link className='link' to="/game">Game</Link>
        </div>

        </>
       

    );
};

export default Navbar;