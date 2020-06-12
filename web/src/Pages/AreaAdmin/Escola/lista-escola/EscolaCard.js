import React, { useState } from 'react';

const EscolaCard = (props) => {
    const [hovered, setHovered] = useState(false);
    const toggleHover = () => setHovered(!hovered);

    const { escola } = props;

    return (
        <div className="col s6 m4">
            <div className={`card blue-grey lighten-1 ${hovered ? 'z-depth-5' : 'z-depth-2'}`}
                onMouseEnter={toggleHover}
                onMouseLeave={toggleHover}
                onClick={props.seleciona}
            >
                <div className="card-content white-text">
                    <div className="card-title center-align">
                        <span>{escola.nome}</span>
                    </div>
                    <p className="center align">
                        {escola.apelido ? `Apelido: ${escola.apelido}` : ''}
                        &nbsp;
                    </p>
                    <p>Turmas: {escola.turmas ? escola.turmas.length : '0'}</p>
                </div>
            </div>
        </div>
    );
}
export default EscolaCard;
