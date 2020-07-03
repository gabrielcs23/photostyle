import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Rotas from '../AreaAdminRotas';
import AlunoService from './AlunoService';
import Aluno from '../../../Model/Aluno';
import FormValidator from '../form-utils/FormValidator';
import PopUp from '../../Utils/pop-up/PopUp';
import M from 'materialize-css';
import IrmaoForm from './irmao-form/IrmaoForm';
import FotoDropzone from '../../Utils/FotoDropzone/FotoDropzone';
import Foto from '../../../Model/Foto';

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

        const { turma } = this.props;
        if (!params.id) {
            this.state = {
                id: '',
                nome: '',
                matricula: '',
                escola: turma ? turma.escola : '',
                turma: turma,
                foto: null,
                irmaoRel: null,
                validacao: this.validador.valido(),
                canSubmit: false
            }
        } else {
            this.state = {
                id: params.id,
                nome: '',
                matricula: '',
                escola: turma ? turma.escola : '',
                turma: turma,
                foto: null,
                irmaoRel: null,
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
                        irmaoRel: aluno.irmaoRel
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
            const aluno = this.getAluno();
            AlunoService.postAluno(aluno)
                .then(aluno => {
                    if(this.state.id) {
                        PopUp.sucesso('Aluno(a) atualizado(a) com sucesso');
                    } else {
                        PopUp.sucesso('Aluno(a) cadastrado(a) com sucesso');
                    }
                    if (this.state.foto && !this.state.foto.id) {
                        return AlunoService.uploadFoto(aluno.id, this.state.foto.formData)
                            .then(() => PopUp.sucesso('Foto enviada com sucesso'))
                            .catch(() => PopUp.erro('Erro no envio da foto'))
                    }
                })
                .then(() => this.props.history.push(Rotas.ALUNO_LISTA))
                .catch(() => {
                    PopUp.erro('Erro no cadastro de aluno');
                    this.setState({canSubmit: true});
                });
        } else {
            const { nome } = validacao;
            const campos = [nome];

            const camposInvalidos = campos.filter(elem => elem.isInvalid);
            camposInvalidos.forEach(campo => PopUp.erro(campo.message));
        }
    }

    getAluno() {
        const aluno = new Aluno(this.state.nome, this.state.matricula, this.state.escola, this.state.turma);
        aluno.setIrmaoRel(this.state.irmaoRel);
        if (this.state.id) {
            aluno.id = this.state.id;
            if (this.state.foto?.id) {
                aluno.foto = this.state.foto
            }
        }

        return aluno;
    }

    onFotoDrop(arq) {
        if (this.state.foto?.id) {
            PopUp.aviso('Foto individual será substituída');
        }
        const foto = new Foto(arq);
        this.setState({foto: foto, canSubmit: true});
    }

    removerFoto() {
        const foto = this.state.foto;
        if (foto.id) {
            AlunoService.removerFoto(this.state.id)
                .then(() => PopUp.sucesso('Foto removida com sucesso'))
                .catch(error => PopUp.erro(error));
        }
        this.setState({foto: null});
    }

    relacionarIrmao(irmaoRel) {
        if (this.validador.valida(this.state)) {
            this.setState({irmaoRel: irmaoRel, canSubmit: true})
        } else {
            this.setState({irmaoRel: irmaoRel});
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
                            onClick={() => this.submitForm()}
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

                <FotoDropzone
                    fotos={this.state.foto ? [this.state.foto] : null}
                    multiple={false}
                    onFotoDrop={foto => this.onFotoDrop(foto)}
                    removerFoto={() => this.removerFoto()} 
                />

                {this.state.escola ? 
                    <IrmaoForm 
                        escolaId={this.state.escola.id}
                        irmaoRel={this.state.irmaoRel}
                        relacionarIrmao={irmaoRel => this.relacionarIrmao(irmaoRel)}
                        alunoId={this.state.id}
                    />
                    : null
                }
            </form>
        );
    }

}
export default AlunoForm;
