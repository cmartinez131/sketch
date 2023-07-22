import { Link } from 'react-router-dom';

const Navbar = () => {

    return (
        <div>
            <div>
                <Link className='link' to="/">Join Game</Link>
                <Link className='link' to="/game">Game</Link>
            </div>

        </div >


    );
};

export default Navbar;