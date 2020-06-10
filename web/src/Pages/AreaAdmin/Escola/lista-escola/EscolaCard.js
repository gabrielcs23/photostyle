import React, { useState } from 'react';

const EscolaCard = (props) => {
    const [hovered, setHovered] = useState(false);
    const toggleHover = () => setHovered(!hovered);

    const { escola } = props;

    return (
        <div className="col s6 m3">
            <div className={`card blue-grey lighten-1 ${hovered ? 'z-depth-5' : 'z-depth-2'}`}
                onMouseEnter={toggleHover}
                onMouseLeave={toggleHover}
            >
                <div className="card-content white-text">
                    <div className="card-title">
                        <div style={{textAlign: "center"}}>{escola.nome}</div>
                    </div>
                    <p>Turmas: {escola.turmas.length}</p>
                </div>
            </div>
        </div>
    );
}
export default EscolaCard;
