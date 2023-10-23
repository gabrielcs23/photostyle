import React, { useState } from 'react';
import CardActions from '../../../Utils/CardActions/CardActions';
import ModalConfirmarExclusao from '../../../Utils/Modal/Modal';

const EscolaCard = (props) => {
    const [hovered, setHovered] = useState(false);
    const toggleHover = () => setHovered(!hovered);

    const { escola, loading } = props;
    const idModal = `modal-confirmar-exclusao-${escola.id}`

    return (
        <div className="col s6 m4">
            <div className={`card blue-grey lighten-1 ${hovered ? 'z-depth-5' : 'z-depth-2'}`}
                onMouseEnter={toggleHover}
                onMouseLeave={toggleHover}
            >
                {loading
                    ? (

                        <div className="card-content white-text center-align">
                            <div className="preloader-wrapper big active">
                                <div className="spinner-layer spinner-yellow-only">
                                    <div className="circle-clipper left">
                                        <div className="circle" />
                                    </div>
                                    <div className="gap-patch">
                                        <div className="circle" />
                                    </div>
                                    <div className="circle-clipper right">
                                        <div className="circle" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <CardActions idModal={idModal} editar={props.editar} />

                            <div className="card-content white-text"
                                onClick={props.selecionar}
                            >
                                <div className="card-title center-align">
                                    <span>{escola.nome}</span>
                                </div>
                                <p className="center align">
                                    {escola.apelido ? `Apelido: ${escola.apelido}` : ''}
                                    &nbsp;
                                </p>
                                {/*
                                <p>Turmas: {escola.turmas ? escola.turmas.length : '0'}</p>
                                */}
                            </div>
                        </>
                    )
                }
            </div>

            <ModalConfirmarExclusao
                idModal={idModal}
                titulo={`Excluir a escola ${escola.nome}?`}
                mensagem={(
                    <div>
                        <p>Tem certeza de que deseja excluir a escola {escola.nome}?</p>
                        <p>Também serão excluídos todas suas turmas e alunos.</p>
                    </div>
                )}
                confirmar={props.excluir}
            />
        </div>
    );
}
export default EscolaCard;
