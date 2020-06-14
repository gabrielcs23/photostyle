import React, { Component } from 'react';
import Rotas from '../AreaAdminRotas';
import TurmaService from './TurmaService';
import Turma from '../../../Model/Turma';
import FormValidator from '../form-utils/FormValidator';
import PopUp from '../../Utils/pop-up/PopUp'

class TurmaForm extends Component {

    constructor(props) {
        super(props);

        this.validador = new FormValidator([
            {
                campo: 'nome',
                metodo: 'isEmpty',
                validoQuando: false,
                mensagem: 'Entre com um nome'
            },
        ]);

        this.stateInicial = {
            nome: '',
            escola: this.props.escola,
            fotos: [],
            validacao: this.validador.valido(),
            canSubmit: false
        }

        this.state = this.stateInicial;
    }

    componentDidMount() {
        if(this.props.escola == null) {
            this.props.history.push(Rotas.ESCOLA_LISTA);  
        }
    }

    inputChangeHandler = (event) => {
        const { name, value } = event.target;

        this.setState({
            [name]: value,
            canSubmit: this.state.canSubmit ? this.state.canSubmit : !this.state.canSubmit
        });
    }

    submitForm = () => {
        this.setState({canSubmit: false});
        const validacao = this.validador.valida(this.state);

        if (validacao.isValid) {
            const turma = new Turma(this.state.nome, this.state.escola);
            turma.fotos = this.state.fotos;
            TurmaService.postTurma(turma)
                .then(res => res.data)
                .then(turma => {
                    this.props.selecionar(turma);
                    // TODO mudar para aluno form
                    this.props.history.push(Rotas.TURMA_LISTA);
                    PopUp.sucesso('Escola cadastrada com sucesso');
                })
                .catch(error => {
                    PopUp.erro(error);
                });
        } else {
            const { nome } = validacao;
            const campos = [nome];

            const camposInvalidos = campos.filter(elem => elem.isInvalid);
            camposInvalidos.forEach(campo => PopUp.erro(campo.message));
        }
    }

    render() {
        const { nome } = this.state;
        return (
            <form>
                <div className="row">
                    <div className="col s12">
                        <div className="float-right">
                            <button 
                                className="btn waves-effect waves-light blue btn-small"
                                disabled={!this.state.canSubmit}
                                onClick={this.submitForm}
                                type="button"
                                >
                                <span className="d-inline-flex">
                                    <i className="material-icons">save</i>
                                    <span className="pl-2">Salvar</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <label htmlFor="nome">Nome da Turma</label>
                        <input 
                            className="validate"
                            id="nome"
                            type="text"
                            name="nome"
                            value={nome}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                </div>
            </form>
        )
    }

}
export default TurmaForm;
