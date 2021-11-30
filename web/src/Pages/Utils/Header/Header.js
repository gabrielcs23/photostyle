import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = activePage => {
    activePage = activePage == null ? '' : activePage;

    const logo = {
        height: "inherit",
        padding: "0.4rem"
    }
    
    return (
        <nav>
            <div className="nav-wrapper grey darken-4">
                <NavLink to="/" style={{height: "inherit"}}>
                    <img 
                        src={process.env.PUBLIC_URL + "/logo.png"}
                        alt="Logo"
                        className="brand-logo left hide-on-small-only"
                        style={{...logo, marginLeft: "3rem"}}
                    />
                    <img 
                        src={process.env.PUBLIC_URL + "/logo.png"}
                        alt="Logo"
                        className="brand-logo center hide-on-med-and-up"
                        style={{...logo, marginLeft: "unset"}}
                    />
                </NavLink>
                <ul id="nav-mobile" className="right hide-on-small-only">
                    {/* <li><NavLink to="/sobre" activeClassName="active">Quem Somos</NavLink></li>
                    <li><NavLink to="/contato" className={activePage === 'contato' ? 'active' : ''}>Contato</NavLink></li> */}
                </ul>
            </div>
        </nav>
    )
}

export default Header;