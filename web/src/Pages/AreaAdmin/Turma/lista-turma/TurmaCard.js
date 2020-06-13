import React, { useState } from 'react';
import './TurmaCard.css';
import CardActions from '../../../Utils/CardActions/CardActions';

const TurmaCard = (props) => {
    const [hovered, setHovered] = useState(false);
    const toggleHover = () => setHovered(!hovered);

    const { turma } = props;

    return (
        <div className="col s6 m4">
            <div className={`card horizontal blue-grey lighten-1 ${hovered ? 'z-depth-5' : 'z-depth-2'}`}
                onMouseEnter={toggleHover}
                onMouseLeave={toggleHover}
            >
                <div className="card-image"
                    onClick={props.selecionar}
                >
                    <img src="https://www.bournemouthecho.co.uk/resources/images/9348617?type=responsive-gallery-fullscreen" alt='' />
                </div>

                <CardActions editar={props.editar} excluir={props.excluir} />

                <div className="card-content center-align white-text"
                    onClick={props.seleciona}
                >
                    <div className="card-title mb-0">
                        <span>{turma.nome}</span>
                    </div>
                    <p>Alunos: {turma.alunos ? turma.alunos.length : '0'}</p>
                    <p>Fotos: {turma.fotos ? turma.fotos.length : '0'}</p>

                </div>

            </div>
        </div>
    );
}
export default TurmaCard;
