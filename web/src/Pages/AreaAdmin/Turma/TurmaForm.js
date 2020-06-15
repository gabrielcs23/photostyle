import React, { Component } from 'react';
import Rotas from '../AreaAdminRotas';
import TurmaService from './TurmaService';
import Turma from '../../../Model/Turma';
import FormValidator from '../form-utils/FormValidator';
import PopUp from '../../Utils/pop-up/PopUp';
import M from 'materialize-css';

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

        const { match: { params } } = this.props;

        if (!params.id) {
            this.state = {
                id: '',
                nome: '',
                escola: this.props.escola,
                alunos: [],
                fotos: [],
                validacao: this.validador.valido(),
                canSubmit: false
            }
        } else {
            this.state = {
                id: params.id,
                nome: '',
                escola: '',
                alunos: [],
                fotos: [],
                validacao: this.validador.valido(),
                canSubmit: false
            }
        }
    }

    componentDidMount() {
        if(this.state.id) {
            TurmaService.getPorId(this.state.id)
                .then(turma => {
                    this.setState({
                        id: turma.id,
                        nome: turma.nome,
                        escola: turma.escola,
                        alunos: turma.alunos ? turma.alunos : [],
                        fotos: turma.fotos ? turma.fotos : []
                    });
                    M.updateTextFields();
                })
                .catch(error => PopUp.erro(error));
        } else if(this.props.escola == null) {
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
            if (this.state.id) {
                turma.id = this.state.id;
                turma.alunos = this.state.alunos;
            }

            TurmaService.postTurma(turma)
                .then(res => res.data)
                .then(turma => {
                    if(this.state.id) {
                        this.props.history.push(Rotas.TURMA_LISTA);
                        PopUp.sucesso('Turma atualizada com sucesso');
                    } else {
                        this.props.selecionar(turma);
                        // TODO mudar para aluno novo
                        this.props.history.push(Rotas.TURMA_LISTA);
                        PopUp.sucesso('Turma cadastrada com sucesso');
                    }
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
