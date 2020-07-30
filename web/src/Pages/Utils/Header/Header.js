import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = activePage => {
    activePage = activePage == null ? '' : activePage;
    
    return ( 
        <nav>
            <div className="nav-wrapper blue-grey darken-3">
                <NavLink to="/" className="brand-logo" style={{height: "inherit"}}>
                    <img 
                        src={process.env.PUBLIC_URL + "/logo.png"}
                        alt="Logo"
                        className="hide-on-small-only"
                        style={{height: "inherit", marginLeft: "3rem"}}
                    />
                    <img 
                        src={process.env.PUBLIC_URL + "/logo.png"}
                        alt="Logo"
                        className="brand-logo center hide-on-med-and-up"
                        style={{height: "inherit", marginLeft: "unset"}}
                    />
                </NavLink>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to="/sobre" activeClassName="active">Quem Somos</NavLink></li>
                    <li><NavLink to="/contato" className={activePage === 'contato' ? 'active' : ''}>Contato</NavLink></li>
                </ul>
            </div>
        </nav>
    )
}

export default Header;