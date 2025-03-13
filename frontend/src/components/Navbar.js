import { Link } from 'react-router-dom';
import { GiMoneyStack, GiMeditation } from "react-icons/gi";
import { FaHeadphonesAlt } from "react-icons/fa";


const Navbar = () => {
  return (
    <header>
        <div className="menu-options">
            <GiMoneyStack />
            <h1>budget tracker</h1>
            <GiMeditation />
            <h1>habits log</h1>
            <FaHeadphonesAlt />
            <h1>study corner</h1>
                
            
        </div>

    </header>
  );
}

export default Navbar;