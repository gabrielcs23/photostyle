import React from 'react';
import BasePage from '../BasePage/BasePage';
import service from './MostruarioService';
import PopUp from '../Utils/pop-up/PopUp';
import ImgBox from '../Utils/ImgBox/ImgBox';

export default class Mostruario extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            kit: null
        }
    }

    componentDidMount() {
        const { match: { params: {chave} } } = this.props;
        service.getKit(chave)
            .then(kit => this.setState({kit: kit}))
            .catch(error => {
                if (error.status) {
                    PopUp.erro(`Erro ${error.status}: ${error.data}`);
                } else {
                    PopUp.erro(error);
                }
            });
    }

    renderPage() {
        const { kit } = this.state;
        if (kit == null) {
            return (
                <span>Carregando</span>
            );
        }
        const { codigoAcesso, escola, turma, nomeAluno, fotoIndividual, fotosIrmaos, fotosTurma } = kit;
        return (
            <>
                <div className="title center">
                    <h3>Kit Escolar</h3>
                </div>
                <div className="content">
                    <div className="container">
                        <div className="left-align">
                            <p>
                                <b>Código de Acesso:</b> {codigoAcesso}
                            </p>
                            <p>
                                <b>Escola:</b> {escola}
                            </p>
                            <p>
                                <b>Turma:</b> {turma}
                            </p>
                            <p>
                                <b>Aluno:</b> {nomeAluno}
                            </p>
                        </div>
                    </div>

                    
                    <div className="container center" id="fotoIndividual">
                        <ImgBox img={fotoIndividual.url} />
                    </div>

                </div>
            </>
        );
    }

}