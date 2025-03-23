import React, { useState } from 'react';
import CardActions from '../../../Utils/CardActions/CardActions';
import ModalConfirmarExclusao from '../../../Utils/Modal/Modal';

const AlunoCard = (props) => {
    const [hovered, setHovered] = useState(false);
    const toggleHover = () => setHovered(!hovered);

    const { aluno } = props;
    
    const idModal = `modal-confirmar-exclusao-${aluno.id}`

    return (
        <div className="col s12 m6 xl4">

            <div className={`card small blue-grey lighten-1 ${hovered ? 'z-depth-5' : 'z-depth-2'}`}
                onMouseEnter={toggleHover}
                onMouseLeave={toggleHover}
            >
                
                <CardActions idModal={idModal} editar={props.editar} />

                <div className="card-image">
                    <img src={aluno.foto?.url} alt='' />
                </div>


                <div className="card-content center-align white-text">
                    <div className="card-title text-truncate">
                        <span>{aluno.nome}</span>
                    </div>
                    <p className="mt-2">Código de Acesso: {aluno.codigoAcesso}</p>
                </div>

            </div>

            <ModalConfirmarExclusao
                idModal={idModal}
                titulo={`Excluir aluno ${aluno.nome}?`}
                mensagem={(
                    <div>
                        <p>Tem certeza de que deseja excluir o aluno {aluno.nome}?</p>
                        <p>Também serão excluídos todas suas fotos.</p>
                    </div>
                )}
                confirmar={props.excluir}
            />
        </div>
    );
}
export default AlunoCard;
