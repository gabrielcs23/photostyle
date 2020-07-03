import React, { useState } from 'react';
import './TurmaCard.css';
import CardActions from '../../../Utils/CardActions/CardActions';
import ModalConfirmarExclusao from '../../../Utils/Modal/Modal';

const TurmaCard = (props) => {
    const [hovered, setHovered] = useState(false);
    const toggleHover = () => setHovered(!hovered);

    const { turma } = props;
    
    const idModal = `modal-confirmar-exclusao-${turma.id}`

    return (
        <div className="col s12 m6 xl4">

            <div className={`card small blue-grey lighten-1 ${hovered ? 'z-depth-5' : 'z-depth-2'}`}
                onMouseEnter={toggleHover}
                onMouseLeave={toggleHover}
            >
                
                <CardActions idModal={idModal} editar={props.editar} />

                <div className="card-image"
                    onClick={props.selecionar}
                >
                    <img src={turma.fotos ? turma.fotos[0]?.url : undefined} alt='' />
                </div>


                <div className="card-content center-align white-text"
                    onClick={props.selecionar}
                >
                    <div className="card-title mb-0 text-truncate">
                        <span>{turma.nome}</span>
                    </div>
                    <p>Alunos: {turma.alunos ? turma.alunos.length : '0'}</p>
                    <p>Fotos: {turma.fotos ? turma.fotos.length : '0'}</p>

                </div>

            </div>

            <ModalConfirmarExclusao
                idModal={idModal}
                titulo={`Excluir ${turma.nome}?`}
                mensagem={(
                    <div>
                        <p>Tem certeza de que deseja excluir a turma {turma.nome}?</p>
                        { turma.alunos || turma.fotos ? 
                            <>
                                <p>Também serão excluídos:</p>
                                <ul className="browser-default">
                                    {turma.alunos ? <li className="browser-default">{turma.alunos.length} alunos</li> : null}
                                    {turma.fotos ? <li className="browser-default">{turma.fotos.length} fotos</li> : null}
                                </ul>
                            </>
                            :
                            null
                        }
                    </div>
                )}
                confirmar={props.excluir}
            />
        </div>
    );
}
export default TurmaCard;
