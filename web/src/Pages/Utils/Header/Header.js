import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = activePage => {
    activePage = activePage == null ? '' : activePage;
    
    return ( 
        <nav>
            <div className="nav-wrapper blue-grey lighten-2">
                <NavLink to="/" className="brand-logo">Logo</NavLink>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to="/sobre" activeClassName="active">Quem Somos</NavLink></li>
                    <li><NavLink to="/contato" className={activePage === 'contato' ? 'active' : ''}>Contato</NavLink></li>
                </ul>
            </div>
        </nav>
    )
}

export default Header;