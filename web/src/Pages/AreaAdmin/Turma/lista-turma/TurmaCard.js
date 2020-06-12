import React, { useState } from 'react';

const TurmaCard = (props) => {
    const [hovered, setHovered] = useState(false);
    const toggleHover = () => setHovered(!hovered);

    const { turma } = props;

    return (
        <div className="col s6 m4">
            <div className={`card blue-grey lighten-1 ${hovered ? 'z-depth-5' : 'z-depth-2'}`}
                onMouseEnter={toggleHover}
                onMouseLeave={toggleHover}
                onClick={props.seleciona}
            >
                <div className="card-content white-text">
                    <div className="card-title center-align">
                        <span>{turma.nome}</span>
                    </div>
                    <div className="row mb-0">
                        {/* Visível apenas de telas md para baixo */}
                        <div className="col s12 hide-on-large-only">
                            <p>Alunos: {turma.alunos ? turma.alunos.length : '0'}</p>  
                        </div>
                        <div className="col s12 hide-on-large-only">
                            <p>Fotos: {turma.fotos ? turma.fotos.length : '0'}</p>
                        </div>

                        {/* Visível apenas de telas lg para cima */}
                        <div className="col l6 left-align hide-on-med-and-down">
                            <p>Alunos: {turma.alunos ? turma.alunos.length : '0'}</p>  
                        </div>
                        <div className="col l6 right-align hide-on-med-and-down">
                            <p>Fotos: {turma.fotos ? turma.fotos.length : '0'}</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
export default TurmaCard;
