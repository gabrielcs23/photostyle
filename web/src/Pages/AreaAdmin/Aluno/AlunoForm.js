import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Rotas from '../AreaAdminRotas';
import AlunoService from './AlunoService';
import Aluno from '../../../Model/Aluno';
import FormValidator from '../form-utils/FormValidator';
import PopUp from '../../Utils/pop-up/PopUp';
import M from 'materialize-css';

class AlunoForm extends Component {

    constructor(props) {
        super(props);

        this.validador = new FormValidator([
            {
                campo: 'nome',
                metodo: 'isEmpty',
                validoQuando: false,
                mensagem: 'Entre com um nome'
            },
            {
                campo: 'matricula',
                metodo: 'isEmpty',
                validoQuando: false,
                mensagem: 'Entre com uma matrícula'
            },
        ]);

        const { match: { params } } = this.props;

        if (!params.id) {
            const { turma } = this.props;
            this.state = {
                id: '',
                nome: '',
                matricula: '',
                escola: turma ? turma.escola : '',
                turma: turma,
                foto: null,
                validacao: this.validador.valido(),
                canSubmit: false
            }
        } else {
            this.state = {
                id: params.id,
                nome: '',
                matricula: '',
                escola: '',
                turma: '',
                foto: null,
                validacao: this.validador.valido(),
                canSubmit: false
            }
        }
    }

    componentDidMount() {
        if(this.state.id) {
            AlunoService.getPorId(this.state.id)
                .then(aluno => {
                    this.setState({
                        id: aluno.id,
                        nome: aluno.nome,
                        matricula: aluno.matricula,
                        escola: aluno.escola,
                        turma: aluno.turma,
                        foto: aluno.foto,
                    });
                    M.updateTextFields();
                })
                .catch(error => PopUp.erro(error));
        } else if(this.props.turma == null) {
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
            const aluno = new Aluno(this.state.nome, this.state.matricula, this.state.escola, this.state.turma);
            aluno.foto = this.state.foto;
            if (this.state.id) {
                aluno.id = this.state.id;
                // TODO
                // aluno.irmaoRel = this.state.irmaoRel;
            }

            AlunoService.postAluno(aluno)
                .then(res => res.data)
                .then(aluno => {
                    if(this.state.id) {
                        this.props.history.push(Rotas.ALUNO_LISTA);
                        PopUp.sucesso('Aluno(a) atualizado(a) com sucesso');
                    } else {
                        this.props.selecionar(aluno);
                        this.props.history.push(Rotas.ALUNO_LISTA);
                        PopUp.sucesso('Aluno(a) cadastrado(a) com sucesso');
                    }
                })
                .catch(error => {
                    PopUp.erro(error);
                    this.setState({canSubmit: true});
                });
        } else {
            const { nome } = validacao;
            const campos = [nome];

            const camposInvalidos = campos.filter(elem => elem.isInvalid);
            camposInvalidos.forEach(campo => PopUp.erro(campo.message));
        }
    }

    render() {
        const { nome, matricula } = this.state;
        return (
            <form>
                <div className="row">
                    <div className="col left">
                        <NavLink to={Rotas.ALUNO_LISTA}>
                            <button 
                                className="btn btn-small waves-effect waves-light grey darken-1"
                                >
                                Cancelar
                            </button>
                        </NavLink>
                    </div>
                    <div className="col right">
                        <button
                            className="btn btn-small waves-effect waves-light blue"
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
                <div className="row">
                    <div className="input-field col s12">
                        <label htmlFor="nome">Nome do Aluno</label>
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
                        <label htmlFor="matricula">Matrícula</label>
                        <input 
                            className="validate"
                            id="matricula"
                            type="text"
                            name="matricula"
                            value={matricula}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                </div>
            </form>
        );
    }

}
export default AlunoForm;
