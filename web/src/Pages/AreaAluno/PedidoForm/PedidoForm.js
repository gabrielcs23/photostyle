import React, { Component } from 'react';
import FormValidator from '../../AreaAdmin/form-utils/FormValidator';
import PopUp from '../../Utils/pop-up/PopUp';
import M from 'materialize-css';
import Cleave from 'cleave.js/react';

export default class PedidoForm extends Component {
    constructor(props) {
        super(props);

        this.validador = new FormValidator([
            {
                campo: 'responsavel',
                metodo: 'isEmpty',
                validoQuando: false,
                mensagem: 'Digite nome do responsável'
            },
            {
                campo: 'tel',
                metodo: 'isEmpty',
                validoQuando: false,
                mensagem: 'Digite telefone para contato'
            },
        ]);

        this.state = {
            aluno: props.aluno,
            turma: props.turma,
            responsavel: '',
            tel: '',
            validacao: this.validador.valido(),
            canSubmit: false
        }
    }

    componentDidMount() {
        M.updateTextFields();
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

        } else {
            const { nome, matricula } = validacao;
            const campos = [nome, matricula];

            const camposInvalidos = campos.filter(elem => elem.isInvalid);
            camposInvalidos.forEach(campo => PopUp.erro(campo.message));
        }
    }

    render() {
        const { aluno, turma, responsavel, tel } = this.state;
        const telFormat = {
            delimiters: [' ', '-'],
            blocks: [2, 5, 4],
            uppercase: true
        }
        return (
            <form>
                <div className="row">
                    <div className="input-field col s12">
                        <label htmlFor="aluno">Aluno</label>
                        <input 
                            className="validate"
                            id="aluno"
                            type="text"
                            name="aluno"
                            value={aluno}
                            disabled
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12 m6">
                        <label htmlFor="turma">Turma</label>
                        <input 
                            className="validate"
                            id="turma"
                            type="text"
                            name="turma"
                            value={turma}
                            disabled
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="input-field col s12 m6">
                        <label htmlFor="responsavel">Nome do(a) Responsável</label>
                        <input 
                            className="validate"
                            id="responsavel"
                            type="text"
                            name="responsavel"
                            value={responsavel}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                    <div className="input-field col s12 m6">
                        <label htmlFor="tel">Tel. Contato</label>
                        <Cleave
                            className="validate"
                            id="tel"
                            type="text"
                            name="tel"
                            value={tel}
                            options={telFormat}
                            onChange={this.inputChangeHandler}
                        />

                    </div>
                </div>

                <div className="row input-field">
                    {/* <label htmlFor="tel">Tel. Contato</label> */}
                    <div className="col s12">
                        <input
                            className="filled-in"
                            type="checkbox"
                            id="kit"
                            name="kit"
                        />
                        <span>Kit Fotográfico (duas fotos diagramadas 15x21, aluno e turma)</span>
                    </div>
                    <div className="col s12">
                        <input
                            className="filled-in"
                            type="checkbox"
                            id="kitIrmao"
                            name="kitIrmao"
                        />
                        <span>Kit Fotográfico (idem acima + uma 10x15 dos irmãos)</span>
                    </div>
                </div>

                {/* Submit Form */}
                <div className="row">
                    <div className="col right">
                        <button
                            className="btn btn-small waves-effect waves-light blue"
                            disabled={!this.state.canSubmit}
                            onClick={() => this.submitForm()}
                            type="button"
                            >
                            <span className="d-inline-flex">
                                <span className="pl-2">Fazer pedido!</span>
                            </span>
                        </button>
                    </div>
                </div>
            </form>
        )
    }

}