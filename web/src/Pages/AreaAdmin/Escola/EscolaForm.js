import React, { Component } from 'react';
import Rotas from '../AreaAdminRotas';
import EscolaService from './EscolaService';
import Escola from '../../../Model/Escola';
import FormValidator from '../form-utils/FormValidator';
import PopUp from '../../Utils/pop-up/PopUp'

class EscolaForm extends Component {
    
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
            apelido: '',
            validacao: this.validador.valido(),
            canSubmit: false
        }

        this.state = this.stateInicial;

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
            const escola = new Escola(this.state.nome);
            escola.apelido = this.state.apelido;
            EscolaService.postEscola(escola)
                .then(res => res.data)
                .then(escola => {
                    this.props.selecionar(escola);
                    this.props.history.push(Rotas.TURMA_NOVO);
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
        const { nome, apelido } = this.state;
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
                        <label htmlFor="nome">Nome da Escola</label>
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
                <div className="row">
                    <div className="input-field col s6">
                        <label htmlFor="apelido">Apelido</label>
                        <input 
                            id="nome"
                            type="text"
                            name="apelido"
                            value={apelido}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                </div>
            </form>
        )
    }


}
export default EscolaForm;
